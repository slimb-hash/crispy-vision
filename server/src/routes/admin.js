import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Reservation, STATUSES } from '../models/Reservation.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Bloque les attaques par force brute sur le mot de passe.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Réessaie dans 15 minutes.' },
});

// POST /api/admin/login — échange le mot de passe contre un jeton valide 8 h
router.post('/login', loginLimiter, async (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const ok = password && (await bcrypt.compare(password, env.adminPasswordHash));

  if (!ok) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }

  const token = jwt.sign({ role: 'admin' }, env.jwtSecret, { expiresIn: '8h' });
  res.json({ token });
});

// Toutes les routes ci-dessous exigent un jeton valide.
router.use(requireAdmin);

// GET /api/admin/reservations?status=pending
router.get('/reservations', async (req, res) => {
  const filter = STATUSES.includes(req.query.status) ? { status: req.query.status } : {};

  const [reservations, counts] = await Promise.all([
    Reservation.find(filter).sort({ createdAt: -1 }).limit(500).lean(),
    Reservation.aggregate([{ $group: { _id: '$status', total: { $sum: 1 } } }]),
  ]);

  const totals = { all: 0, pending: 0, accepted: 0, declined: 0 };
  for (const { _id, total } of counts) {
    totals[_id] = total;
    totals.all += total;
  }

  res.json({ reservations, totals });
});

// Refuse les identifiants qui ne sont pas des ObjectId MongoDB valides.
function findId(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ error: 'Réservation introuvable.' });
    return null;
  }
  return id;
}

// PATCH /api/admin/reservations/:id  { status?, adminNote? }
router.patch('/reservations/:id', async (req, res) => {
  const id = findId(req, res);
  if (!id) return;

  const update = {};
  if (req.body?.status !== undefined) {
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ error: `Statut invalide. Valeurs permises : ${STATUSES.join(', ')}.` });
    }
    update.status = req.body.status;
  }
  if (req.body?.adminNote !== undefined) {
    if (typeof req.body.adminNote !== 'string' || req.body.adminNote.length > 1000) {
      return res.status(400).json({ error: 'La note doit être un texte de 1000 caractères maximum.' });
    }
    update.adminNote = req.body.adminNote.trim();
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'Rien à modifier : envoie status ou adminNote.' });
  }

  const reservation = await Reservation.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!reservation) return res.status(404).json({ error: 'Réservation introuvable.' });
  res.json({ reservation });
});

// DELETE /api/admin/reservations/:id
router.delete('/reservations/:id', async (req, res) => {
  const id = findId(req, res);
  if (!id) return;

  const deleted = await Reservation.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Réservation introuvable.' });
  res.status(204).end();
});

export default router;
