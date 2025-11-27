import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import DomainDetail from './pages/DomainDetail.jsx';
import Chat from './pages/Chat.jsx';
import './index.css';

function useAuth() {
  const tok = localStorage.getItem('token');
  return Boolean(tok);
}

function Protected({ children }) {
  const authed = useAuth();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

function PublicRoute({ children }) {
  const authed = useAuth();
  const loc = useLocation();
  if (authed) return <Navigate to="/domains" state={{ from: loc }} replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore persisted user from localStorage so UI stays consistent across refresh/navigation
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      // ignore malformed
    }
  }, []);

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/domains" element={<Protected><Dashboard /></Protected>} />
          <Route path="/domains/:id" element={<Protected><DomainDetail /></Protected>} />
          <Route path="/chat/:id" element={<Protected><Chat /></Protected>} />
          <Route path="/login" element={<PublicRoute><Login setUser={setUser} /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register setUser={setUser} /></PublicRoute>} />
        </Routes>
      </main>
    </div>
  );
}
