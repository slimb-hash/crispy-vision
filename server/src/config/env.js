// Lit les variables d'environnement une seule fois et arrête le serveur
// avec un message clair s'il en manque une obligatoire.

const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_PASSWORD_HASH'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`❌ Variables d'environnement manquantes : ${missing.join(', ')}`);
  console.error('   Copie .env.example vers .env et remplis-les (voir le README du dossier server).');
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET doit faire au moins 32 caractères.');
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  // Liste séparée par des virgules : http://127.0.0.1:5500,https://slimb-hash.github.io
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  notifyEmail: process.env.NOTIFY_EMAIL,
};
