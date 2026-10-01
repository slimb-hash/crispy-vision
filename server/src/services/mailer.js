import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Le courriel est optionnel : si les variables SMTP ne sont pas remplies,
// la réservation est quand même enregistrée, on n'envoie simplement rien.
const isConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.notifyEmail);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    })
  : null;

if (!isConfigured) {
  console.log('ℹ️  Courriel désactivé (variables SMTP_* ou NOTIFY_EMAIL vides).');
}

export async function notifyNewReservation(reservation) {
  if (!transporter) return;

  const date = reservation.eventDate
    ? reservation.eventDate.toISOString().slice(0, 10)
    : 'non précisée';

  // Texte brut uniquement : aucun risque d'injecter du HTML venant du formulaire.
  const text = [
    `Nouvelle demande de ${reservation.name}`,
    '',
    `Service : ${reservation.service}`,
    `Sport : ${reservation.sport}`,
    `Date : ${date}`,
    `Lieu : ${reservation.location || 'non précisé'}`,
    `Courriel : ${reservation.email}`,
    `Téléphone : ${reservation.phone || 'non fourni'}`,
    '',
    'Message :',
    reservation.message,
  ].join('\n');

  await transporter.sendMail({
    from: `"Crispy Vision" <${env.smtp.user}>`,
    to: env.notifyEmail,
    replyTo: reservation.email,
    subject: `Nouvelle réservation – ${reservation.service} (${reservation.name})`,
    text,
  });
}
