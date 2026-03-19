import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  Sparkles, Brain, TrendingUp, MessageSquare, CheckCircle,
  Star, Zap, Shield, Award, Users, BookOpen, ChevronDown,
  ArrowRight, PlayCircle, GraduationCap, Clock, Globe,
  Cpu, Code2, BarChart2, Lock, Infinity, ChevronRight
} from 'lucide-react';

/* ─── Styles ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

  :root {
    --bg:#02040f; --surface:rgba(8,14,36,0.85);
    --border:rgba(56,114,255,0.13);
    --accent:#3b6fff; --accent2:#60a5fa; --accent3:#a78bfa;
    --green:#34d399; --amber:#fbbf24; --red:#f87171;
  }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes float-y   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes float-y2  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes card-in   { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes shimmer   { 0%{background-position:-400% center} 100%{background-position:400% center} }
  @keyframes pulse-glow{ 0%,100%{box-shadow:0 0 24px rgba(59,111,255,0.35)} 50%{box-shadow:0 0 52px rgba(59,111,255,0.7)} }
  @keyframes badge-glow{ 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.5)} 50%{box-shadow:0 0 0 6px rgba(167,139,250,0)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev  { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
  @keyframes grid-pan  { from{background-position:0 0} to{background-position:60px 60px} }
  @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes orbit     { from{transform:rotate(0deg) translateX(280px) rotate(0deg)} to{transform:rotate(360deg) translateX(280px) rotate(-360deg)} }
  @keyframes gradient-shift {
    0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
  }
  @keyframes count-up  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes border-spin {
    from { --angle: 0deg; } to { --angle: 360deg; }
  }

  html { scroll-behavior: smooth; }

  .hp { background:var(--bg); font-family:'Cabinet Grotesk',sans-serif; color:rgba(255,255,255,0.88); overflow-x:hidden; }

  /* Grid bg */
  .hp-grid {
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image:
      linear-gradient(rgba(37,99,235,0.028) 1px,transparent 1px),
      linear-gradient(90deg,rgba(37,99,235,0.028) 1px,transparent 1px);
    background-size:64px 64px;
    animation:grid-pan 10s linear infinite;
  }

  /* ─── HERO ─── */
  .hp-hero {
    position:relative;z-index:1;
    min-height:96vh;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:80px 24px 60px;text-align:center;
    overflow:hidden;
  }
  .hp-hero-orb1 {
    position:absolute;width:800px;height:800px;border-radius:50%;
    top:-300px;left:-250px;pointer-events:none;
    background:radial-gradient(circle,rgba(29,78,216,0.14) 0%,transparent 65%);
    animation:float-y 10s ease-in-out infinite;
  }
  .hp-hero-orb2 {
    position:absolute;width:600px;height:600px;border-radius:50%;
    top:-100px;right:-200px;pointer-events:none;
    background:radial-gradient(circle,rgba(129,140,248,0.1) 0%,transparent 65%);
    animation:float-y 13s ease-in-out infinite;animation-delay:-5s;
  }
  .hp-hero-orb3 {
    position:absolute;width:400px;height:400px;border-radius:50%;
    bottom:-80px;left:30%;pointer-events:none;
    background:radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 65%);
  }

  /* Orbital rings */
  .hp-ring {
    position:absolute;border-radius:50%;border:1px dashed rgba(59,111,255,0.1);
    pointer-events:none;
  }

  .hp-hero-badge {
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(167,139,250,0.1);
    border:1px solid rgba(167,139,250,0.3);
    border-radius:100px;padding:7px 20px;
    font-size:12px;font-weight:700;letter-spacing:0.08em;
    color:var(--accent3);text-transform:uppercase;
    margin-bottom:28px;
    animation:badge-glow 2.5s ease-in-out infinite, fadeIn 0.7s ease both;
  }

  .hp-hero-title {
    font-family:'Clash Display',sans-serif;
    font-size:clamp(48px,8vw,96px);font-weight:700;
    line-height:1.0;letter-spacing:-0.04em;
    margin-bottom:24px;
    animation:fadeUp 0.8s ease 0.1s both;
  }
  .hp-hero-title .line1 {
    background:linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.85) 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    display:block;
  }
  .hp-hero-title .line2 {
    background:linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#a78bfa 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    display:block;
    background-size:200% auto;
    animation:gradient-shift 4s ease infinite;
  }

  .hp-hero-sub {
    font-size:clamp(17px,2.2vw,21px);color:rgba(255,255,255,0.4);
    line-height:1.65;max-width:600px;font-weight:400;
    animation:fadeUp 0.8s ease 0.25s both;
    margin-bottom:40px;
  }

  .hp-cta-group {
    display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
    animation:fadeUp 0.8s ease 0.4s both;
    margin-bottom:64px;
  }
  .hp-btn-primary {
    display:inline-flex;align-items:center;gap:9px;
    padding:16px 36px;border-radius:14px;
    font-family:'Cabinet Grotesk',sans-serif;font-weight:700;font-size:15px;
    text-decoration:none;color:#fff;
    background:linear-gradient(135deg,#1d4ed8,#3b82f6,#818cf8);
    background-size:200% auto;
    animation:pulse-glow 3.5s ease-in-out infinite, gradient-shift 5s ease infinite;
    transition:transform 0.2s;letter-spacing:0.01em;
    position:relative;overflow:hidden;
  }
  .hp-btn-primary::after {
    content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
    transform:skewX(-20deg);transition:left 0.5s;
  }
  .hp-btn-primary:hover{transform:translateY(-3px);}
  .hp-btn-primary:hover::after{left:150%;}

  .hp-btn-secondary {
    display:inline-flex;align-items:center;gap:9px;
    padding:16px 36px;border-radius:14px;
    font-family:'Cabinet Grotesk',sans-serif;font-weight:600;font-size:15px;
    text-decoration:none;color:rgba(255,255,255,0.65);
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.12);
    transition:all 0.2s;
  }
  .hp-btn-secondary:hover{background:rgba(255,255,255,0.09);color:rgba(255,255,255,0.9);transform:translateY(-2px);}

  /* Hero stats */
  .hp-hero-stats {
    display:flex;gap:0;justify-content:center;flex-wrap:wrap;
    border:1px solid rgba(255,255,255,0.07);border-radius:18px;
    background:rgba(8,14,36,0.7);backdrop-filter:blur(14px);
    overflow:hidden;animation:fadeUp 0.8s ease 0.55s both;
  }
  .hp-hstat {
    padding:22px 40px;text-align:center;
    border-right:1px solid rgba(255,255,255,0.06);
  }
  .hp-hstat:last-child{border-right:none;}
  .hp-hstat-num {
    font-family:'Clash Display',sans-serif;font-size:30px;font-weight:700;line-height:1;
    background:linear-gradient(135deg,#60a5fa,#a78bfa);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .hp-hstat-lbl {
    font-size:11px;font-weight:700;letter-spacing:0.08em;
    color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:5px;
  }

  /* ─── TICKER ─── */
  .hp-ticker {
    position:relative;z-index:1;
    overflow:hidden;white-space:nowrap;
    background:rgba(59,111,255,0.05);
    border-top:1px solid rgba(59,111,255,0.1);
    border-bottom:1px solid rgba(59,111,255,0.1);
    padding:11px 0;
  }
  .hp-ticker-inner {
    display:inline-block;
    animation:ticker 30s linear infinite;
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:12px;font-weight:600;letter-spacing:0.06em;
    color:rgba(255,255,255,0.25);
  }
  .hp-ticker-inner span{color:var(--accent2);margin:0 16px;}

  /* ─── Section wrapper ─── */
  .hp-section {
    position:relative;z-index:1;
    padding:96px 24px;
  }
  .hp-section-inner { max-width:1200px;margin:0 auto; }

  .hp-section-label {
    display:inline-flex;align-items:center;gap:7px;
    background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);
    border-radius:100px;padding:6px 18px;
    font-size:11px;font-weight:700;letter-spacing:0.09em;
    color:var(--accent2);text-transform:uppercase;
    margin-bottom:20px;
  }
  .hp-section-title {
    font-family:'Clash Display',sans-serif;
    font-size:clamp(32px,5vw,56px);font-weight:700;
    letter-spacing:-0.03em;line-height:1.08;
    background:linear-gradient(160deg,#fff 0%,#93c5fd 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    margin-bottom:16px;
  }
  .hp-section-sub {
    font-size:16px;color:rgba(255,255,255,0.35);line-height:1.65;
    max-width:520px;font-weight:400;
  }

  /* ─── FEATURES ─── */
  .hp-features-grid {
    display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:18px;margin-top:52px;
  }
  .hp-feat-card {
    background:rgba(8,14,36,0.75);
    border:1px solid rgba(56,114,255,0.12);
    border-radius:20px;padding:28px;
    position:relative;overflow:hidden;
    backdrop-filter:blur(10px);
    transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;
  }
  .hp-feat-card::before {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(96,165,250,0.5),transparent);
    opacity:0;transition:opacity 0.25s;
  }
  .hp-feat-card:hover{transform:translateY(-5px);border-color:rgba(59,111,255,0.3);box-shadow:0 20px 48px rgba(0,0,0,0.4);}
  .hp-feat-card:hover::before{opacity:1;}
  .hp-feat-icon {
    width:48px;height:48px;border-radius:13px;
    display:flex;align-items:center;justify-content:center;
    margin-bottom:18px;
  }
  .hp-feat-title {
    font-family:'Clash Display',sans-serif;font-size:19px;font-weight:600;
    color:rgba(255,255,255,0.9);letter-spacing:-0.01em;margin-bottom:10px;
  }
  .hp-feat-desc {
    font-size:14px;line-height:1.7;color:rgba(255,255,255,0.36);font-weight:400;
  }

  /* ─── HOW IT WORKS ─── */
  .hp-steps {
    display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
    gap:0;margin-top:52px;position:relative;
  }
  .hp-steps::before {
    content:'';position:absolute;top:40px;left:10%;right:10%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(59,111,255,0.3),rgba(129,140,248,0.3),transparent);
    pointer-events:none;
  }
  .hp-step { text-align:center;padding:0 20px;position:relative; }
  .hp-step-num {
    width:64px;height:64px;border-radius:50%;margin:0 auto 20px;
    display:flex;align-items:center;justify-content:center;
    font-family:'Clash Display',sans-serif;font-size:22px;font-weight:700;
    position:relative;
  }
  .hp-step-title {
    font-family:'Clash Display',sans-serif;font-size:17px;font-weight:600;
    color:rgba(255,255,255,0.85);margin-bottom:8px;
  }
  .hp-step-desc { font-size:13px;color:rgba(255,255,255,0.33);line-height:1.65; }

  /* ─── SOCIAL PROOF TICKER ─── */
  .hp-reviews-row {
    display:flex;gap:16px;margin-top:48px;
    overflow:hidden;
  }
  .hp-review-card {
    background:rgba(8,14,36,0.8);
    border:1px solid rgba(56,114,255,0.12);
    border-radius:18px;padding:22px;
    min-width:280px;flex-shrink:0;
    transition:transform 0.25s,border-color 0.25s;
    backdrop-filter:blur(10px);
  }
  .hp-review-card:hover{transform:translateY(-4px);border-color:rgba(59,111,255,0.28);}
  .hp-reviewer {
    display:flex;align-items:center;gap:10px;margin-bottom:14px;
  }
  .hp-reviewer-avatar {
    width:38px;height:38px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-family:'Clash Display',sans-serif;font-size:15px;font-weight:700;color:#fff;
    flex-shrink:0;
  }
  .hp-reviewer-name { font-size:13px;font-weight:700;color:rgba(255,255,255,0.8); }
  .hp-reviewer-role { font-size:11px;color:rgba(255,255,255,0.3);font-weight:500; }
  .hp-review-stars { display:flex;gap:2px;margin-bottom:10px; }
  .hp-review-text { font-size:13px;line-height:1.65;color:rgba(255,255,255,0.45); }

  /* ─── PRICING ─── */
  .hp-pricing-grid {
    display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:20px;margin-top:52px;max-width:960px;
  }
  .hp-plan-card {
    background:rgba(8,14,36,0.8);
    border:1px solid rgba(56,114,255,0.14);
    border-radius:22px;padding:32px;
    position:relative;overflow:hidden;
    backdrop-filter:blur(12px);
    transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;
    display:flex;flex-direction:column;
  }
  .hp-plan-card:hover{transform:translateY(-4px);}
  .hp-plan-card.popular {
    border-color:rgba(96,165,250,0.4);
    box-shadow:0 0 48px rgba(59,111,255,0.2),0 0 0 1px rgba(59,111,255,0.15);
  }
  .hp-popular-badge {
    position:absolute;top:0;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,#1d4ed8,#818cf8);
    color:#fff;font-size:11px;font-weight:800;letter-spacing:0.08em;
    padding:5px 20px;border-radius:0 0 12px 12px;
    text-transform:uppercase;
  }
  .hp-plan-name {
    font-family:'Clash Display',sans-serif;font-size:14px;font-weight:600;
    letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);
    margin-bottom:16px;
  }
  .hp-plan-price {
    font-family:'Clash Display',sans-serif;font-weight:700;line-height:1;
    letter-spacing:-0.04em;margin-bottom:6px;
  }
  .hp-plan-period { font-size:13px;color:rgba(255,255,255,0.3);margin-bottom:24px;font-weight:500; }
  .hp-plan-divider { height:1px;background:rgba(255,255,255,0.07);margin:20px 0; }
  .hp-plan-feature {
    display:flex;align-items:flex-start;gap:10px;
    font-size:13.5px;color:rgba(255,255,255,0.55);
    padding:6px 0;font-weight:500;
  }
  .hp-plan-feature.off { opacity:0.35;text-decoration:line-through; }
  .hp-plan-btn {
    width:100%;padding:14px;border-radius:12px;
    font-family:'Cabinet Grotesk',sans-serif;font-size:14px;font-weight:700;
    cursor:pointer;border:none;text-decoration:none;display:flex;
    align-items:center;justify-content:center;gap:8px;
    transition:all 0.25s;margin-top:auto;letter-spacing:0.01em;
  }
  .hp-plan-btn.primary {
    color:#fff;background:linear-gradient(135deg,#1d4ed8,#3b82f6,#818cf8);
    animation:pulse-glow 3.5s ease-in-out infinite;
  }
  .hp-plan-btn.primary:hover{transform:translateY(-2px);}
  .hp-plan-btn.secondary {
    color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1);
  }
  .hp-plan-btn.secondary:hover{background:rgba(255,255,255,0.09);color:rgba(255,255,255,0.85);}

  /* Guarantee badge */
  .hp-guarantee {
    display:inline-flex;align-items:center;gap:8px;margin-top:28px;
    padding:10px 20px;border-radius:12px;
    background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);
    font-size:13px;font-weight:600;color:rgba(52,211,153,0.8);
  }

  /* ─── FAQ ─── */
  .hp-faq { display:flex;flex-direction:column;gap:12px;margin-top:52px; }
  .hp-faq-item {
    background:rgba(8,14,36,0.75);
    border:1px solid rgba(56,114,255,0.12);
    border-radius:14px;overflow:hidden;
    backdrop-filter:blur(10px);
    transition:border-color 0.2s;
  }
  .hp-faq-item:hover{border-color:rgba(59,111,255,0.25);}
  .hp-faq-q {
    width:100%;display:flex;align-items:center;justify-content:space-between;
    padding:18px 22px;background:none;border:none;cursor:pointer;
    font-family:'Cabinet Grotesk',sans-serif;font-size:15px;font-weight:600;
    color:rgba(255,255,255,0.75);text-align:left;gap:12px;
  }
  .hp-faq-q:hover{color:rgba(255,255,255,0.95);}
  .hp-faq-chevron{transition:transform 0.3s;flex-shrink:0;color:rgba(255,255,255,0.3);}
  .hp-faq-chevron.open{transform:rotate(180deg);color:var(--accent2);}
  .hp-faq-a {
    padding:0 22px 18px;font-size:14px;line-height:1.7;
    color:rgba(255,255,255,0.38);font-weight:400;
    border-top:1px solid rgba(255,255,255,0.05);padding-top:14px;
  }

  /* ─── FINAL CTA ─── */
  .hp-final-cta {
    position:relative;z-index:1;
    margin:0 24px 80px;
    border-radius:28px;overflow:hidden;
    background:linear-gradient(135deg,rgba(29,78,216,0.25),rgba(129,140,248,0.15));
    border:1px solid rgba(59,111,255,0.3);
    padding:72px 40px;text-align:center;
  }
  .hp-final-cta::before {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(129,140,248,0.8),rgba(96,165,250,0.8),transparent);
  }
  .hp-final-cta-orb {
    position:absolute;width:600px;height:600px;border-radius:50%;
    top:50%;left:50%;transform:translate(-50%,-50%);
    background:radial-gradient(circle,rgba(59,111,255,0.15) 0%,transparent 65%);
    pointer-events:none;
  }

  /* ─── Trust logos ─── */
  .hp-trust-row {
    display:flex;gap:32px;align-items:center;justify-content:center;flex-wrap:wrap;
    margin-top:40px;padding:28px;
    background:rgba(8,14,36,0.5);border:1px solid rgba(255,255,255,0.05);
    border-radius:16px;
  }
  .hp-trust-item {
    font-family:'Clash Display',sans-serif;font-size:15px;font-weight:600;
    color:rgba(255,255,255,0.15);letter-spacing:0.04em;
    transition:color 0.2s;cursor:default;
  }
  .hp-trust-item:hover{color:rgba(255,255,255,0.35);}

  @media(max-width:768px){
    .hp-hstat{padding:16px 20px;}
    .hp-final-cta{margin:0 12px 60px;padding:48px 24px;}
    .hp-steps::before{display:none;}
  }
