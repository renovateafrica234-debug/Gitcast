'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --paper: #F4F1EA;
          --ink: #1C1917;
          --ink-light: #44403C;
          --ink-faint: #A8A29E;
          --accent: #B45309;
          --accent-light: #D97706;
          --border: #D6D3D1;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--paper); color: var(--ink); font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

        .home-root { min-height: 100vh; display: flex; flex-direction: column; }

        /* Nav */
        .nav {
          height: 64px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'Instrument Serif', Georgia, serif; font-size: 1.4rem;
          letter-spacing: -0.02em; display: flex; align-items: center; gap: 10px;
        }
        .nav-logo svg { width: 24px; height: 24px; color: var(--accent); }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-links a {
          color: var(--ink-light); text-decoration: none; font-size: 0.85rem;
          font-weight: 500; transition: color 0.15s;
        }
        .nav-links a:hover { color: var(--accent); }

        /* Hero */
        .hero {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; padding: 80px 24px;
          max-width: 720px; margin: 0 auto;
        }
        .hero-eyebrow {
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--accent); font-weight: 600; margin-bottom: 24px;
        }
        .hero h1 {
          font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 20px;
        }
        .hero p {
          font-size: 1.05rem; line-height: 1.7; color: var(--ink-light); margin-bottom: 40px;
          max-width: 560px;
        }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 12px;
          background: var(--ink); color: var(--paper); padding: 16px 36px;
          border-radius: 10px; font-size: 0.9rem; font-weight: 600;
          text-decoration: none; transition: all 0.15s;
        }
        .hero-cta:hover { background: var(--ink-light); transform: translateY(-1px); }

        /* Stats */
        .stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
          padding: 60px 40px; border-top: 1px solid var(--border);
          max-width: 900px; margin: 0 auto; width: 100%;
        }
        .stat { text-align: center; }
        .stat-number {
          font-family: 'Instrument Serif', Georgia, serif; font-size: 2.5rem;
          font-weight: 400; color: var(--accent); margin-bottom: 6px;
        }
        .stat-label { font-size: 0.8rem; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.08em; }

        /* Footer */
        .footer {
          padding: 24px 40px; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.75rem; color: var(--ink-faint);
        }

        @media (max-width: 600px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .stats { grid-template-columns: 1fr; gap: 24px; padding: 40px 20px; }
          .hero { padding: 60px 20px; }
          .footer { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-logo">
          <svg viewBox="0 0 64 64" fill="currentColor"><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="8"/></svg>
          GitCast
        </div>
        <div className="nav-links">
          <Link href="/studio">Studio</Link>
          <a href="https://github.com/renovateafrica234-debug/Gitcast" target="_blank" rel="noreferrer">GitHub</a>
          <a href="/docs">API</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">African Character Engine for Film & Television</div>
        <h1>Characters with ancestral weight.</h1>
        <p>
          GitCast generates culturally grounded character profiles for Nollywood, 
          streaming platforms, and indie studios. 28 ethnic origins. 20 dramatic roles. 
          Export-ready bibles.
        </p>
        <Link href="/studio" className="hero-cta">
          Open Studio →
        </Link>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat-number">28</div>
          <div className="stat-label">Cultures</div>
        </div>
        <div className="stat">
          <div className="stat-number">20</div>
          <div className="stat-label">Dramatic Roles</div>
        </div>
        <div className="stat">
          <div className="stat-number">8</div>
          <div className="stat-label">Narrative Tones</div>
        </div>
      </section>

      <footer className="footer">
        <span>Powered by NVIDIA NIM</span>
        <span>© 2026 GitCast · Renovate Africa</span>
      </footer>
    </div>
  );
}
