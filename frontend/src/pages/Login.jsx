import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../api/client.js';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      try { localStorage.setItem('user', JSON.stringify(res.user)); } catch (e) {}
      navigate('/domains');
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="auth-card">
      <h1>Welcome back</h1>
      <form onSubmit={onSubmit}>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">Login</button>
      </form>
      <p className="muted">No account? <Link to="/register">Create one</Link></p>
    </div>
  );
}