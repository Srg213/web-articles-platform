import React, { useEffect, useState } from 'react';
import { api } from '../api';

const STATUS_LABEL = { submitted: 'In review', published: 'Published', returned: 'Sent back to you' };
const STATUS_DOT = { submitted: 'review', published: 'pub', returned: 'back' };

export default function MySubmissions() {
  const [articles, setArticles] = useState(null);

  useEffect(() => { api.mine().then(d => setArticles(d.articles)); }, []);

  if (!articles) return <p className="empty">Loading...</p>;
  if (articles.length === 0) return <p className="empty">You haven't submitted anything yet.</p>;

  return (
    <>
      <h2 className="serif">My submissions</h2>
      {articles.map(a => (
        <div className="sub" key={a.id}>
          <h3>{a.title}</h3>
          <div className="meta">
            <span className={`dot ${STATUS_DOT[a.status]}`}></span> {STATUS_LABEL[a.status]}
            {a.editor_name ? ` -- editor: ${a.editor_name}` : ''}
          </div>
          {a.status === 'returned' && <p>{a.editor_note}</p>}
        </div>
      ))}
    </>
  );
}
