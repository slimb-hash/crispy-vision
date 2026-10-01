// Tableau de bord : connexion, liste, changement de statut, suppression.
// Tout le texte venant des clients passe par textContent (jamais innerHTML)
// pour empêcher l'injection de code (XSS).

const $ = (id) => document.getElementById(id);
const LABELS = { pending: 'En attente', accepted: 'Acceptée', declined: 'Refusée' };
let currentStatus = '';

const getToken = () => sessionStorage.getItem('token');

async function api(path, options = {}) {
  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (res.status === 401 && path !== '/login') {
    logout();
    throw new Error('Session expirée. Reconnecte-toi.');
  }
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur inconnue.');
  return data;
}

function show(view) {
  $('loginView').hidden = view !== 'login';
  $('dashboardView').hidden = view !== 'dashboard';
}

function logout() {
  sessionStorage.removeItem('token');
  show('login');
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderReservation(r) {
  const card = el('article', `resa ${r.status}`);

  const head = el('div', 'resa-head');
  head.append(el('h3', '', `${r.name} · ${r.service}`), el('span', 'badge', LABELS[r.status]));

  const meta = el('p', 'meta');
  const date = r.eventDate ? new Date(r.eventDate).toLocaleDateString('fr-CA', { timeZone: 'UTC' }) : 'date non précisée';
  meta.append(`${r.sport} · ${date} · ${r.location || 'lieu non précisé'} · `);
  const mail = el('a', '', r.email);
  mail.href = `mailto:${r.email}`;
  meta.append(mail);
  if (r.phone) {
    const tel = el('a', '', r.phone);
    tel.href = `tel:${r.phone.replace(/[^\d+]/g, '')}`;
    meta.append(' · ', tel);
  }
  meta.append(el('br'), `Reçue le ${new Date(r.createdAt).toLocaleString('fr-CA')}`);

  const actions = el('div', 'actions');
  const add = (label, className, onClick) => {
    const btn = el('button', className, label);
    btn.addEventListener('click', onClick);
    actions.append(btn);
  };
  if (r.status !== 'accepted') add('Accepter', '', () => setStatus(r._id, 'accepted'));
  if (r.status !== 'declined') add('Refuser', 'ghost', () => setStatus(r._id, 'declined'));
  if (r.status !== 'pending') add('Remettre en attente', 'ghost', () => setStatus(r._id, 'pending'));
  add('Supprimer', 'danger', () => removeReservation(r._id, r.name));

  card.append(head, meta, el('p', 'message', r.message), actions);
  return card;
}

async function load() {
  $('dashError').hidden = true;
  try {
    const query = currentStatus ? `?status=${currentStatus}` : '';
    const { reservations, totals } = await api(`/reservations${query}`);
    for (const key of Object.keys(totals)) $(`count-${key}`).textContent = totals[key];

    const list = $('list');
    list.replaceChildren();
    if (reservations.length === 0) {
      list.append(el('p', 'empty', 'Aucune réservation ici pour l’instant.'));
    } else {
      reservations.forEach((r) => list.append(renderReservation(r)));
    }
  } catch (err) {
    $('dashError').textContent = err.message;
    $('dashError').hidden = false;
  }
}

async function setStatus(id, status) {
  try {
    await api(`/reservations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  } catch (err) {
    $('dashError').textContent = err.message;
    $('dashError').hidden = false;
  }
}

async function removeReservation(id, name) {
  if (!confirm(`Supprimer définitivement la demande de ${name} ?`)) return;
  try {
    await api(`/reservations/${id}`, { method: 'DELETE' });
    load();
  } catch (err) {
    $('dashError').textContent = err.message;
    $('dashError').hidden = false;
  }
}

$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('loginError').hidden = true;
  try {
    const { token } = await api('/login', {
      method: 'POST',
      body: JSON.stringify({ password: $('password').value }),
    });
    sessionStorage.setItem('token', token);
    $('password').value = '';
    show('dashboard');
    load();
  } catch (err) {
    $('loginError').textContent = err.message;
    $('loginError').hidden = false;
  }
});

$('logoutBtn').addEventListener('click', logout);

document.querySelectorAll('.filters button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentStatus = btn.dataset.status;
    load();
  });
});

if (getToken()) {
  show('dashboard');
  load();
} else {
  show('login');
}