`;

function InjectCSS() {
  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* Animated number */
function AnimNum({ target, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const step = Math.ceil(target / 40);
    let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      setN(cur);
      if (cur >= target) clearInterval(iv);
    }, 30);
  }, [target]);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

/* FAQ item */
function FaqItem({ q, a, delay = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hp-faq-item" style={{ animation: `card-in 0.4s ease ${delay}ms both` }}>
      <button className="hp-faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className={`hp-faq-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="hp-faq-a">{a}</div>}
    </div>
  );
}

/* ─── DATA ─── */
const FEATURES = [
  { icon: <Brain size={22} color="#a78bfa" />, bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.2)', title: 'Personalized AI Tutor', desc: 'Your AI tutor remembers every weak spot, adapts explanations to your style, and nudges you exactly when you need it.' },
  { icon: <TrendingUp size={22} color="#60a5fa" />, bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.2)', title: 'Adaptive Quizzes', desc: 'Quizzes evolve with your performance — harder when you excel, supportive when you struggle. Real mastery, not memorization.' },
  { icon: <MessageSquare size={22} color="#34d399" />, bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.2)', title: 'Real-Time AI Chat', desc: 'Ask anything mid-lesson. Get instant, streaming answers — like a 1-on-1 session with an expert, 24/7.' },
  { icon: <Cpu size={22} color="#fbbf24" />, bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.2)', title: 'Smart Learning Paths', desc: 'AI maps your goals to a custom curriculum. No wasted time on what you already know.' },
  { icon: <BarChart2 size={22} color="#f87171" />, bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.2)', title: 'Progress Analytics', desc: 'Deep insights into your learning velocity, retention rates, and skill gaps — updated in real time.' },
  { icon: <Award size={22} color="#818cf8" />, bg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.2)', title: 'Verified Certificates', desc: 'Blockchain-backed certificates recognized by leading tech companies. Turn learning into career leverage.' },
];

