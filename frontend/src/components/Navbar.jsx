import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../api/client.js';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  function logout() {
    setToken('');
    setUser(null);
    try { localStorage.removeItem('user'); } catch (e) {}
    navigate('/login');
  }
  // fallback to persisted user when parent state hasn't been initialized yet
  let displayUser = user;
  if (!displayUser) {
    try {
      const s = localStorage.getItem('user');
      if (s) displayUser = JSON.parse(s);
    } catch (e) { displayUser = null; }
  }

  return (
    <nav className="nav">
      <Link to="/" className="brand">DomainSmith</Link>
      <div className="spacer" />
      {displayUser ? (
        <>
          <span className="user">{displayUser.email}</span>
          <button onClick={logout} className="btn">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn-link">Login</Link>
          <Link to="/register" className="btn">Sign up</Link>
        </>
      )}
    </nav>
  );
}