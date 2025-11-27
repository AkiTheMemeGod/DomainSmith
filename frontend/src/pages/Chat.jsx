import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Chat() {
  const { id } = useParams();
  const [domain, setDomain] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    api.getDomain(id).then(setDomain);
  }, [id]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    const res = await api.chat({ domainId: id, message: userMsg.content });
    const botMsg = { role: 'assistant', content: res.answer };
    setMessages(m => [...m, botMsg]);
  }

  return (
    <div className="chat-container">
      <Link to={`/domains/${id}`} className="muted">← Back</Link>
      <h1>{domain?.name || 'Chat'}</h1>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
      </div>
      <div className="chat-input">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question..." onKeyDown={e => e.key==='Enter' && send()} />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}