import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Dashboard() {
  const [domains, setDomains] = useState([]);
  const [name, setName] = useState('');

  async function refresh() {
    const list = await api.getDomains();
    setDomains(list);
  }

  useEffect(() => { refresh(); }, []);

  async function createDomain() {
    if (!name.trim()) return;
    await api.createDomain({ name });
    setName('');
    refresh();
  }

  async function deleteDomain(id) {
    if (!window.confirm('Delete this domain and all its data? This cannot be undone.')) return;
    try {
      await api.deleteDomain(id);
      refresh();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  return (
    <div className="container">
      <div className="header-row">
        <h1>Your domains</h1>
        <div className="new-domain">
          <input placeholder="New domain name" value={name} onChange={e => setName(e.target.value)} />
          <button className="btn" onClick={createDomain}>Create</button>
        </div>
      </div>
      <div className="grid">
        {domains.map(d => (
          <div key={d._id} className="card" style={{ position: 'relative' }}>
            <Link to={`/domains/${d._id}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              <div className="card-title">{d.name}</div>
              <div className={`status ${d.status}`}>{d.status}</div>
              <div className="muted">Progress: {d.progress}%</div>
            </Link>
            <button onClick={() => deleteDomain(d._id)} aria-label={`Delete ${d.name}`} title="Delete" className="btn btn-trash">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
        {domains.length === 0 && <div className="muted">No domains yet. Create one to begin.</div>}
      </div>
    </div>
  );
}