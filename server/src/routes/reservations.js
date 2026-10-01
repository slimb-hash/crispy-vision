import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Reservation } from '../models/Reservation.js';
import { validateReservation } from '../utils/validateReservation.js';
import { notifyNewReservation } from '../services/mailer.js';

const router = Router();

// Anti-spam : 5 demandes max par adresse IP toutes les 15 minutes.
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again in 15 minutes or DM @crispy_visiion on Instagram.' },
});

// POST /api/reservations — appelé par booking.html
router.post('/', createLimiter, async (req, res) => {
  // Pot de miel : champ caché « website » que seuls les robots remplissent.
  // On fait semblant que tout a marché pour ne pas les renseigner.
  if (req.body?.website) {
    return res.status(201).json({ message: 'Request received.' });
  }

  const { errors, data, isValid } = validateReservation(req.body);
  if (!isValid) {
    return res.status(400).json({ error: 'Check the highlighted fields.', fields: errors });
  }

  const reservation = await Reservation.create(data);

  // Le courriel ne doit jamais faire échouer la réservation.
  notifyNewReservation(reservation).catch((err) =>
    console.error('⚠️  Courriel non envoyé :', err.message)
  );

  res.status(201).json({ message: 'Request received.', id: reservation.id });
});

export default router;
