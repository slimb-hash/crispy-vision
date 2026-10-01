import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import reservationsRouter from './routes/reservations.js';
import adminRouter from './routes/admin.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

export function createApp() {
  const app = express();

  // Render (et la plupart des hébergeurs) passent par un proxy :
  // nécessaire pour que la limite par IP voie la vraie adresse du client.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet()); // en-têtes de sécurité HTTP
  app.use(express.json({ limit: '20kb' }));

  // Seul le site (GitHub Pages ou Live Server) peut appeler la route publique.
  const corsForSite = cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origine non autorisée : ${origin}`));
    },
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  app.use('/api/reservations', corsForSite, reservationsRouter);
  app.use('/api/admin', adminRouter); // même origine que /admin : pas besoin de CORS

  // Tableau de bord : https://<ton-api>/admin
  app.use(express.static(publicDir, { index: false }));
  app.get('/admin', (req, res) => res.sendFile(path.join(publicDir, 'admin.html')));
  app.get('/', (req, res) => res.redirect('/admin'));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
