import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.publishedOne(id).then(d => setArticle(d.article)).catch(e => setError(e.message));
  }, [id]);

  if (error) return <p className="empty">{error}</p>;
  if (!article) return <p className="empty">Loading...</p>;

  return (
    <>
      <Link className="backbtn" to="/">&larr; Back to all essays</Link>
      <span className="tag">{article.category}</span>
      <h1 className="serif">{article.title}</h1>
      <div className="byline">by {article.author_name}</div>
      <div className="body-text">{article.body}</div>
    </>
  );
}
