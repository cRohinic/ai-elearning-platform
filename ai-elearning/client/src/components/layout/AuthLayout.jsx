import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#000', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── LEFT HERO PANEL ── */}
      <div style={{
        flex: 1.1, position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '48px', overflow: 'hidden',
        background: 'linear-gradient(160deg, #020b2e 0%, #030d1f 50%, #000 100%)',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
        }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '60px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Top shimmer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.7), transparent)' }} />

        {/* SVG Illustration */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', width: '340px', height: '340px' }}>
          <svg viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="170" cy="170" r="148" stroke="rgba(59,130,246,0.12)" strokeWidth="1"/>
            <circle cx="170" cy="170" r="120" stroke="rgba(59,130,246,0.08)" strokeWidth="1" strokeDasharray="6 6"/>
            <circle cx="170" cy="170" r="88" stroke="rgba(96,165,250,0.18)" strokeWidth="1.5"/>
            <circle cx="170" cy="170" r="60" fill="rgba(29,78,216,0.12)"/>
            <circle cx="170" cy="170" r="40" fill="rgba(59,130,246,0.16)"/>
            <rect x="148" y="162" width="44" height="24" rx="5" fill="rgba(96,165,250,0.3)" stroke="rgba(147,197,253,0.5)" strokeWidth="1"/>
            <polygon points="170,148 195,162 145,162" fill="rgba(59,130,246,0.5)" stroke="rgba(147,197,253,0.5)" strokeWidth="1"/>
            <rect x="188" y="160" width="3" height="18" rx="1.5" fill="rgba(147,197,253,0.4)"/>
            <circle cx="170" cy="50" r="5" fill="#3b82f6" opacity="0.8"/>
            <circle cx="290" cy="170" r="4" fill="#60a5fa" opacity="0.6"/>
            <circle cx="50" cy="170" r="3.5" fill="#93c5fd" opacity="0.5"/>
            <circle cx="260" cy="80" r="3" fill="#bfdbfe" opacity="0.5"/>
            <circle cx="80" cy="260" r="3" fill="#60a5fa" opacity="0.4"/>
            <circle cx="260" cy="260" r="4" fill="#3b82f6" opacity="0.5"/>
            <line x1="170" y1="50" x2="170" y2="82" stroke="rgba(59,130,246,0.25)" strokeWidth="1"/>
            <line x1="290" y1="170" x2="258" y2="170" stroke="rgba(59,130,246,0.2)" strokeWidth="1"/>
            <line x1="50" y1="170" x2="82" y2="170" stroke="rgba(59,130,246,0.2)" strokeWidth="1"/>
            <rect x="16" y="90" width="90" height="44" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8"/>
            <circle cx="35" cy="112" r="8" fill="rgba(59,130,246,0.25)"/>
            <rect x="50" y="106" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.12)"/>
            <rect x="50" y="115" width="30" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
            <rect x="234" y="200" width="90" height="44" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8"/>
            <circle cx="253" cy="222" r="8" fill="rgba(96,165,250,0.2)"/>
            <rect x="268" y="216" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.1)"/>
            <rect x="268" y="225" width="30" height="4" rx="2" fill="rgba(255,255,255,0.05)"/>
          </svg>
        </div>

        {/* Hero copy */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '100px', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: '#93c5fd', letterSpacing: '0.06em', fontWeight: 500 }}>AI-POWERED LEARNING</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '44px', fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: '16px' }}>
            Learn Smarter,<br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #93c5fd, #bfdbfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Grow Faster.
            </span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '320px', marginBottom: '32px' }}>
            Join thousands of learners unlocking their potential with personalized AI-driven courses, real-time feedback, and expert mentorship.
          </p>
          <div style={{ display: 'flex', gap: '28px' }}>
            {[['50K+', 'Active Learners'], ['200+', 'AI Courses'], ['98%', 'Satisfaction']].map(([num, label], i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, color: '#fff' }}>{num}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ width: '460px', display: 'flex', flexDirection: 'column', background: '#050a14', borderLeft: '1px solid rgba(37,99,235,0.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ padding: '28px 40px 0', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 2 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(59,130,246,0.4)', border: '1px solid rgba(96,165,250,0.3)' }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '17px', background: 'linear-gradient(90deg, #93c5fd, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI ELearn
            </span>
          </Link>
        </div>

        {/* Form card */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', position: 'relative', zIndex: 2 }}>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(59,130,246,0.14)', borderRadius: '20px', padding: '38px 36px', boxShadow: '0 0 0 1px rgba(59,130,246,0.05), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 40px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 2 }}>
          <Sparkles size={12} color="#3b82f6" opacity={0.5} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>POWERED BY AI</span>
          <Sparkles size={12} color="#3b82f6" opacity={0.5} />
        </div>
      </div>
    </div>
  );
}