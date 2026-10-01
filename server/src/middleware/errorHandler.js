export function notFound(req, res) {
  res.status(404).json({ error: `Route introuvable : ${req.method} ${req.originalUrl}` });
}

// Express 5 envoie ici toutes les erreurs, y compris celles des fonctions async.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Le corps de la requête n’est pas du JSON valide.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Requête trop volumineuse.' });
  }
  if (err.message?.startsWith('Origine non autorisée')) {
    return res.status(403).json({ error: err.message });
  }

  console.error('💥', err);
  // On ne renvoie jamais les détails techniques au client.
  res.status(500).json({ error: 'Erreur interne du serveur.' });
}