const STEPS = [
  { n: '01', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', title: 'Sign Up Free', desc: 'Create your account in 30 seconds — no credit card required.' },
  { n: '02', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', title: 'Pick a Course', desc: 'Browse 200+ expert-built courses across AI, ML, Web Dev & more.' },
  { n: '03', color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', title: 'Learn with AI', desc: 'Your AI tutor adapts every lesson, quiz, and explanation to you.' },
  { n: '04', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', title: 'Earn & Grow', desc: 'Get certified, build your portfolio, and level up your career.' },
];

const REVIEWS = [
  { name: 'Priya S.', role: 'ML Engineer @ Google', avatar: 'P', grad: 'linear-gradient(135deg,#1d4ed8,#818cf8)', text: 'The AI tutor actually remembered I struggled with backpropagation and created custom exercises just for me. Nothing else comes close.' },
  { name: 'Marcus T.', role: 'Full-Stack Dev', avatar: 'M', grad: 'linear-gradient(135deg,#059669,#34d399)', text: "I finished the React course in 3 weeks. The adaptive quizzes kept me in the zone — not too easy, not overwhelming. Incredible UX." },
  { name: 'Aisha K.', role: 'Data Scientist', avatar: 'A', grad: 'linear-gradient(135deg,#d97706,#fbbf24)', text: 'The progress analytics showed me exactly where my knowledge gaps were. I improved my interview score by 40% in a month.' },
  { name: 'James L.', role: 'DevOps Engineer', avatar: 'J', grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', text: 'Real-time AI chat mid-lesson is a game-changer. I asked 50+ questions and got instant, clear answers every time.' },
  { name: 'Riya M.', role: 'CS Student', avatar: 'R', grad: 'linear-gradient(135deg,#0e7490,#38bdf8)', text: 'The free tier alone beat every paid platform I tried. The certificate helped me land my first internship.' },
];

const PLANS = [
  {
    name: 'Starter', price: 'Free', period: 'forever, no card needed', popular: false,
    color: '#60a5fa',
    features: [
      { text: '5 courses access', on: true },
      { text: 'AI tutor (10 msgs/day)', on: true },
      { text: 'Basic quizzes', on: true },
      { text: 'Community access', on: true },
      { text: 'Advanced analytics', on: false },
      { text: 'Certificates', on: false },
      { text: 'Unlimited AI chat', on: false },
    ],
  },
  {
    name: 'Pro', price: '$19', period: 'per month, billed monthly', popular: true,
    color: '#818cf8',
    features: [
      { text: 'All 200+ courses', on: true },
      { text: 'Unlimited AI tutor', on: true },
      { text: 'Adaptive quizzes', on: true },
      { text: 'Full analytics dashboard', on: true },
      { text: 'Verified certificates', on: true },
      { text: 'Priority support', on: true },
      { text: 'Offline downloads', on: false },
    ],
  },
  {
    name: 'Lifetime', price: '$299', period: 'one-time payment, forever', popular: false,
    color: '#fbbf24',
    features: [
      { text: 'Everything in Pro', on: true },
      { text: 'Lifetime access', on: true },
      { text: 'Offline downloads', on: true },
      { text: 'Early course access', on: true },
      { text: 'Private Discord group', on: true },
      { text: '1-on-1 mentoring session', on: true },
      { text: 'Future updates free', on: true },
    ],
  },
];

const FAQS = [
  { q: 'Is the free plan really free forever?', a: 'Yes — no credit card, no trials. The Starter plan gives you genuine access to 5 courses and a limited AI tutor. Upgrade only if you want the full experience.' },
  { q: 'How does the AI tutor personalize learning?', a: 'Our AI tracks every quiz answer, lesson pause, and question you ask. It builds a dynamic knowledge graph of your strengths and gaps, then tailors explanations, examples, and quiz difficulty in real time.' },
  { q: 'Can I get a refund if I\'m not satisfied?', a: 'Absolutely. We offer a 30-day money-back guarantee on Pro and Lifetime plans, no questions asked. Your satisfaction is our priority.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, UPI, and international payments via Stripe. All transactions are encrypted and secure.' },
  { q: 'Do certificates have real value?', a: 'Our certificates are blockchain-verified and recognized by partners including top-tier tech companies. They include a unique verification URL that employers can check instantly.' },
  { q: 'Can I switch plans later?', a: "Yes — upgrade or downgrade anytime. If you upgrade mid-cycle, you'll only be charged the prorated difference. Downgrades take effect at the next billing cycle." },
];

const TICKER_ITEMS = ['Machine Learning','★','Deep Learning','★','Prompt Engineering','★','Neural Networks','★','Computer Vision','★','NLP','★','Data Science','★','Python for AI','★','Transformers','★','RL','★','MLOps','★','AI Ethics','★'];

/* ─── MAIN ─── */
export default function HomePage() {
  return (
    <div className="hp">
      <InjectCSS />
      <div className="hp-grid" />

      {/* ══ HERO ══ */}
      <section className="hp-hero">
        <div className="hp-hero-orb1" />
        <div className="hp-hero-orb2" />
        <div className="hp-hero-orb3" />

        {/* Decorative rings */}
        <div className="hp-ring" style={{ width:600, height:600, top:'50%', left:'50%', marginTop:-300, marginLeft:-300, animation:'spin-slow 40s linear infinite', opacity:0.5 }} />
        <div className="hp-ring" style={{ width:900, height:900, top:'50%', left:'50%', marginTop:-450, marginLeft:-450, animation:'spin-rev 60s linear infinite', opacity:0.25 }} />

        <div className="hp-hero-badge"><Sparkles size={11} /> AI-Powered Personalized Learning</div>

        <h1 className="hp-hero-title">
          <span className="line1">Learn Smarter,</span>
          <span className="line2">Grow Faster</span>
        </h1>

        <p className="hp-hero-sub">
          Courses that adapt to you. An AI tutor that knows your weak spots.
          Quizzes that evolve as you master skills. The future of learning — today.
        </p>

        <div className="hp-cta-group">
          <Link to="/courses" className="hp-btn-primary">
            <BookOpen size={17} /> Explore Courses
          </Link>
          <Link to="/register" className="hp-btn-secondary">
            <PlayCircle size={17} /> Start for Free
          </Link>
        </div>

        <div className="hp-hero-stats">
          {[
            { num: 50000, suffix: '+', lbl: 'Learners' },
            { num: 200,   suffix: '+', lbl: 'Courses' },
            { num: 98,    suffix: '%', lbl: 'Satisfaction' },
            { num: 150,   suffix: '+', lbl: 'Instructors' },
          ].map(({ num, suffix, lbl }) => (
            <div key={lbl} className="hp-hstat">
              <div className="hp-hstat-num"><AnimNum target={num} suffix={suffix} /></div>
              <div className="hp-hstat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="hp-ticker">
        <span className="hp-ticker-inner">
          {Array.from({ length: 4 }).flatMap((_, i) =>
            TICKER_ITEMS.map((t, j) =>
              t === '★'
                ? <span key={`${i}-${j}`}>★</span>
                : <span key={`${i}-${j}`} style={{ margin: '0 18px' }}>{t}</span>
            )
          )}
        </span>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="hp-section" id="features">
        <div className="hp-section-inner">
          <div style={{ textAlign: 'center' }}>
            <div className="hp-section-label"><Zap size={11} /> Platform Features</div>
            <h2 className="hp-section-title">Everything you need<br />to master any skill</h2>
            <p className="hp-section-sub" style={{ margin: '0 auto' }}>
              AI ELearn isn't just a course platform — it's an intelligent learning companion that evolves with you every step of the way.
            </p>
          </div>

          <div className="hp-features-grid">
            {FEATURES.map(({ icon, bg, border, title, desc }, i) => (
              <div key={title} className="hp-feat-card" style={{ animation: `card-in 0.45s ease ${i * 70}ms both` }}>
                <div className="hp-feat-icon" style={{ background: bg, border: `1px solid ${border}` }}>{icon}</div>
                <div className="hp-feat-title">{title}</div>
                <div className="hp-feat-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider shimmer */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.2),rgba(167,139,250,0.2),transparent)', position: 'relative', zIndex: 1 }} />

      {/* ══ HOW IT WORKS ══ */}
      <section className="hp-section" id="how">
        <div className="hp-section-inner">
          <div style={{ textAlign: 'center' }}>
            <div className="hp-section-label"><GraduationCap size={11} /> How It Works</div>
            <h2 className="hp-section-title">From zero to certified<br />in 4 simple steps</h2>
          </div>

          <div className="hp-steps">
            {STEPS.map(({ n, color, bg, border, title, desc }, i) => (
              <div key={n} className="hp-step" style={{ animation: `card-in 0.45s ease ${i * 100}ms both` }}>
                <div className="hp-step-num" style={{ background: bg, border: `1px solid ${border}`, color }}>
                  {n}
                </div>
                <div className="hp-step-title">{title}</div>
                <div className="hp-step-desc">{desc}</div>
              </div>
            ))}
          </div>

          {/* Trust logos */}
          <div className="hp-trust-row">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Trusted by learners from</span>
            {['Google', 'Meta', 'Amazon', 'Microsoft', 'Stripe', 'OpenAI', 'Anthropic'].map(co => (
              <div key={co} className="hp-trust-item">{co}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.2),rgba(167,139,250,0.2),transparent)', position: 'relative', zIndex: 1 }} />

      {/* ══ REVIEWS ══ */}
      <section className="hp-section" id="reviews">
        <div className="hp-section-inner">
          <div style={{ textAlign: 'center', marginBottom: 0 }}>
            <div className="hp-section-label"><Star size={11} /> Student Reviews</div>
            <h2 className="hp-section-title">Loved by 50,000+<br />learners worldwide</h2>
            <p className="hp-section-sub" style={{ margin: '0 auto 0' }}>
              Real results from real people — not cherry-picked success stories.
            </p>
          </div>

          <div className="hp-reviews-row" style={{ overflowX: 'auto', paddingBottom: 8 }}>
            {REVIEWS.map(({ name, role, avatar, grad, text }, i) => (
              <div key={name} className="hp-review-card" style={{ animation: `card-in 0.4s ease ${i * 80}ms both` }}>
                <div className="hp-reviewer">
                  <div className="hp-reviewer-avatar" style={{ background: grad }}>{avatar}</div>
                  <div>
                    <div className="hp-reviewer-name">{name}</div>
                    <div className="hp-reviewer-role">{role}</div>
                  </div>
                </div>
                <div className="hp-review-stars">
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#fbbf24', fontSize: 14 }}>★</span>)}
                </div>
                <div className="hp-review-text">"{text}"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.2),rgba(167,139,250,0.2),transparent)', position: 'relative', zIndex: 1 }} />

      {/* ══ PRICING ══ */}
      <section className="hp-section" id="pricing">
        <div className="hp-section-inner">
          <div style={{ textAlign: 'center' }}>
            <div className="hp-section-label"><Zap size={11} /> Pricing Plans</div>
            <h2 className="hp-section-title">Simple, transparent<br />pricing — no surprises</h2>
            <p className="hp-section-sub" style={{ margin: '0 auto' }}>
              Start free. Upgrade when you're ready. Cancel anytime — we're that confident.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="hp-pricing-grid">
              {PLANS.map(({ name, price, period, popular, color, features }, i) => (
                <div key={name} className={`hp-plan-card ${popular ? 'popular' : ''}`}
                  style={{ animation: `card-in 0.45s ease ${i * 100}ms both`, paddingTop: popular ? 44 : 32 }}>
                  {popular && <div className="hp-popular-badge">Most Popular</div>}

                  <div className="hp-plan-name" style={{ color }}>{name}</div>
                  <div className="hp-plan-price" style={{
                    fontSize: price === 'Free' ? 48 : 44,
                    background: `linear-gradient(135deg,#fff,${color})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {price}
                  </div>
                  <div className="hp-plan-period">{period}</div>

                  <div className="hp-plan-divider" />

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: 24 }}>
                    {features.map(({ text, on }) => (
                      <div key={text} className={`hp-plan-feature ${!on ? 'off' : ''}`}>
                        <CheckCircle size={15} color={on ? color : 'rgba(255,255,255,0.2)'} style={{ flexShrink: 0, marginTop: 1 }} />
                        {text}
                      </div>
                    ))}
                  </div>

                  <Link to="/register"
                    className={`hp-plan-btn ${popular ? 'primary' : 'secondary'}`}
                    style={popular ? {} : { borderColor: `${color}30`, color }}>
                    {price === 'Free' ? 'Get Started Free' : popular ? <><Zap size={15} /> Get Pro Now</> : <><Award size={15} /> Get Lifetime</>}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div style={{ textAlign: 'center' }}>
            <div className="hp-guarantee" style={{ display: 'inline-flex' }}>
              <Shield size={16} color="#34d399" />
              30-day money-back guarantee · No questions asked · Instant refund
            </div>
          </div>

          {/* Payment logos */}
          <div style={{
            display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center',
            flexWrap: 'wrap', marginTop: 28,
          }}>
            {[
              { label: 'VISA', color: '#1a1f71' },
              { label: 'Mastercard', color: '#eb001b' },
              { label: 'PayPal', color: '#003087' },
              { label: 'Stripe', color: '#635bff' },
              { label: 'UPI', color: '#1a73e8' },
              { label: 'Amex', color: '#007bc1' },
            ].map(({ label, color }) => (
              <div key={label} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800,
                fontFamily: "'Clash Display', sans-serif", letterSpacing: '0.04em',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.35)',
              }}>{label}</div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
              <Lock size={12} /> 256-bit SSL encrypted
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.2),rgba(167,139,250,0.2),transparent)', position: 'relative', zIndex: 1 }} />

      {/* ══ FAQ ══ */}
      <section className="hp-section" id="faq">
        <div className="hp-section-inner" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="hp-section-label"><MessageSquare size={11} /> FAQ</div>
            <h2 className="hp-section-title">Questions? We've<br />got answers</h2>
          </div>
          <div className="hp-faq">
            {FAQS.map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} delay={i * 60} />)}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <div className="hp-final-cta" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hp-final-cta-orb" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hp-hero-badge" style={{ marginBottom: 24 }}><Sparkles size={11} /> Start Learning Today</div>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.08,
            background: 'linear-gradient(160deg,#fff 0%,#93c5fd 55%,#a78bfa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 18,
          }}>
            Your next skill is<br />one click away
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.38)', maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.65 }}>
            Join 50,000+ learners who chose smarter. Start free — upgrade only when you're ready.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="hp-btn-primary" style={{ fontSize: 15, padding: '15px 32px' }}>
              <Zap size={16} /> Create Free Account
            </Link>
            <Link to="/courses" className="hp-btn-secondary" style={{ fontSize: 15, padding: '15px 32px' }}>
              <BookOpen size={16} /> Browse Courses
            </Link>
          </div>
          <p style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.04em' }}>
            No credit card required · Cancel anytime · 30-day guarantee
          </p>
        </div>
      </div>
    </div>
  );
}