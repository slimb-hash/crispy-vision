import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

try {
  await connectDB(env.mongodbUri);
} catch (err) {
  console.error('❌ Impossible de se connecter à MongoDB :', err.message);
  console.error('   Vérifie MONGODB_URI dans .env et ton adresse IP dans Network Access (Atlas).');
  process.exit(1);
}

const server = createApp().listen(env.port, () => {
  console.log(`🚀 API prête sur http://localhost:${env.port}`);
  console.log(`🔐 Tableau de bord : http://localhost:${env.port}/admin`);
});

// Arrêt propre (Ctrl+C en local, redémarrage sur Render)
async function shutdown(signal) {
  console.log(`\n${signal} reçu, arrêt du serveur…`);
  server.close();
  await mongoose.connection.close();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
