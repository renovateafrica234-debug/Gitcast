'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CharacterProfile {
  name: string;
  age: number;
  backstory: string;
  personality: string[];
  speech_patterns: string;
  relationships: string;
  dialogue_samples: string[];
  visual_description: string;
  cultural_notes: string;
}

const CULTURES = [
  { id: 'Yoruba',    label: 'Yoruba',    symbol: '⚡', region: 'Southwest', color: '#8B1A1A', desc: 'Land of 401 deities' },
  { id: 'Igbo',      label: 'Igbo',      symbol: '🌿', region: 'Southeast', color: '#1A5C2A', desc: 'Children of Chukwu' },
  { id: 'Hausa',     label: 'Hausa',     symbol: '☽',  region: 'North',     color: '#1A3A6B', desc: 'Saharan traders' },
  { id: 'Edo',       label: 'Edo',       symbol: '🐆', region: 'South',     color: '#6B3A1A', desc: 'Kingdom of Benin' },
  { id: 'Ijaw',      label: 'Ijaw',      symbol: '🌊', region: 'Delta',     color: '#0A3D4A', desc: 'Children of the water' },
  { id: 'Tiv',       label: 'Tiv',       symbol: '🏔', region: 'Middle Belt',color: '#3A2A0A', desc: 'People of the hills' },
  { id: 'Efik',      label: 'Efik',      symbol: '🦅', region: 'Cross River',color: '#2A0A3A', desc: 'Ekpe society masters' },
  { id: 'Fulani',    label: 'Fulani',    symbol: '🌾', region: 'North',     color: '#4A3A0A', desc: 'The pastoral wanderers' },
];

const ROLES = [
  { id: 'Hero',         label: 'The Hero',        icon: '⚔️',  desc: 'Carries the story forward' },
  { id: 'Villain',      label: 'The Villain',      icon: '🐍', desc: 'Embodies opposition' },
  { id: 'Mentor',       label: 'The Mentor',       icon: '🦁', desc: 'Ancient wisdom bearer' },
  { id: 'Trickster',    label: 'The Trickster',    icon: '🦊', desc: 'Chaos agent, truth teller' },
  { id: 'Love Interest', label: 'The Heart',       icon: '🌺', desc: 'The emotional core' },
  { id: 'Anti-Hero',    label: 'The Anti-Hero',    icon: '⚖️',  desc: 'Neither good nor evil' },
  { id: 'Elder',        label: 'The Elder',         icon: '🌳', desc: 'Living ancestral memory' },
  { id: 'Rebel',        label: 'The Rebel',         icon: '🔥', desc: 'Breaks every tradition' },
];

const AGES = [
  { id: 'Teen (13-19)',         label: 'Youth',        sub: '13–19', icon: '🌱' },
  { id: 'Young Adult (20-30)',  label: 'Rising',       sub: '20–30', icon: '⚡' },
  { id: 'Adult (30-45)',        label: 'Established',  sub: '30–45', icon: '🔥' },
  { id: 'Senior (45+)',         label: 'Elder',        sub: '45+',   icon: '🌙' },
];

