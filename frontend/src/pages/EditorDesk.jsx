import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function EditorDesk() {
  const { user } = useAuth();
  const [queue, setQueue] = useState(null);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState('');

  function load() {
    api.queue().then(d => setQueue(d.articles)).catch(e => setError(e.message));
  }
  useEffect(load, []);

  async function claim(id) {
    await api.claim(id); load();
  }
  async function publish(id) {
    await api.publish(id); load();
  }
  async function sendBack(id) {
    await api.returnArticle(id, notes[id] || ''); load();
  }

  if (error) return <p className="empty">{error}</p>;
  if (!queue) return <p className="empty">Loading...</p>;

  return (
    <>
      <h2 className="serif">Editor desk</h2>
      <p className="note" style={{ marginTop: -6 }}>Signed in as {user.name} ({user.role}).</p>
      {queue.length === 0 && <p className="empty">Queue is empty -- nice work.</p>}
      {queue.map(a => (
        <div className="sub" key={a.id}>
          <h3>{a.title}</h3>
          <div className="meta">{a.author_name} - {a.category}</div>
          <div className="editorbox">
            {a.editor_name ? `Claimed by ${a.editor_name}` : 'Unclaimed'}
          </div>
          <p>{a.excerpt}</p>
          <div className="row">
            {!a.editor_id && <button className="btn ghost" onClick={() => claim(a.id)}>Claim this piece</button>}
            {a.editor_id === user.id && (
              <button className="btn" onClick={() => publish(a.id)}>Approve &amp; publish</button>
            )}
          </div>
          {a.editor_id === user.id && (
            <>
              <textarea
                className="notefield"
                style={{ display: 'block' }}
                placeholder="Note to the author on what to revise..."
                value={notes[a.id] || ''}
                onChange={e => setNotes({ ...notes, [a.id]: e.target.value })}
              />
              <button className="btn rose" style={{ marginTop: 8 }} onClick={() => sendBack(a.id)}>Send back with this note</button>
            </>
          )}
        </div>
      ))}
    </>
  );
}
