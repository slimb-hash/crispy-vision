// Usage : npm run secrets
// Demande le mot de passe du tableau de bord, puis affiche les deux lignes
// à coller dans .env. Le mot de passe lui-même n'est jamais enregistré :
// seul son hash bcrypt l'est.

import { createInterface } from 'node:readline/promises';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = (await rl.question('Mot de passe du tableau de bord (12 caractères min.) : ')).trim();
rl.close();

if (password.length < 12) {
  console.error('❌ Trop court : choisis au moins 12 caractères.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const jwtSecret = randomBytes(48).toString('hex');

console.log('\n✅ Copie ces deux lignes dans server/.env (remplace celles qui existent) :\n');
console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\nPense à noter le mot de passe dans un endroit sûr : il ne s’affiche nulle part ailleurs.\n');