export default function GitCastOracle() {
  const [culture, setCulture]     = useState('');
  const [role, setRole]           = useState('');
  const [age, setAge]             = useState('');
  const [profession, setProfession] = useState('');
  const [loading, setLoading]     = useState(false);
  const [character, setCharacter] = useState<CharacterProfile | null>(null);
  const [error, setError]         = useState('');
  const [revealed, setRevealed]   = useState(false);
  const [particles, setParticles] = useState<{x:number,y:number,size:number,speed:number,opacity:number}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedCulture = CULTURES.find(c => c.id === culture);

  // Particle / Adire pattern canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    let frame = 0;

    const drawAdire = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep background gradient
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W);
      bg.addColorStop(0, '#0F0A1E');
      bg.addColorStop(1, '#04040A');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Adire grid pattern
      const spacing = 60;
      ctx.save();
      for (let x = 0; x < W + spacing; x += spacing) {
        for (let y = 0; y < H + spacing; y += spacing) {
          const pulse = Math.sin(frame * 0.008 + x * 0.02 + y * 0.02) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(212, 160, 23, ${0.04 + pulse * 0.04})`;
          ctx.lineWidth = 1;

          // Diamond/cross pattern
          ctx.beginPath();
          ctx.moveTo(x, y - 20);
          ctx.lineTo(x + 20, y);
          ctx.lineTo(x, y + 20);
          ctx.lineTo(x - 20, y);
          ctx.closePath();
          ctx.stroke();

          // Inner dot
          ctx.beginPath();
          ctx.arc(x, y, 2 + pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 160, 23, ${0.06 + pulse * 0.06})`;
          ctx.fill();
        }
      }
      ctx.restore();

      // Floating particles
      const time = frame * 0.015;
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(time * 0.3 + i * 1.7) * 0.5 + 0.5) * W;
        const py = ((time * 0.05 + i * 0.077) % 1) * H;
        const alpha = Math.sin(time + i) * 0.3 + 0.3;
        const r = Math.sin(i * 3.7) * 1.5 + 2;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 85, 10, ${alpha * 0.6})`;
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(drawAdire);
    };

    const raf = requestAnimationFrame(drawAdire);
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const generate = async () => {
    if (!culture || !role || !age) return;
    setLoading(true);
    setError('');
    setCharacter(null);
    setRevealed(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ culture, role, ageRange: age, customization: profession ? { profession } : undefined }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCharacter(data.character);
      setTimeout(() => {
        setRevealed(true);
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('The Oracle could not commune. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = culture && role && age;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold:   #D4A017;
          --orange: #E8550A;
          --cream:  #F5E6C8;
          --dim:    #8A7A5A;
          --ink:    #0F0A1E;
          --card:   rgba(255,255,255,0.04);
          --border: rgba(212,160,23,0.2);
        }
        html { scroll-behavior: smooth; }
        body { background: var(--ink); color: var(--cream); font-family: 'Crimson Pro', Georgia, serif; overflow-x: hidden; }

        /* ── Nav ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 20px 40px; display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(to bottom, rgba(15,10,30,0.95), transparent);
        }
        .nav-logo {
          font-family: 'Cinzel', serif; font-weight: 900; font-size: 1.4rem;
          letter-spacing: .12em; color: var(--gold);
          text-decoration: none; display: flex; align-items: center; gap: 10px;
        }
        .nav-logo .film-mark {
          width: 32px; height: 32px; border: 2px solid var(--orange);
          display: flex; align-items: center; justify-content: center;
          font-size: .85rem;
        }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-links a { color: var(--dim); text-decoration: none; font-family: 'Space Mono', monospace; font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; transition: color .2s; }
        .nav-links a:hover { color: var(--gold); }
        .nav-cta {
          font-family: 'Cinzel', serif; font-size: .75rem; font-weight: 700; letter-spacing: .1em;
          padding: 9px 22px; border: 1px solid var(--gold); color: var(--gold);
          background: transparent; cursor: pointer; transition: all .2s; text-decoration: none;
          text-transform: uppercase;
        }
        .nav-cta:hover { background: var(--gold); color: var(--ink); }

        /* ── Hero ── */
        .hero {
          min-height: 100svh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 140px 24px 80px;
          position: relative; z-index: 2;
        }
        .hero-eyebrow {
          font-family: 'Space Mono', monospace; font-size: .68rem;
          letter-spacing: .25em; text-transform: uppercase; color: var(--orange);
          margin-bottom: 28px; display: flex; align-items: center; gap: 12px;
        }
        .hero-eyebrow::before, .hero-eyebrow::after {
          content: ''; flex: 1; max-width: 60px; height: 1px; background: var(--orange); opacity: .5;
        }
        .hero-title {
          font-family: 'Cinzel', serif; font-weight: 900;
          font-size: clamp(3.5rem, 10vw, 9rem);
          line-height: .95; letter-spacing: -.01em;
          margin-bottom: 12px;
        }
        .hero-title .oracle { color: var(--gold); display: block; }
        .hero-title .gitcast {
          display: block;
          -webkit-text-stroke: 1px rgba(212,160,23,0.4);
          color: transparent;
          font-size: clamp(1.2rem, 3vw, 2.5rem);
          letter-spacing: .3em;
          margin-bottom: 8px;
        }
        .hero-sub {
          font-family: 'Crimson Pro', serif; font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--dim); max-width: 560px; margin: 20px auto 0;
          font-style: italic; line-height: 1.7;
        }
        .hero-divider {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          margin: 40px auto 0;
        }

        /* ── Studio ── */
        .studio { position: relative; z-index: 2; padding: 80px 24px 100px; }
        .studio-wrap { max-width: 1100px; margin: 0 auto; }
        .studio-header { text-align: center; margin-bottom: 64px; }
        .studio-step {
          font-family: 'Space Mono', monospace; font-size: .65rem;
          letter-spacing: .2em; text-transform: uppercase; color: var(--orange);
          margin-bottom: 10px;
        }
        .studio-title {
          font-family: 'Cinzel', serif; font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 700; color: var(--cream);
        }
        .studio-title span { color: var(--gold); }

        /* ── Culture Grid ── */
        .culture-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-bottom: 52px; }
        .culture-card {
          padding: 22px; border: 1px solid var(--border); background: var(--card);
          cursor: pointer; transition: all .25s; position: relative; overflow: hidden;
        }
        .culture-card::before {
          content: ''; position: absolute; inset: 0; opacity: 0;
          transition: opacity .3s;
        }
        .culture-card:hover::before, .culture-card.active::before { opacity: 1; }
        .culture-card.active { border-color: var(--gold); }
        .culture-card:hover { border-color: rgba(212,160,23,0.5); }
        .culture-symbol { font-size: 2rem; margin-bottom: 10px; display: block; }
        .culture-name { font-family: 'Cinzel', serif; font-size: 1.05rem; font-weight: 700; color: var(--cream); margin-bottom: 3px; }
        .culture-region { font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); margin-bottom: 6px; }
        .culture-desc { font-size: .85rem; color: var(--dim); font-style: italic; }
        .culture-card.active .culture-name { color: var(--gold); }
        .culture-swatch { position: absolute; top: 0; right: 0; width: 4px; height: 100%; opacity: 0; transition: opacity .3s; }
        .culture-card.active .culture-swatch { opacity: 1; }

        /* ── Role Grid ── */
        .section-label {
          font-family: 'Space Mono', monospace; font-size: .65rem; letter-spacing: .2em;
          text-transform: uppercase; color: var(--orange); margin-bottom: 14px; display: block;
        }
        .role-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-bottom: 52px; }
        .role-card {
          padding: 18px 20px; border: 1px solid var(--border); background: var(--card);
          cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 14px;
        }
        .role-card:hover { border-color: rgba(212,160,23,0.5); }
        .role-card.active { border-color: var(--gold); background: rgba(212,160,23,0.06); }
        .role-icon { font-size: 1.5rem; flex-shrink: 0; }
        .role-name { font-family: 'Cinzel', serif; font-size: .88rem; font-weight: 700; color: var(--cream); }
        .role-card.active .role-name { color: var(--gold); }
        .role-desc { font-size: .75rem; color: var(--dim); margin-top: 2px; font-style: italic; }

        /* ── Age ── */
        .age-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 40px; }
        .age-card {
          flex: 1; min-width: 120px; padding: 16px 20px; border: 1px solid var(--border);
          background: var(--card); cursor: pointer; transition: all .2s; text-align: center;
        }
        .age-card:hover { border-color: rgba(212,160,23,0.5); }
        .age-card.active { border-color: var(--gold); background: rgba(212,160,23,0.06); }
        .age-icon { font-size: 1.4rem; margin-bottom: 6px; }
        .age-label { font-family: 'Cinzel', serif; font-size: .85rem; font-weight: 700; color: var(--cream); }
        .age-card.active .age-label { color: var(--gold); }
        .age-sub { font-family: 'Space Mono', monospace; font-size: .62rem; color: var(--dim); margin-top: 3px; }

        /* ── Profession input ── */
        .prof-row { margin-bottom: 44px; }
        .prof-input {
          width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border);
          color: var(--cream); font-family: 'Crimson Pro', serif; font-size: 1.2rem;
          padding: 12px 0; outline: none; transition: border-color .2s;
        }
        .prof-input:focus { border-color: var(--gold); }
        .prof-input::placeholder { color: rgba(138,122,90,0.5); font-style: italic; }

        /* ── Invoke button ── */
        .invoke-btn {
          width: 100%; padding: 22px; background: transparent;
          border: 1px solid var(--gold); color: var(--gold);
          font-family: 'Cinzel', serif; font-weight: 700; font-size: 1rem;
          letter-spacing: .2em; text-transform: uppercase; cursor: pointer;
          transition: all .3s; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 14px;
        }
        .invoke-btn::before {
          content: ''; position: absolute; inset: 0;
          background: var(--gold); transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease;
        }
        .invoke-btn:hover::before { transform: scaleX(1); }
        .invoke-btn span { position: relative; z-index: 1; }
        .invoke-btn:hover span { color: var(--ink); }
        .invoke-btn:disabled { opacity: .35; cursor: not-allowed; }
        .invoke-btn:disabled::before { display: none; }

        .invoke-loading {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Space Mono', monospace; font-size: .8rem; letter-spacing: .15em;
        }
        .invoke-loading .dot {
          width: 6px; height: 6px; background: var(--gold); border-radius: 50%;
          animation: ping 1.2s ease infinite;
        }
        .invoke-loading .dot:nth-child(2) { animation-delay: .2s; }
        .invoke-loading .dot:nth-child(3) { animation-delay: .4s; }
        @keyframes ping { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }

        /* ── Character Reveal ── */
        .character-reveal {
          margin-top: 80px; opacity: 0; transform: translateY(40px);
          transition: opacity .8s ease, transform .8s ease;
        }
        .character-reveal.visible { opacity: 1; transform: translateY(0); }

        .slate-header {
          background: var(--gold); color: var(--ink);
          padding: 14px 28px; display: flex; align-items: center; justify-content: space-between;
        }
        .slate-title { font-family: 'Space Mono', monospace; font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; }
        .slate-name { font-family: 'Cinzel', serif; font-weight: 900; font-size: 2rem; }
        .slate-meta { font-family: 'Space Mono', monospace; font-size: .65rem; text-align: right; opacity: .7; }

        .character-body {
          border: 1px solid var(--border); border-top: none;
          display: grid; grid-template-columns: 1fr 1fr;
          background: rgba(15,10,30,0.8);
        }

        .char-left { padding: 36px; border-right: 1px solid var(--border); }
        .char-right { padding: 36px; }

        .char-section { margin-bottom: 32px; }
        .char-section:last-child { margin-bottom: 0; }
        .char-section-label {
          font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .15em;
          text-transform: uppercase; color: var(--orange); margin-bottom: 10px;
          padding-bottom: 6px; border-bottom: 1px solid rgba(232,85,10,0.2);
        }
        .char-text { font-size: 1rem; color: var(--cream); line-height: 1.7; font-weight: 300; }
        .char-traits { display: flex; flex-wrap: wrap; gap: 8px; }
        .char-trait {
          padding: 4px 12px; border: 1px solid rgba(212,160,23,0.3);
          font-family: 'Space Mono', monospace; font-size: .65rem;
          letter-spacing: .05em; color: var(--gold); text-transform: uppercase;
        }
        .dialogue-line {
          padding: 14px 18px; border-left: 2px solid var(--orange);
          margin-bottom: 10px; background: rgba(232,85,10,0.05);
          font-style: italic; color: var(--cream); font-size: .95rem; line-height: 1.5;
        }
        .dialogue-line:last-child { margin-bottom: 0; }

        /* ── Error ── */
        .error-box {
          margin-top: 24px; padding: 16px 20px; border: 1px solid rgba(200,50,50,.3);
          background: rgba(200,50,50,.05); color: #E88; font-family: 'Space Mono', monospace; font-size: .8rem;
        }

        /* ── Divider ornament ── */
        .ornament {
          display: flex; align-items: center; gap: 16px;
          margin: 56px 0 40px; color: var(--dim);
        }
        .ornament::before, .ornament::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .ornament-text { font-family: 'Cinzel', serif; font-size: .8rem; letter-spacing: .15em; text-transform: uppercase; white-space: nowrap; }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .nav { padding: 16px 20px; }
          .nav-links { display: none; }
          .character-body { grid-template-columns: 1fr; }
          .char-left { border-right: none; border-bottom: 1px solid var(--border); }
          .slate-name { font-size: 1.4rem; }
          .hero-title { font-size: clamp(2.8rem, 14vw, 5rem); }
        }
      `}</style>

      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <span className="film-mark">▶</span>
          GITCAST
        </a>
        <div className="nav-links">
          <a href="#studio">Studio</a>
          <a href="#pricing">Pricing</a>
          <a href="#api">API</a>
        </div>
        <a href="#studio" className="nav-cta">Open Studio</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">The Nigerian Character Engine</div>
        <h1 className="hero-title">
          <span className="gitcast">G I T C A S T</span>
          <span className="oracle">ORACLE</span>
        </h1>
        <p className="hero-sub">
          Speak the culture. Name the role. The Oracle conjures a soul — complete with backstory, voice, and the ancestral weight of generations.
        </p>
        <div className="hero-divider" />
      </section>

      {/* STUDIO */}
      <section className="studio" id="studio">
        <div className="studio-wrap">

          {/* Step 1 — Culture */}
          <div className="studio-header">
            <p className="studio-step">Step 01 — Choose the Culture</p>
            <h2 className="studio-title">Which <span>people</span> does your character come from?</h2>
          </div>

          <div className="culture-grid">
            {CULTURES.map(c => (
              <div
                key={c.id}
                className={`culture-card ${culture === c.id ? 'active' : ''}`}
                onClick={() => setCulture(c.id)}
              >
                <div className="culture-swatch" style={{ background: c.color }} />
                <span className="culture-symbol">{c.symbol}</span>
                <div className="culture-name">{c.label}</div>
                <div className="culture-region">{c.region}</div>
                <div className="culture-desc">{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Step 2 — Role */}
          <div className="ornament"><span className="ornament-text">Step 02 — The Narrative Role</span></div>

          <div className="role-grid">
            {ROLES.map(r => (
              <div
                key={r.id}
                className={`role-card ${role === r.id ? 'active' : ''}`}
                onClick={() => setRole(r.id)}
              >
                <span className="role-icon">{r.icon}</span>
                <div>
                  <div className="role-name">{r.label}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Step 3 — Age */}
          <div className="ornament"><span className="ornament-text">Step 03 — Age & Season of Life</span></div>
          <div className="age-row">
            {AGES.map(a => (
              <div
                key={a.id}
                className={`age-card ${age === a.id ? 'active' : ''}`}
                onClick={() => setAge(a.id)}
              >
                <div className="age-icon">{a.icon}</div>
                <div className="age-label">{a.label}</div>
                <div className="age-sub">{a.sub}</div>
              </div>
            ))}
          </div>

          {/* Step 4 — Profession */}
          <div className="ornament"><span className="ornament-text">Step 04 — Profession or Context (optional)</span></div>
          <div className="prof-row">
            <input
              className="prof-input"
              type="text"
              value={profession}
              onChange={e => setProfession(e.target.value)}
              placeholder="e.g. market trader, Lagos tech bro, village healer, UNILAG student, oil activist..."
            />
          </div>

          {/* INVOKE */}
          <button className="invoke-btn" onClick={generate} disabled={!canGenerate || loading}>
            {loading ? (
              <div className="invoke-loading">
                <div className="dot" /><div className="dot" /><div className="dot" />
                <span>THE ORACLE IS COMMUNING</span>
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            ) : (
              <>
                <span>◆</span>
                <span>INVOKE THE ORACLE</span>
                <span>◆</span>
              </>
            )}
          </button>

          {error && <div className="error-box">⚠ {error}</div>}

          {/* CHARACTER REVEAL */}
          {character && (
            <div ref={resultRef} className={`character-reveal ${revealed ? 'visible' : ''}`}>
              <div className="ornament"><span className="ornament-text">The Oracle Speaks</span></div>

              {/* Film Slate Header */}
              <div className="slate-header">
                <div>
                  <div className="slate-title">Character Profile · {selectedCulture?.region}</div>
                  <div className="slate-name">{character.name}</div>
                </div>
                <div className="slate-meta">
                  <div>{role} · {character.age} yrs</div>
                  <div>{culture} Origin</div>
                  <div style={{marginTop:4}}>GITCAST ORACLE</div>
                </div>
              </div>

              {/* Body */}
              <div className="character-body">
                <div className="char-left">
                  <div className="char-section">
                    <div className="char-section-label">Backstory</div>
                    <div className="char-text">{character.backstory}</div>
                  </div>
                  <div className="char-section">
                    <div className="char-section-label">Personality</div>
                    <div className="char-traits">
                      {character.personality?.map((t, i) => <span key={i} className="char-trait">{t}</span>)}
                    </div>
                  </div>
                  <div className="char-section">
                    <div className="char-section-label">Visual Description</div>
                    <div className="char-text">{character.visual_description}</div>
                  </div>
                  <div className="char-section">
                    <div className="char-section-label">Relationships</div>
                    <div className="char-text">{character.relationships}</div>
                  </div>
                </div>

                <div className="char-right">
                  <div className="char-section">
                    <div className="char-section-label">Dialogue Samples</div>
                    {character.dialogue_samples?.map((line, i) => (
                      <div key={i} className="dialogue-line">"{line}"</div>
                    ))}
                  </div>
                  <div className="char-section">
                    <div className="char-section-label">Speech Patterns</div>
                    <div className="char-text">{character.speech_patterns}</div>
                  </div>
                  <div className="char-section">
                    <div className="char-section-label">Cultural Notes</div>
                    <div className="char-text">{character.cultural_notes}</div>
                  </div>
                </div>
              </div>

              {/* Regenerate */}
              <div style={{textAlign:'right', marginTop:16}}>
                <button onClick={generate} style={{
                  background:'transparent', border:'1px solid rgba(212,160,23,0.3)',
                  color:'var(--dim)', fontFamily:"'Space Mono',monospace",
                  fontSize:'.65rem', letterSpacing:'.1em', padding:'8px 18px',
                  cursor:'pointer', transition:'all .2s', textTransform:'uppercase'
                }}
                  onMouseOver={e => { (e.target as HTMLButtonElement).style.borderColor='var(--gold)'; (e.target as HTMLButtonElement).style.color='var(--gold)'; }}
                  onMouseOut={e => { (e.target as HTMLButtonElement).style.borderColor='rgba(212,160,23,0.3)'; (e.target as HTMLButtonElement).style.color='var(--dim)'; }}
                >
                  ↺ Conjure Another
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop:'1px solid var(--border)', padding:'48px 40px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:16, position:'relative', zIndex:2
      }}>
        <div style={{fontFamily:"'Cinzel',serif", color:'var(--gold)', fontSize:'.9rem', letterSpacing:'.1em'}}>
          GITCAST ORACLE
        </div>
        <div style={{fontFamily:"'Space Mono',monospace", fontSize:'.65rem', color:'var(--dim)', letterSpacing:'.05em'}}>
          BUILT BY RENOVATE AFRICA · {new Date().getFullYear()}
        </div>
        <a href="https://sparkam.ng" style={{fontFamily:"'Space Mono',monospace", fontSize:'.65rem', color:'var(--dim)', letterSpacing:'.05em', textDecoration:'none'}}>
          ALSO: SPARKAM.NG →
        </a>
      </footer>
    </>
  );
}
