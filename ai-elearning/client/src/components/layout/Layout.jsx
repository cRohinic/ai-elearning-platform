import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import {
  BookOpen, LayoutDashboard, MessageSquare, User,
  LogOut, Menu, X, GraduationCap, Sparkles, Zap, Star
} from 'lucide-react';
import { useState, useEffect } from 'react';

/* ─── Inject keyframes once ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #02040f;
    --surface: rgba(8,14,36,0.85);
    --border: rgba(56,114,255,0.13);
    --accent: #3b6fff;
    --accent2: #60a5fa;
    --accent3: #a78bfa;
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.38);
    --danger: rgba(251,113,133,0.85);
  }

  @keyframes shimmer {
    0%   { background-position: -400% center; }
    100% { background-position: 400% center; }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 20px rgba(59,111,255,0.35); }
    50%      { box-shadow: 0 0 40px rgba(59,111,255,0.65); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(220px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes grid-pan {
    from { background-position: 0 0; }
    to   { background-position: 60px 60px; }
  }
  @keyframes badge-glow {
    0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.4); }
    50%      { box-shadow: 0 0 0 6px rgba(167,139,250,0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .nav-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 15px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; text-decoration: none;
    color: var(--muted); background: transparent;
    border: 1px solid transparent;
    transition: all 0.22s ease;
    font-family: 'Cabinet Grotesk', sans-serif;
    letter-spacing: 0.01em;
    position: relative; overflow: hidden;
  }
  .nav-link::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(59,111,255,0.12), rgba(96,165,250,0.06));
    opacity: 0; transition: opacity 0.22s;
    border-radius: 10px;
  }
  .nav-link:hover { color: rgba(255,255,255,0.85); }
  .nav-link:hover::before { opacity: 1; }
  .nav-link.active {
    color: var(--accent2);
    background: rgba(59,111,255,0.12);
    border-color: rgba(59,111,255,0.25);
  }

  .btn-logout {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 15px; border-radius: 9px; cursor: pointer;
    font-size: 13px; font-family: 'Cabinet Grotesk', sans-serif; font-weight: 600;
    color: var(--danger);
    background: rgba(251,113,133,0.07);
    border: 1px solid rgba(251,113,133,0.18);
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .btn-logout:hover {
    background: rgba(251,113,133,0.13);
    border-color: rgba(251,113,133,0.32);
    transform: translateY(-1px);
  }

  .btn-login {
    padding: 8px 20px; border-radius: 9px; font-size: 13px; font-weight: 600;
    font-family: 'Cabinet Grotesk', sans-serif; text-decoration: none;
    color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.2s; letter-spacing: 0.01em;
  }
  .btn-login:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.09); }

  .btn-cta {
    padding: 8px 20px; border-radius: 9px; font-size: 13px; font-weight: 700;
    font-family: 'Cabinet Grotesk', sans-serif; text-decoration: none; color: #fff;
    background: linear-gradient(135deg, #2250e8, #3b82f6 60%, #818cf8);
    border: none; position: relative; overflow: hidden;
    animation: pulse-glow 3s ease-in-out infinite;
    letter-spacing: 0.02em; transition: transform 0.2s;
  }
  .btn-cta::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: skewX(-20deg);
    animation: shimmer 3s ease-in-out infinite;
    background-size: 200% auto;
  }
  .btn-cta:hover { transform: translateY(-1px); }

  .user-chip {
    display: flex; align-items: center; gap: 9px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 100px; padding: 5px 14px 5px 5px;
    transition: border-color 0.2s;
  }
  .user-chip:hover { border-color: rgba(96,165,250,0.3); }

  .ticker-wrap {
    overflow: hidden; white-space: nowrap;
    background: rgba(59,111,255,0.06);
    border-top: 1px solid rgba(59,111,255,0.12);
    border-bottom: 1px solid rgba(59,111,255,0.12);
    padding: 10px 0;
  }
  .ticker-inner {
    display: inline-block;
    animation: ticker 28s linear infinite;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.06em;
  }
  .ticker-inner span { color: var(--accent2); margin: 0 4px; }

  /* Hero section */
  .hero-section {
    min-height: 88vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 60px 24px;
    text-align: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.28);
    border-radius: 100px; padding: 6px 16px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
    color: #a78bfa; text-transform: uppercase;
    margin-bottom: 28px;
    animation: badge-glow 2.5s ease-in-out infinite, fadeIn 0.8s ease both;
  }
  .hero-title {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(48px, 8vw, 88px);
    font-weight: 700; line-height: 1.0;
    letter-spacing: -0.03em;
    background: linear-gradient(160deg, #fff 0%, #93c5fd 45%, #818cf8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeUp 0.9s ease 0.1s both;
    margin-bottom: 24px;
  }
  .hero-sub {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: clamp(16px, 2vw, 20px); font-weight: 400;
    color: rgba(255,255,255,0.45); max-width: 560px;
    line-height: 1.65; letter-spacing: 0.01em;
    animation: fadeUp 0.9s ease 0.25s both;
    margin-bottom: 40px;
  }
  .hero-cta-group {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    animation: fadeUp 0.9s ease 0.4s both;
    margin-bottom: 64px;
  }
  .hero-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 12px;
    font-family: 'Cabinet Grotesk', sans-serif; font-weight: 700;
    font-size: 15px; text-decoration: none; color: #fff;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6, #818cf8);
    box-shadow: 0 0 32px rgba(59,130,246,0.4), 0 4px 20px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }
  .hero-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 48px rgba(59,130,246,0.55), 0 8px 32px rgba(0,0,0,0.5);
  }
  .hero-btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 12px;
    font-family: 'Cabinet Grotesk', sans-serif; font-weight: 600;
    font-size: 15px; text-decoration: none; color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    transition: all 0.2s;
  }
  .hero-btn-secondary:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.9); }

  .stat-row {
    display: flex; gap: 0; flex-wrap: wrap; justify-content: center;
    animation: fadeUp 0.9s ease 0.55s both;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    background: rgba(8,14,36,0.7);
    backdrop-filter: blur(12px);
    overflow: hidden;
  }
  .stat-item {
    padding: 20px 36px; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.07);
    min-width: 130px;
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: 'Clash Display', sans-serif;
    font-size: 28px; font-weight: 700;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  .stat-label {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.3); text-transform: uppercase; margin-top: 4px;
  }

  /* Features strip */
  .features-strip {
    padding: 80px 24px;
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  .feature-card {
    background: rgba(8,14,36,0.7);
    border: 1px solid rgba(59,111,255,0.12);
    border-radius: 18px; padding: 32px;
    position: relative; overflow: hidden;
    transition: transform 0.25s, border-color 0.25s;
    backdrop-filter: blur(8px);
  }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .feature-card:hover { transform: translateY(-4px); border-color: rgba(59,111,255,0.3); }
  .feature-card:hover::before { opacity: 1; }
  .feature-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .feature-title {
    font-family: 'Clash Display', sans-serif;
    font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.9);
    margin-bottom: 10px; letter-spacing: -0.01em;
  }
  .feature-text {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.38);
    font-weight: 400;
  }

  /* Floating orbs */
  .orb {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(80px); animation: float 6s ease-in-out infinite;
  }

  /* Scrolling ring */
  .ring-spin {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(59,111,255,0.12);
    animation: spin-slow 20s linear infinite;
    pointer-events: none;
  }

  /* Footer */
  .footer-link {
    font-size: 13px; font-family: 'Cabinet Grotesk', sans-serif;
    color: rgba(255,255,255,0.22); text-decoration: none;
    transition: color 0.2s; font-weight: 500;
  }
  .footer-link:hover { color: rgba(255,255,255,0.6); }

  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .stat-item { padding: 16px 22px; min-width: 100px; }
  }
  @media (min-width: 769px) {
    .mobile-menu-btn { display: none !important; }
  }
