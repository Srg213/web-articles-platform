import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Read() {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.published().then(d => setArticles(d.articles)).catch(e => setError(e.message));
  }, []);

  if (error) return <p className="empty">{error}</p>;
  if (!articles) return <p className="empty">Loading...</p>;
  if (articles.length === 0) return <p className="empty">Nothing published yet -- the editor desk is still reading.</p>;

  const [featured, ...rest] = articles;

  return (
    <>
      <div className="featured">
        <span className="tag">{featured.category}</span>
        <h1>{featured.title}</h1>
        <div className="byline">by {featured.author_name}</div>
        <div className="excerpt">{featured.excerpt}</div>
        <Link className="readlink" to={`/articles/${featured.id}`}>Read the full essay &rarr;</Link>
      </div>
      {rest.map(a => (
        <Link key={a.id} to={`/articles/${a.id}`} className="entry">
          <span className="tag">{a.category}</span>
          <h3>{a.title}</h3>
          <div className="byline">by {a.author_name}</div>
          <p>{a.excerpt}</p>
        </Link>
      ))}
    </>
  );
}
