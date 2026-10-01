import { SERVICES, SPORTS } from '../models/Reservation.js';

// Le site est en anglais : les messages d'erreur montrés aux clients le sont aussi.
// On ne fait jamais confiance au navigateur : tout est revérifié ici, côté serveur.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{7,25}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

export function validateReservation(body = {}) {
  const errors = {};
  const data = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    service: clean(body.service),
    sport: clean(body.sport),
    eventDate: clean(body.eventDate),
    location: clean(body.location),
    message: clean(body.message),
  };

  if (data.name.length < 2) errors.name = 'Enter your name.';
  else if (/[\r\n]/.test(data.name)) errors.name = 'Name must fit on one line.';
  else if (data.name.length > 100) errors.name = 'Name must be 100 characters or fewer.';

  if (!EMAIL_RE.test(data.email) || data.email.length > 254) {
    errors.email = 'Enter a valid email address, like you@email.com.';
  }

  if (data.phone && !PHONE_RE.test(data.phone)) {
    errors.phone = 'Enter a phone number using digits, spaces, +, - or parentheses.';
  }

  if (!SERVICES.includes(data.service)) errors.service = 'Choose a service from the list.';
  if (!SPORTS.includes(data.sport)) errors.sport = 'Choose a sport from the list.';

  if (data.eventDate) {
    const date = new Date(`${data.eventDate}T12:00:00Z`);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (!DATE_RE.test(data.eventDate) || Number.isNaN(date.getTime())) {
      errors.eventDate = 'Enter a valid date.';
    } else if (date < yesterday) {
      errors.eventDate = 'The event date can’t be in the past.';
    } else {
      data.eventDate = date;
    }
  } else {
    delete data.eventDate;
  }

  if (data.location.length > 120) errors.location = 'Location must be 120 characters or fewer.';

  if (data.message.length < 10) errors.message = 'Tell me a bit more about your project (10 characters minimum).';
  else if (data.message.length > 2000) errors.message = 'Message must be 2,000 characters or fewer.';

  return { errors, data, isValid: Object.keys(errors).length === 0 };
}
