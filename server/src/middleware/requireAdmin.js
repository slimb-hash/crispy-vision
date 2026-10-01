import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Vérifie l'en-tête « Authorization: Bearer <jeton> » envoyé par le tableau de bord.
export function requireAdmin(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Connexion requise.' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.role !== 'admin') throw new Error('Rôle invalide');
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Session expirée. Reconnecte-toi.' });
  }
}
