import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import ProgressBar from '../components/ProgressBar.jsx';

export default function DomainDetail() {
  const { id } = useParams();
  const [domain, setDomain] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  async function refresh() {
    const d = await api.getDomain(id);
    setDomain(d);
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [id]);

  async function uploadFiles() {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    const res = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:5000')}/api/domains/${id}/upload`, {
      method: 'POST',
      body: form,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    });
    if (!res.ok) throw new Error('Upload failed');
    setFiles([]);
    setMessage('Uploaded successfully');
  }

  async function startBuild() {
    await api.startBuild(id);
    setMessage('Build started');
    refresh();
  }

  if (!domain) return null;

  return (
    <div className="container">
      <Link to="/" className="muted">← Back</Link>
      <h1>{domain.name}</h1>
      <div className="card">
        <h3>Upload documents</h3>
        <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} />
        <button className="btn" onClick={uploadFiles} disabled={!files.length}>Upload</button>
        {message && <div className="muted" style={{ marginTop: 8 }}>{message}</div>}
      </div>

      <div className="card">
        <h3>Build domain</h3>
        <p className="muted">Generate embeddings with Nomic Embed Text via Ollama.</p>
        <button className="btn" onClick={startBuild} disabled={domain.status === 'building'}>Start build</button>
        <div style={{ marginTop: 12 }}>
          <ProgressBar value={domain.progress} />
          <div className="muted">{domain.status} • {domain.processedChunks}/{domain.totalChunks} chunks</div>
        </div>
      </div>

      <div className="card">
        <h3>Chat</h3>
        <Link to={`/chat/${domain._id}`} className="btn">Open chat</Link>
      </div>
    </div>
  );
}