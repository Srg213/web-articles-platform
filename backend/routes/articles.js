const express = require('express');
const db = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

function makeExcerpt(body) {
  const firstLine = body.split('\n')[0];
  return firstLine.length > 140 ? firstLine.slice(0, 140) + '...' : firstLine;
}

router.get('/published', (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, a.title, a.category, a.excerpt, a.published_at,
           u.name AS author_name
    FROM articles a JOIN users u ON u.id = a.author_id
    WHERE a.status = 'published'
    ORDER BY a.published_at DESC
  `).all();
  res.json({ articles: rows });
});

router.get('/published/:id', (req, res) => {
  const row = db.prepare(`
    SELECT a.*, u.name AS author_name
    FROM articles a JOIN users u ON u.id = a.author_id
    WHERE a.id = ? AND a.status = 'published'
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({ article: row });
});

router.post('/', requireAuth, (req, res) => {
  const { title, category, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' });
  const excerpt = makeExcerpt(body);
  const info = db.prepare(`
    INSERT INTO articles (title, category, excerpt, body, status, author_id)
    VALUES (?,?,?,?, 'submitted', ?)
  `).run(title, category || 'Reflection', excerpt, body, req.user.id);
  res.json({ id: info.lastInsertRowid });
});

router.get('/mine', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT a.*, e.name AS editor_name
    FROM articles a LEFT JOIN users e ON e.id = a.editor_id
    WHERE a.author_id = ?
    ORDER BY a.created_at DESC
  `).all(req.user.id);
  res.json({ articles: rows });
});

router.get('/queue', requireAuth, requireRole('editor', 'admin'), (req, res) => {
  const rows = db.prepare(`
    SELECT a.*, u.name AS author_name, e.name AS editor_name
    FROM articles a
    JOIN users u ON u.id = a.author_id
    LEFT JOIN users e ON e.id = a.editor_id
    WHERE a.status = 'submitted'
    ORDER BY a.created_at ASC
  `).all();
  res.json({ articles: rows });
});

router.post('/:id/claim', requireAuth, requireRole('editor', 'admin'), (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  if (article.editor_id && article.editor_id !== req.user.id) {
    return res.status(409).json({ error: 'Already claimed by another editor' });
  }
  db.prepare(`UPDATE articles SET editor_id = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(req.user.id, req.params.id);
  res.json({ ok: true });
});

router.post('/:id/publish', requireAuth, requireRole('editor', 'admin'), (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  if (article.editor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the claiming editor can publish this' });
  }
  db.prepare(`
    UPDATE articles SET status = 'published', published_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(req.params.id);
  res.json({ ok: true });
});

router.post('/:id/return', requireAuth, requireRole('editor', 'admin'), (req, res) => {
  const { note } = req.body;
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  if (article.editor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the claiming editor can return this' });
  }
  db.prepare(`
    UPDATE articles SET status = 'returned', editor_note = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(note || 'Needs another pass -- reach out to your editor for specifics.', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
