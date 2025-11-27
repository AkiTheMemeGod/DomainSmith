import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

/*
  TypeRotator
  - Simple, lightweight rotator that cycles an array of phrases with a fade transition.
  - No external deps. Controlled timings via props.
*/
function TypeRotator({ items = [], interval = 2200 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!items || items.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items, interval]);
  return <span className="rotator-item" aria-hidden>{items[idx]}</span>;
}

/* Reusable feature card */
function Feature({ title, desc, icon }) {
  return (
    <div className="lp-feature">
      <div className="lp-feature-icon" aria-hidden dangerouslySetInnerHTML={{ __html: icon }} />
      <div className="lp-feature-body">
        <div className="lp-feature-title">{title}</div>
        <div className="muted">{desc}</div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <main>
      {/* HERO: bold headline, short tagline, CTA */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <h1 className="lp-title">Build domain-aware AI assistants — faster.</h1>
            <p className="lp-sub">Turn documents, manuals and datasets into searchable, chat-ready domains powered by local Ollama embeddings and Mistral models.</p>

            <div className="lp-cta-row">
              <Link to="/register" className="btn btn-primary">Get started — it's free</Link>
              <Link to="/login" className="btn btn-ghost" style={{ marginLeft: 12 }}>Sign in</Link>
            </div>

            <div className="lp-rotator" aria-hidden>
              <span className="muted">Make a </span>
              <span className="lp-rotator-words"><TypeRotator items={["New Domain", "New Context", "New AI"]} /></span>
            </div>
          </div>

          <aside className="lp-hero-panel" aria-hidden>
            <div className="lp-panel-card">
              <div className="lp-panel-header">Example domain</div>
              <div className="muted">Internal product manuals — 1,204 chunks • status: ready</div>
              <div className="lp-panel-query">Try: "How do I onboard a new team member?"</div>
            </div>
          </aside>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features container">
        <h2>Features</h2>
        <p className="muted">Lightweight, private, and built for engineers and knowledge teams — all the tools to create domain-specific assistants.</p>

        <div className="lp-features-grid">
          <Feature
            title="Universal uploads"
            desc="PDF, Word, plain text — parsed, chunked, and stored for retrieval."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='M7 10l5-5 5 5' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
          />

          <Feature
            title="Embeddings & search"
            desc="Local Ollama embeddings with per-domain collections for fast, relevant retrieval."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
          />

          <Feature
            title="Chat & RAG"
            desc="Ask natural questions — responses reference relevant source documents for explainability."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
          />

          <Feature
            title="Private & local"
            desc="Runs with your own Ollama and MongoDB — you keep control over data and models."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z' stroke='currentColor' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/><path d='M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' stroke='currentColor' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
          />
        </div>
      </section>



      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="container lp-footer-inner">
          <div className="lp-footer-left">
            <div className="brand">DomainSmith</div>
            <div className="muted">© {new Date().getFullYear()} DomainSmith — Built for private, fast domain assistants.</div>
          </div>

          <div className="lp-footer-links">
            <a href="#" className="muted">Docs</a>
            <a href="#" className="muted" style={{ marginLeft: 12 }}>GitHub</a>
            <a href="#" className="muted" style={{ marginLeft: 12 }}>Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}