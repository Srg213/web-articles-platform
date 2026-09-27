import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await api.login({ email, password });
      login(token, user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2 className="serif">Log in</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="note" style={{ color: 'var(--rose)' }}>{error}</p>}
        <button className="btn" type="submit">Log in</button>
      </form>
      <p className="note">No account? <Link to="/register">Join as a writer</Link></p>
      <p className="note">Try an editor account: mara@foxglove.test / editor123</p>
    </div>
  );
}
