import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore.js';
import { updateProfile } from '../services/courseService.js';
import toast from 'react-hot-toast';
import {
  User, Mail, Shield, Brain, Target, Sparkles,
  CheckCircle, AlertCircle, ChevronRight, Save,
  GraduationCap, BookOpen, BarChart2, Zap,
  Eye, Headphones, Hand, Shuffle, Award, Edit3
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

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes float-y  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes card-in  { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 22px rgba(59,111,255,0.35)} 50%{box-shadow:0 0 48px rgba(59,111,255,0.65)} }
  @keyframes badge-glow { 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.4)} 50%{box-shadow:0 0 0 6px rgba(167,139,250,0)} }
  @keyframes shimmer  { 0%{background-position:-400% center} 100%{background-position:400% center} }
  @keyframes spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes grid-pan { from{background-position:0 0} to{background-position:60px 60px} }
  @keyframes avatar-ring { 0%,100%{box-shadow:0 0 0 3px rgba(59,111,255,0.2),0 0 32px rgba(59,111,255,0.2)} 50%{box-shadow:0 0 0 5px rgba(96,165,250,0.35),0 0 48px rgba(59,111,255,0.35)} }
  @keyframes chip-in { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  @keyframes save-success { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }

  .pp-page {
    min-height:100vh; background:var(--bg);
    font-family:'Cabinet Grotesk',sans-serif;
    color:rgba(255,255,255,0.88);
  }
  .pp-grid-bg {
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image:
      linear-gradient(rgba(37,99,235,0.028) 1px,transparent 1px),
      linear-gradient(90deg,rgba(37,99,235,0.028) 1px,transparent 1px);
    background-size:60px 60px;
    animation:grid-pan 10s linear infinite;
  }
  .pp-orb1 {
    position:fixed;width:700px;height:700px;border-radius:50%;
    top:-200px;left:-200px;pointer-events:none;z-index:0;
    background:radial-gradient(circle,rgba(29,78,216,0.1) 0%,transparent 65%);
    animation:float-y 10s ease-in-out infinite;
  }
  .pp-orb2 {
    position:fixed;width:500px;height:500px;border-radius:50%;
    bottom:-100px;right:-100px;pointer-events:none;z-index:0;
    background:radial-gradient(circle,rgba(129,140,248,0.08) 0%,transparent 65%);
  }

  .pp-inner {
    max-width:960px;margin:0 auto;
    padding:44px 24px 80px;
    position:relative;z-index:1;
  }

  /* ─── Breadcrumb ─── */
  .pp-breadcrumb {
    display:flex;align-items:center;gap:6px;
    font-size:12px;color:rgba(255,255,255,0.22);
    margin-bottom:32px;font-weight:500;
    animation:fadeIn 0.5s ease both;
  }
  .pp-breadcrumb a{color:rgba(255,255,255,0.35);text-decoration:none;transition:color 0.2s;}
  .pp-breadcrumb a:hover{color:var(--accent2);}
  .pp-breadcrumb span{color:var(--accent3);}

  /* ─── Header ─── */
  .pp-header {
    margin-bottom:36px;
    animation:fadeUp 0.6s ease both;
  }
  .pp-header-badge {
    display:inline-flex;align-items:center;gap:7px;
    background:rgba(167,139,250,0.1);
    border:1px solid rgba(167,139,250,0.28);
    border-radius:100px;padding:6px 18px;
    font-size:11px;font-weight:700;letter-spacing:0.09em;
    color:var(--accent3);text-transform:uppercase;
    margin-bottom:16px;
    animation:badge-glow 2.5s ease-in-out infinite;
  }
  .pp-title {
    font-family:'Clash Display',sans-serif;
    font-size:clamp(28px,4vw,44px);font-weight:700;
    letter-spacing:-0.03em;line-height:1.05;
    background:linear-gradient(150deg,#fff 0%,#93c5fd 55%,#a78bfa 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    margin-bottom:8px;
  }
  .pp-sub {
    font-size:14px;color:rgba(255,255,255,0.32);line-height:1.6;font-weight:400;
  }

  /* ─── Layout grid ─── */
  .pp-grid {
    display:grid;grid-template-columns:300px 1fr;
    gap:20px;align-items:start;
  }
  @media(max-width:820px){ .pp-grid{grid-template-columns:1fr;} }

  /* ─── Card base ─── */
  .pp-card {
    background:rgba(8,14,36,0.8);
    border:1px solid var(--border);
    border-radius:20px;
    backdrop-filter:blur(14px);
    position:relative;overflow:hidden;
    transition:border-color 0.3s;
  }
  .pp-card::before {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(96,165,250,0.35),transparent);
    opacity:0;transition:opacity 0.3s;
  }
  .pp-card:hover::before{opacity:1;}

  /* ─── Avatar card ─── */
  .pp-avatar-card { padding:28px;text-align:center; }
  .pp-avatar-wrap {
    position:relative;display:inline-block;margin-bottom:16px;
  }
  .pp-avatar {
    width:88px;height:88px;border-radius:50%;
    background:linear-gradient(135deg,#1d4ed8,#3b82f6,#818cf8);
    display:flex;align-items:center;justify-content:center;
    font-family:'Clash Display',sans-serif;font-size:34px;font-weight:700;color:#fff;
    animation:avatar-ring 3s ease-in-out infinite;
    position:relative;z-index:1;
  }
  .pp-avatar-ring {
    position:absolute;inset:-6px;border-radius:50%;
    border:2px dashed rgba(96,165,250,0.25);
    animation:spin-slow 15s linear infinite;
  }
  .pp-avatar-edit {
    position:absolute;bottom:2px;right:2px;
    width:26px;height:26px;border-radius:50%;
    background:linear-gradient(135deg,#1d4ed8,#3b82f6);
    display:flex;align-items:center;justify-content:center;
    border:2px solid var(--bg);cursor:pointer;z-index:2;
    transition:transform 0.2s;
  }
  .pp-avatar-edit:hover{transform:scale(1.1);}

  .pp-user-name {
    font-family:'Clash Display',sans-serif;font-size:20px;font-weight:700;
    color:rgba(255,255,255,0.9);letter-spacing:-0.01em;margin-bottom:4px;
  }
  .pp-user-email {
    font-size:12px;color:rgba(255,255,255,0.28);font-weight:500;margin-bottom:12px;
  }
  .pp-role-badge {
    display:inline-flex;align-items:center;gap:5px;
    padding:5px 14px;border-radius:100px;
    font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
  }

  /* ─── Profile stats ─── */
  .pp-stats {
    display:grid;grid-template-columns:1fr 1fr;
    gap:10px;margin-top:20px;
    padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);
  }
  .pp-stat-box {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.06);
    border-radius:12px;padding:12px;text-align:center;
    transition:border-color 0.2s;
  }
  .pp-stat-box:hover{border-color:rgba(59,111,255,0.25);}
  .pp-stat-val {
    font-family:'Clash Display',sans-serif;font-size:22px;font-weight:700;
    background:linear-gradient(135deg,#60a5fa,#a78bfa);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    line-height:1;
  }
  .pp-stat-lbl {
    font-size:10px;font-weight:700;letter-spacing:0.07em;
    color:rgba(255,255,255,0.25);text-transform:uppercase;margin-top:4px;
  }

  /* ─── Quick links ─── */
  .pp-quick-link {
    display:flex;align-items:center;gap:10px;
    padding:10px 14px;border-radius:11px;
    text-decoration:none;font-size:13px;font-weight:600;
    color:rgba(255,255,255,0.45);
    border:1px solid transparent;
    transition:all 0.2s;margin-top:6px;
  }
  .pp-quick-link:hover{
    color:rgba(255,255,255,0.8);
    background:rgba(59,111,255,0.08);
    border-color:rgba(59,111,255,0.18);
    transform:translateX(3px);
  }

  /* ─── Form card ─── */
  .pp-form-card { padding:0; }
  .pp-section {
    padding:24px 28px;
    border-bottom:1px solid rgba(255,255,255,0.05);
  }
  .pp-section:last-child{border-bottom:none;}
  .pp-section-title {
    font-family:'Clash Display',sans-serif;
    font-size:16px;font-weight:600;color:rgba(255,255,255,0.85);
    letter-spacing:-0.01em;margin-bottom:18px;
    display:flex;align-items:center;gap:9px;
  }
  .pp-section-icon {
    width:32px;height:32px;border-radius:9px;
    display:flex;align-items:center;justify-content:center;flex-shrink:0;
  }

  /* ─── Input styles ─── */
  .pp-label {
    display:block;font-size:11px;font-weight:700;
    letter-spacing:0.06em;color:rgba(255,255,255,0.32);
    text-transform:uppercase;margin-bottom:8px;
  }
  .pp-input {
    width:100%;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09);
    border-radius:12px;padding:13px 16px;
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:14px;font-weight:500;color:rgba(255,255,255,0.82);
    outline:none;transition:all 0.2s;box-sizing:border-box;
  }
  .pp-input::placeholder{color:rgba(255,255,255,0.2);}
  .pp-input:focus{
    border-color:rgba(59,111,255,0.5);
    box-shadow:0 0 0 3px rgba(59,111,255,0.12);
    background:rgba(59,111,255,0.06);
  }
  .pp-input-wrap{position:relative;}
  .pp-input-icon{
    position:absolute;top:50%;transform:translateY(-50%);left:14px;
    color:rgba(255,255,255,0.2);pointer-events:none;
  }
  .pp-input.has-icon{padding-left:40px;}

  /* ─── Style / difficulty selector ─── */
  .pp-option-grid {
    display:grid;gap:10px;
  }
  .pp-option-btn {
    display:flex;align-items:center;gap:12px;
    padding:14px 16px;border-radius:13px;cursor:pointer;
    border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03);
    transition:all 0.22s;text-align:left;
  }
  .pp-option-btn:hover{
    background:rgba(59,111,255,0.08);
    border-color:rgba(59,111,255,0.22);
  }
  .pp-option-btn.selected{
    background:rgba(59,111,255,0.12);
    border-color:rgba(96,165,250,0.4);
  }
  .pp-option-icon{
    width:36px;height:36px;border-radius:10px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;
  }
  .pp-option-label{
    font-family:'Clash Display',sans-serif;
    font-size:14px;font-weight:600;color:rgba(255,255,255,0.75);
    text-transform:capitalize;line-height:1.2;
    transition:color 0.2s;
  }
  .pp-option-desc{
    font-size:11px;color:rgba(255,255,255,0.28);margin-top:2px;font-weight:400;
  }
  .pp-option-btn.selected .pp-option-label{color:rgba(255,255,255,0.92);}
  .pp-option-check{
    margin-left:auto;flex-shrink:0;
    opacity:0;transition:opacity 0.2s;
  }
  .pp-option-btn.selected .pp-option-check{opacity:1;}

  /* Difficulty pills (compact) */
  .pp-diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
  .pp-diff-btn{
    padding:12px 8px;border-radius:12px;cursor:pointer;
    border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03);
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:12px;font-weight:700;text-align:center;
    text-transform:capitalize;letter-spacing:0.03em;
    transition:all 0.22s;
  }

  /* ─── Weak topics ─── */
  .pp-topic-chip {
    display:inline-flex;align-items:center;gap:5px;
    padding:5px 12px;border-radius:100px;
    font-size:12px;font-weight:600;margin:0 5px 6px 0;
    animation:chip-in 0.3s ease both;
    transition:transform 0.2s;
  }
  .pp-topic-chip:hover{transform:translateY(-1px);}

  /* ─── Save button ─── */
  .pp-save-btn {
    width:100%;padding:15px;border-radius:14px;
    font-family:'Cabinet Grotesk',sans-serif;font-size:15px;font-weight:700;
    color:#fff;cursor:pointer;border:none;
    background:linear-gradient(135deg,#1d4ed8,#3b82f6,#818cf8);
    box-shadow:0 0 32px rgba(59,130,246,0.4);
    transition:all 0.25s;letter-spacing:0.01em;
    display:flex;align-items:center;justify-content:center;gap:9px;
    position:relative;overflow:hidden;
    animation:pulse-glow 3.5s ease-in-out infinite;
  }
  .pp-save-btn::after{
    content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
    transform:skewX(-20deg);transition:left 0.5s;
  }
  .pp-save-btn:hover{transform:translateY(-2px);box-shadow:0 0 48px rgba(59,130,246,0.55);}
  .pp-save-btn:hover::after{left:150%;}
  .pp-save-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;animation:none;}
  .pp-save-btn.saved{background:linear-gradient(135deg,#059669,#34d399);animation:save-success 0.4s ease;}

  /* ─── Skeleton ─── */
  .pp-skeleton{
    background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
    background-size:400% 100%;animation:shimmer 1.6s ease-in-out infinite;border-radius:10px;
  }

  @media(max-width:480px){
    .pp-diff-grid{grid-template-columns:1fr;}
    .pp-stats{grid-template-columns:1fr 1fr;}
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

const STYLES_META = [
  { key: 'visual',      icon: <Eye size={17} />,       color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  border: 'rgba(96,165,250,0.3)',  desc: 'Learn best through diagrams & visuals' },
  { key: 'reading',     icon: <BookOpen size={17} />,  color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)', desc: 'Prefer reading text and taking notes' },
  { key: 'kinesthetic', icon: <Hand size={17} />,      color: '#34d399', bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.3)',  desc: 'Learn by doing and hands-on practice' },
  { key: 'mixed',       icon: <Shuffle size={17} />,   color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.3)',  desc: 'Combination of all learning styles' },
];

const DIFF_META = {
  beginner:     { color: '#34d399', bg: 'rgba(52,211,153,0.14)',  border: 'rgba(52,211,153,0.35)',  label: '🟢 Beginner' },
  intermediate: { color: '#fbbf24', bg: 'rgba(251,191,36,0.14)', border: 'rgba(251,191,36,0.35)',  label: '🟡 Intermediate' },
  advanced:     { color: '#f87171', bg: 'rgba(248,113,113,0.14)', border: 'rgba(248,113,113,0.35)', label: '🔴 Advanced' },
};

const ROLE_META = {
  student:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',  icon: <GraduationCap size={12} /> },
  instructor: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', icon: <Award size={12} /> },
  admin:      { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  icon: <Shield size={12} /> },
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    learningStyle: user?.learningStyle || 'mixed',
    preferredDifficulty: user?.preferredDifficulty || 'beginner',
  });
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: () => updateProfile(form),
    onSuccess: ({ user: updated }) => {
      updateUser(updated);
      toast.success('Profile updated!');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: () => toast.error('Update failed'),
  });

  const role      = user?.role || 'student';
  const roleMeta  = ROLE_META[role] || ROLE_META.student;
  const initials  = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const enrolledCount = user?.enrolledCourses?.length || 0;
  const weakCount     = user?.weakTopics?.length || 0;

  return (
    <div className="pp-page">
      <InjectCSS />
      <div className="pp-grid-bg" />
      <div className="pp-orb1" />
      <div className="pp-orb2" />

      <div className="pp-inner">

        {/* Breadcrumb */}
        <div className="pp-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={12} />
          <Link to="/dashboard">Dashboard</Link>
          <ChevronRight size={12} />
          <span>Profile</span>
        </div>

        {/* Header */}
        <div className="pp-header">
          <div className="pp-header-badge"><Sparkles size={10} /> My Profile</div>
          <div className="pp-title">Account Settings</div>
          <div className="pp-sub">Manage your learning preferences and personal information.</div>
        </div>

        <div className="pp-grid">

          {/* ── LEFT: Avatar card ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div className="pp-card pp-avatar-card" style={{ animation: 'card-in 0.5s ease 0.1s both' }}>
              {/* Avatar */}
              <div className="pp-avatar-wrap">
                <div className="pp-avatar">{initials}</div>
                <div className="pp-avatar-ring" />
                <div className="pp-avatar-edit">
                  <Edit3 size={11} color="white" />
                </div>
              </div>

              <div className="pp-user-name">{user?.name || 'Your Name'}</div>
              <div className="pp-user-email">{user?.email}</div>

              {/* Role badge */}
              <span className="pp-role-badge" style={{ background: roleMeta.bg, color: roleMeta.color, border: `1px solid ${roleMeta.border}` }}>
                {roleMeta.icon} {role}
              </span>

              {/* Stats */}
              <div className="pp-stats">
                {[
                  { val: enrolledCount, lbl: 'Enrolled' },
                  { val: weakCount,     lbl: 'Weak Topics' },
                  { val: user?.completedCourses?.length || 0, lbl: 'Completed' },
                  { val: user?.avgScore ? `${user.avgScore}%` : '—', lbl: 'Avg Score' },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="pp-stat-box">
                    <div className="pp-stat-val">{val}</div>
                    <div className="pp-stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="pp-card" style={{ padding: '16px', animation: 'card-in 0.5s ease 0.2s both' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
                Quick Links
              </div>
              {[
                { to: '/dashboard', icon: <BarChart2 size={14} color="#60a5fa" />, label: 'Dashboard', sub: 'View your progress' },
                { to: '/courses',   icon: <BookOpen size={14} color="#a78bfa" />,  label: 'Courses', sub: 'Browse all courses' },
                ...(role === 'instructor' ? [{ to: '/instructor', icon: <GraduationCap size={14} color="#fbbf24" />, label: 'Instructor Studio', sub: 'Manage your courses' }] : []),
              ].map(({ to, icon, label, sub }) => (
                <Link key={label} to={to} className="pp-quick-link">
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>{sub}</div>
                  </div>
                  <ChevronRight size={13} style={{ opacity: 0.25, flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="pp-card pp-form-card" style={{ animation: 'card-in 0.5s ease 0.15s both' }}>

            {/* Section 1 — Personal Info */}
            <div className="pp-section">
              <div className="pp-section-title">
                <div className="pp-section-icon" style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <User size={15} color="#60a5fa" />
                </div>
                Personal Information
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Name */}
                <div>
                  <label className="pp-label">Display Name</label>
                  <div className="pp-input-wrap">
                    <User size={14} className="pp-input-icon" />
                    <input
                      type="text"
                      className="pp-input has-icon"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="pp-label">Email Address <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(read-only)</span></label>
                  <div className="pp-input-wrap">
                    <Mail size={14} className="pp-input-icon" />
                    <input
                      type="email"
                      className="pp-input has-icon"
                      value={user?.email || ''}
                      readOnly
                      style={{ opacity: 0.45, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                {/* Role (read-only) */}
                <div>
                  <label className="pp-label">Account Role</label>
                  <div style={{
                    padding: '11px 16px', borderRadius: 12,
                    background: roleMeta.bg, border: `1px solid ${roleMeta.border}`,
                    display: 'flex', alignItems: 'center', gap: 9,
                    fontSize: 13, fontWeight: 700, color: roleMeta.color,
                    textTransform: 'capitalize',
                  }}>
                    {roleMeta.icon} {role}
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 500, fontFamily: "'Cabinet Grotesk',sans-serif" }}>cannot be changed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 — Learning Style */}
            <div className="pp-section">
              <div className="pp-section-title">
                <div className="pp-section-icon" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <Brain size={15} color="#a78bfa" />
                </div>
                Learning Style
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginBottom: 16, lineHeight: 1.6 }}>
                Your AI tutor adapts explanations to match how you learn best.
              </p>

              <div className="pp-option-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {STYLES_META.map(({ key, icon, color, bg, border, desc }) => {
                  const isSelected = form.learningStyle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`pp-option-btn ${isSelected ? 'selected' : ''}`}
                      style={isSelected ? { borderColor: border, background: bg } : {}}
                      onClick={() => setForm({ ...form, learningStyle: key })}
                    >
                      <div className="pp-option-icon"
                        style={{ background: isSelected ? bg : 'rgba(255,255,255,0.04)', border: `1px solid ${isSelected ? border : 'rgba(255,255,255,0.08)'}` }}>
                        <span style={{ color: isSelected ? color : 'rgba(255,255,255,0.3)' }}>{icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="pp-option-label" style={{ color: isSelected ? color : undefined }}>{key}</div>
                        <div className="pp-option-desc">{desc}</div>
                      </div>
                      <CheckCircle size={15} className="pp-option-check" color={color} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3 — Difficulty */}
            <div className="pp-section">
              <div className="pp-section-title">
                <div className="pp-section-icon" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <Target size={15} color="#fbbf24" />
                </div>
                Preferred Difficulty
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginBottom: 16, lineHeight: 1.6 }}>
                Set your default challenge level for courses and AI-generated quizzes.
              </p>

              <div className="pp-diff-grid">
                {Object.entries(DIFF_META).map(([key, meta]) => {
                  const isSelected = form.preferredDifficulty === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className="pp-diff-btn"
                      style={{
                        background: isSelected ? meta.bg : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? meta.border : 'rgba(255,255,255,0.08)'}`,
                        color: isSelected ? meta.color : 'rgba(255,255,255,0.4)',
                        boxShadow: isSelected ? `0 0 16px ${meta.bg}` : 'none',
                      }}
                      onClick={() => setForm({ ...form, preferredDifficulty: key })}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>
                        {key === 'beginner' ? '🟢' : key === 'intermediate' ? '🟡' : '🔴'}
                      </div>
                      <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 13, fontWeight: 700 }}>{key}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>
                        {key === 'beginner' ? 'Just starting' : key === 'intermediate' ? 'Some experience' : 'Expert level'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4 — Weak Topics */}
            {user?.weakTopics?.length > 0 && (
              <div className="pp-section">
                <div className="pp-section-title">
                  <div className="pp-section-icon" style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    <AlertCircle size={15} color="#f87171" />
                  </div>
                  AI-Identified Weak Topics
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginBottom: 14, lineHeight: 1.6 }}>
                  These topics were identified by your AI tutor based on quiz performance. Focus on these to level up.
                </p>
                <div>
                  {user.weakTopics.map((t, i) => (
                    <span
                      key={t}
                      className="pp-topic-chip"
                      style={{
                        background: 'rgba(248,113,113,0.12)',
                        border: '1px solid rgba(248,113,113,0.25)',
                        color: '#f87171',
                        animationDelay: `${i * 60}ms`,
                      }}
                    >
                      <AlertCircle size={10} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Section 5 — Save */}
            <div className="pp-section">
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className={`pp-save-btn ${saved ? 'saved' : ''}`}
              >
                {mutation.isPending
                  ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} /> Saving…</>
                  : saved
                  ? <><CheckCircle size={17} /> Saved Successfully!</>
                  : <><Save size={17} /> Save Changes</>
                }
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 10, fontWeight: 500 }}>
                Changes are saved to your account and affect AI recommendations immediately.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}