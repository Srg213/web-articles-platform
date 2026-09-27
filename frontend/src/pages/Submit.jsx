import React, { useState } from 'react';
import { api } from '../api';

const CATEGORIES = ['Memoir', 'Nature', 'Craft', 'Family', 'Travel', 'Reflection'];

export default function Submit() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [body, setBody] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.submit({ title, category, body });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (done) {
    return (
      <div className="confirm show">
        <div className="stamp">🌱</div>
        <h3 className="serif">Received -- thank you.</h3>
        <p className="note">Your essay is now in the queue. An editor will read it and get back to you with a note.</p>
        <button className="btn ghost" onClick={() => { setDone(false); setTitle(''); setBody(''); }}>Write another</button>
      </div>
    );
  }

  return (
    <>
      <h2 className="serif">Send us your essay</h2>
      <p className="note" style={{ marginTop: -6 }}>Every piece is read by a real editor before it's published.</p>
      <form className="card" onSubmit={onSubmit}>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What are you calling it?" />
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <label>Your essay</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Start writing..." />
        {error && <p className="note" style={{ color: 'var(--rose)' }}>{error}</p>}
        <button className="btn" type="submit">Submit for review</button>
      </form>
    </>
  );
}
