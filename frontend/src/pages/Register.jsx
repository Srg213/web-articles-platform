import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await api.register({ name, email, password });
      login(token, user);
      navigate('/submit');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2 className="serif">Join as a writer</h2>
      <form onSubmit={onSubmit}>
        <label>Your name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="note" style={{ color: 'var(--rose)' }}>{error}</p>}
        <button className="btn" type="submit">Create account</button>
      </form>
      <p className="note">Already have one? <Link to="/login">Log in</Link></p>
    </div>
  );
}
