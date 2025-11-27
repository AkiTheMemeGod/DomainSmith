import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../api/client.js';

export default function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.register({ email, password, name });
      setToken(res.token);
      setUser(res.user);
      try { localStorage.setItem('user', JSON.stringify(res.user)); } catch (e) {}
      navigate('/domains');
    } catch (err) {
      setError('Registration failed');
    }
  }

  return (
    <div className="auth-card">
      <h1>Create account</h1>
      <form onSubmit={onSubmit}>
        <label>Name<input value={name} onChange={e => setName(e.target.value)} type="text" /></label>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">Sign up</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}