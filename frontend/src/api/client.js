const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let token = localStorage.getItem('token') || '';
export function setToken(t) {
  token = t;
  if (t) localStorage.setItem('token', t); else localStorage.removeItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getDomains: () => request('/api/domains'),
  createDomain: (data) => request('/api/domains', { method: 'POST', body: JSON.stringify(data) }),
  getDomain: (id) => request(`/api/domains/${id}`),
  startBuild: (id) => request(`/api/domains/${id}/build`, { method: 'POST' }),
  chat: (data) => request('/api/chat', { method: 'POST', body: JSON.stringify(data) }),
  deleteDomain: (id) => request(`/api/domains/${id}`, { method: 'DELETE' })
};