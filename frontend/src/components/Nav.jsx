import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Nav() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isEditor = user && (user.role === 'editor' || user.role === 'admin');

  const link = (to, label) => (
    <Link className={pathname === to ? 'active' : ''} to={to}>{label}</Link>
  );

  return (
    <header className="top">
      <div className="topwrap">
        <div className="brand">Foxglove <em>journal</em></div>
        <nav className="tabs">
          {link('/', 'Read')}
          {user && link('/submit', 'Submit an essay')}
          {user && link('/mine', 'My submissions')}
          {isEditor && link('/editor', 'Editor desk')}
          {!user && link('/login', 'Log in')}
          {!user && link('/register', 'Join as a writer')}
          {user && (
            <button className="linklike" onClick={logout}>Log out ({user.name.split(' ')[0]})</button>
          )}
        </nav>
      </div>
    </header>
  );
}
