const bcrypt = require('bcryptjs');
const db = require('./db');

function upsertUser(name, email, password, role) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return existing.id;
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
    .run(name, email, hash, role);
  return info.lastInsertRowid;
}

const mara = upsertUser('Mara Voss', 'mara@foxglove.test', 'editor123', 'editor');
const tomas = upsertUser('Tomas Reyes', 'tomas@foxglove.test', 'editor123', 'editor');
const elena = upsertUser('Elena Ruiz', 'elena@foxglove.test', 'author123', 'author');
const daniel = upsertUser('Daniel Okafor', 'daniel@foxglove.test', 'author123', 'author');

const count = db.prepare('SELECT COUNT(*) AS c FROM articles').get().c;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO articles (title, category, excerpt, body, status, author_id, editor_id, published_at)
    VALUES (?,?,?,?,?,?,?, datetime('now'))
  `);
  insert.run(
    'What the Garden Keeps', 'Nature',
    'Every spring I forget how much the foxgloves have spread, and every spring I let them.',
    'Every spring I forget how much the foxgloves have spread, and every spring I let them.\n\nThere is a particular kind of surrender that gardening asks of you: you plant with intention, and the garden answers with its own.\n\nI have stopped fighting it. Some years the garden knows better than I do what wants to grow.',
    'published', elena, mara
  );
  insert.run(
    'The Last Letter My Grandmother Wrote', 'Memoir',
    'It was four lines long, unfinished, and it took me a decade to understand why she stopped there.',
    'It was four lines long, unfinished, and it took me a decade to understand why she stopped there.\n\nShe wrote in the same looping hand she had used my whole life, the ink a little thinner near the end.\n\nWhen I finally opened it properly, what struck me was not what she said. It was what she chose to leave for last.',
    'published', daniel, tomas
  );
}

console.log('Seed complete. Sample logins:');
console.log('  editor:  mara@foxglove.test   / editor123');
console.log('  editor:  tomas@foxglove.test  / editor123');
console.log('  author:  elena@foxglove.test  / author123');
console.log('  author:  daniel@foxglove.test / author123');