`;

function InjectStyles() {
  useEffect(() => {
    const tag = document.createElement('style');
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);
  return null;
}

const TICKER_ITEMS = [
  'Machine Learning', '★', 'Deep Learning', '★', 'Prompt Engineering', '★',
  'Neural Networks', '★', 'Computer Vision', '★', 'NLP', '★',
  'Data Science', '★', 'Python for AI', '★', 'Transformers', '★',
  'Reinforcement Learning', '★', 'AI Ethics', '★', 'MLOps', '★',
];

function TickerBanner() {
  const text = TICKER_ITEMS.join(' \u00a0\u00a0 ');
  return (
    <div className="ticker-wrap">
      <span className="ticker-inner">
        {Array.from({ length: 2 }).map((_, i) =>
          TICKER_ITEMS.map((t, j) =>
            t === '★'
              ? <span key={`${i}-${j}`}> ★ </span>
              : <React.Fragment key={`${i}-${j}`}>&nbsp;&nbsp;{t}&nbsp;&nbsp;</React.Fragment>
          )
        )}
      </span>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Sparkles size={22} color="#a78bfa" />,
    bg: 'linear-gradient(135deg, rgba(167,139,250,0.18), rgba(167,139,250,0.05))',
    border: 'rgba(167,139,250,0.2)',
    title: 'AI-Personalized Paths',
    text: 'Our adaptive engine maps your strengths and gaps — then designs a learning journey unique to you. No cookie-cutter syllabuses.',
  },
  {
    icon: <Zap size={22} color="#60a5fa" />,
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(59,130,246,0.05))',
    border: 'rgba(59,130,246,0.2)',
    title: 'Real-Time AI Tutoring',
    text: 'Stuck at 2 AM? Your AI tutor never sleeps. Ask anything, get instant explanations, code walkthroughs, and concept breakdowns.',
  },
  {
    icon: <Star size={22} color="#34d399" />,
    bg: 'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.05))',
    border: 'rgba(52,211,153,0.2)',
    title: 'Expert-Built Curriculum',
    text: 'Every course is crafted by industry practitioners — engineers from top AI labs, researchers, and senior educators.',
  },
  {
    icon: <GraduationCap size={22} color="#f59e0b" />,
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.05))',
    border: 'rgba(245,158,11,0.2)',
    title: 'Verifiable Certificates',
    text: 'Earn blockchain-verified certificates recognized by leading tech companies. Turn your skills into credentials that open doors.',
  },
];

import React from 'react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ After login, redirect to home '/'
  const handleLogout = () => { logout(); navigate('/'); };

  const isHome = location.pathname === '/';

  const navLinks = [
    { to: '/courses', label: 'Courses', icon: BookOpen },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/profile', label: 'Profile', icon: User },
      ...(user.role === 'instructor' ? [{ to: '/instructor', label: 'Teach', icon: GraduationCap }] : []),
    ] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
      <InjectStyles />

      {/* Top shimmer */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.7) 40%, rgba(167,139,250,0.7) 60%, transparent 100%)', animation: 'shimmer 4s ease-in-out infinite', backgroundSize: '200% auto' }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        background: 'rgba(2,4,15,0.88)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '66px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6, #818cf8)',
              borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(59,130,246,0.5)',
              border: '1px solid rgba(129,140,248,0.35)', flexShrink: 0,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}>
              <GraduationCap size={19} color="white" />
            </div>
            <span style={{
              fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: '18px',
              background: 'linear-gradient(90deg, #93c5fd 0%, #fff 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', letterSpacing: '-0.01em',
            }}>AI ELearn</span>
          </Link>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}>
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              <>
                <div className="user-chip">
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1d4ed8, #818cf8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{user.name}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-cta">Get Started →</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              padding: '8px', borderRadius: '9px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid var(--border)', padding: '12px 16px 20px',
            background: 'rgba(2,4,15,0.98)',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
                style={{ padding: '11px 14px' }}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            {user ? (
              <button className="btn-logout" onClick={handleLogout} style={{ marginTop: '8px', justifyContent: 'center' }}>
                <LogOut size={15} /> Logout
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
                <Link to="/login" className="btn-login" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
                <Link to="/register" className="btn-cta" style={{ flex: 1, textAlign: 'center' }}>Sign Up →</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <span className="ticker-inner">
          {Array.from({ length: 4 }).flatMap((_, i) =>
            TICKER_ITEMS.map((t, j) =>
              t === '★'
                ? <span key={`${i}-${j}`} style={{ color: '#60a5fa', margin: '0 12px' }}>★</span>
                : <span key={`${i}-${j}`} style={{ margin: '0 18px' }}>{t}</span>
            )
          )}
        </span>
      </div>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

        {/* Animated background grid */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `linear-gradient(rgba(37,99,235,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.035) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          animation: 'grid-pan 8s linear infinite',
        }} />

        {/* Ambient orbs */}
        <div className="orb" style={{ width: '600px', height: '600px', top: '-200px', left: '-150px', background: 'rgba(29,78,216,0.12)', animationDelay: '0s' }} />
        <div className="orb" style={{ width: '500px', height: '500px', top: '30%', right: '-180px', background: 'rgba(129,140,248,0.09)', animationDelay: '-3s' }} />
        <div className="orb" style={{ width: '400px', height: '400px', bottom: '10%', left: '20%', background: 'rgba(59,130,246,0.07)', animationDelay: '-1.5s' }} />

        {/* ── HOME HERO (shown only on home route) ── */}
        {isHome && (
          <>
            <section className="hero-section" style={{ zIndex: 1, position: 'relative' }}>
              {/* Decorative rings */}
              <div className="ring-spin" style={{ width: '500px', height: '500px', top: '50%', left: '50%', marginTop: '-250px', marginLeft: '-250px', opacity: 0.4 }} />
              <div className="ring-spin" style={{ width: '720px', height: '720px', top: '50%', left: '50%', marginTop: '-360px', marginLeft: '-360px', opacity: 0.2, animationDirection: 'reverse', animationDuration: '34s' }} />

              <div className="hero-badge">
                <Sparkles size={11} /> AI-Powered Learning Platform
              </div>

              <h1 className="hero-title">
                Learn Smarter<br />
                <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>With AI</span>
              </h1>

              <p className="hero-sub">
                Adaptive courses, real-time AI tutoring, and a curriculum built by experts — 
                everything you need to master AI, ML, and cutting-edge tech in record time.
              </p>

              <div className="hero-cta-group">
                <Link to="/courses" className="hero-btn-primary">
                  <BookOpen size={16} /> Explore Courses
                </Link>
                <Link to="/register" className="hero-btn-secondary">
                  Start for Free →
                </Link>
              </div>

              {/* Stats */}
              <div className="stat-row">
                {[
                  { num: '50K+', label: 'Learners' },
                  { num: '200+', label: 'Courses' },
                  { num: '98%', label: 'Satisfaction' },
                  { num: '4.9★', label: 'Rating' },
                ].map(({ num, label }) => (
                  <div key={label} className="stat-item">
                    <div className="stat-num">{num}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', padding: '0 24px 48px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: '100px', padding: '6px 18px', marginBottom: '20px',
                  fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '11px',
                  fontWeight: 700, letterSpacing: '0.09em', color: '#60a5fa', textTransform: 'uppercase',
                }}>
                  <Zap size={10} /> Why AI ELearn
                </div>
                <h2 style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700,
                  background: 'linear-gradient(160deg, #fff 0%, #93c5fd 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '14px',
                }}>
                  The Future of Learning<br />Is Already Here
                </h2>
                <p style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: 'rgba(255,255,255,0.35)', fontSize: '16px', maxWidth: '480px', margin: '0 auto',
                  lineHeight: 1.65,
                }}>
                  From total beginner to industry-ready — our platform accelerates every step.
                </p>
              </div>

              <div className="features-strip">
                {FEATURES.map(({ icon, bg, border, title, text }) => (
                  <div key={title} className="feature-card">
                    <div className="feature-icon" style={{ background: bg, border: `1px solid ${border}` }}>
                      {icon}
                    </div>
                    <div className="feature-title">{title}</div>
                    <div className="feature-text">{text}</div>
                  </div>
                ))}
              </div>

              {/* CTA Banner */}
              <div style={{
                margin: '40px 24px 80px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto',
                background: 'linear-gradient(135deg, rgba(29,78,216,0.2), rgba(129,140,248,0.12))',
                border: '1px solid rgba(59,111,255,0.25)', borderRadius: '24px',
                padding: 'clamp(32px, 5vw, 56px)', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.7), transparent)' }} />
                <h2 style={{
                  fontFamily: "'Clash Display', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '14px',
                }}>
                  Ready to Transform<br />Your Career?
                </h2>
                <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: 'rgba(255,255,255,0.42)', fontSize: '15px', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                  Join 50,000+ learners who chose smarter. Start free, upgrade when you're ready.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/register" className="hero-btn-primary" style={{ fontSize: '14px', padding: '13px 28px' }}>
                    Create Free Account
                  </Link>
                  <Link to="/courses" className="hero-btn-secondary" style={{ fontSize: '14px', padding: '13px 28px' }}>
                    Browse Courses
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Page content (non-home routes) ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'rgba(2,4,15,0.98)',
        borderTop: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(29,78,216,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 36px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>

            {/* Brand */}
            <div style={{ maxWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #1d4ed8, #818cf8)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={15} color="white" />
                </div>
                <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: '16px', background: 'linear-gradient(90deg, #93c5fd, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI ELearn</span>
              </div>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.65 }}>
                Personalized AI-powered learning for everyone — from curious beginners to professional engineers.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              {[
                { head: 'Platform', links: ['Courses', 'Dashboard', 'Teach'] },
                { head: 'Company', links: ['About', 'Blog', 'Careers'] },
                { head: 'Legal', links: ['Privacy', 'Terms', 'Contact'] },
              ].map(({ head, links }) => (
                <div key={head}>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.09em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '14px' }}>{head}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', fontFamily: "'Cabinet Grotesk', sans-serif", color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
              © {new Date().getFullYear()} <span style={{ color: '#3b82f6', opacity: 0.8 }}>AI ELearn</span> — All rights reserved
            </p>
            <p style={{ fontSize: '12px', fontFamily: "'Cabinet Grotesk', sans-serif", color: 'rgba(255,255,255,0.18)' }}>
              Built with <span style={{ color: '#f87171' }}>♥</span> for learners everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}