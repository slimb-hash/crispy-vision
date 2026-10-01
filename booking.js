// ── BOOKING FORM → API Crispy Vision ──
// En local (Live Server), on parle au serveur lancé avec « npm run dev ».
// En ligne (GitHub Pages), on parle à l'API hébergée sur Render.
const API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:3000'
  : 'https://crispy-vision-api.onrender.com'; // à ajuster au déploiement

const form = document.getElementById('reservationForm');

if (form) {
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');
  const fields = ['name', 'email', 'phone', 'service', 'sport', 'eventDate', 'location', 'message'];

  // Empêche de choisir une date passée dans le calendrier
  const dateInput = document.getElementById('eventDate');
  if (dateInput) dateInput.min = new Date().toLocaleDateString('en-CA');

  function clearErrors() {
    status.textContent = '';
    fields.forEach((name) => {
      const input = form.elements[name];
      const error = document.getElementById(`${name}-error`);
      if (input) input.removeAttribute('aria-invalid');
      if (error) error.textContent = '';
    });
  }

  function showFieldErrors(errors) {
    let first = null;
    Object.entries(errors).forEach(([name, message]) => {
      const input = form.elements[name];
      const error = document.getElementById(`${name}-error`);
      if (error) error.textContent = message;
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `${name}-error`);
        first = first || input;
      }
    });
    if (first) first.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = Object.fromEntries(new FormData(form));
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        window.location.href = 'confirmation.html';
        return;
      }
      if (res.status === 400 && body.fields) {
        showFieldErrors(body.fields);
        status.textContent = body.error;
      } else {
        status.textContent = body.error || 'Something went wrong. Try again in a moment.';
      }
    } catch {
      status.textContent =
        'Your request couldn’t be sent. Check your connection and try again, or DM @crispy_visiion on Instagram.';
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Book';
  });
}