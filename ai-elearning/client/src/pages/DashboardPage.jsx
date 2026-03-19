import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDashboard, fetchAnalytics } from '../services/courseService.js';
import { useAuthStore } from '../store/authStore.js';
import {
  BookOpen, Trophy, Brain, TrendingUp, MessageSquare,
  ChevronRight, Sparkles, Zap, Target, Star,
  Clock, PlayCircle, BarChart2, GraduationCap, CheckCircle,
  AlertCircle, ArrowUpRight, Calendar, User,
  Shield, Award, Lock, Crown, Users, X
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, AreaChart, Area,
  XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');
  :root { --bg:#02040f; --surface:rgba(8,14,36,0.85); --border:rgba(56,114,255,0.13); --accent:#3b6fff; --accent2:#60a5fa; --accent3:#a78bfa; --green:#34d399; --amber:#fbbf24; --red:#f87171; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:-400% center} 100%{background-position:400% center} }
  @keyframes float-y  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes card-in  { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(59,111,255,0.3)} 50%{box-shadow:0 0 40px rgba(59,111,255,0.55)} }
  @keyframes count-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes grid-pan { from{background-position:0 0} to{background-position:60px 60px} }
  @keyframes streak-glow { 0%,100%{text-shadow:0 0 8px rgba(251,191,36,0.4)} 50%{text-shadow:0 0 20px rgba(251,191,36,0.9)} }
  @keyframes avatar-pulse { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.35)} 50%{box-shadow:0 0 40px rgba(124,58,237,0.65)} }
  @keyframes blink-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .dp-page { min-height:100vh; background:var(--bg); font-family:'Cabinet Grotesk',sans-serif; color:rgba(255,255,255,0.88); }
  .dp-grid-bg { position:fixed;inset:0;pointer-events:none;z-index:0; background-image:linear-gradient(rgba(37,99,235,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.025) 1px,transparent 1px); background-size:60px 60px; animation:grid-pan 12s linear infinite; }
  .dp-orb1 { position:fixed;width:600px;height:600px;border-radius:50%;top:-200px;left:-150px;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(29,78,216,0.1) 0%,transparent 65%); }
  .dp-orb2 { position:fixed;width:400px;height:400px;border-radius:50%;bottom:-100px;right:-100px;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(129,140,248,0.08) 0%,transparent 65%); }
  .dp-inner { max-width:1280px;margin:0 auto;padding:40px 24px 80px;position:relative;z-index:1; }

  .dp-header { display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:36px;animation:fadeUp 0.6s ease both; }
  .dp-greeting-label { font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent3);margin-bottom:6px;display:flex;align-items:center;gap:6px; }
  .dp-greeting-title { font-family:'Clash Display',sans-serif;font-size:clamp(28px,4vw,42px);font-weight:700;letter-spacing:-0.03em;line-height:1.05;background:linear-gradient(150deg,#fff 0%,#93c5fd 55%,#a78bfa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .dp-greeting-sub { font-size:14px;color:rgba(255,255,255,0.33);margin-top:6px;font-weight:400; }
  .dp-date-chip { display:flex;align-items:center;gap:7px;padding:8px 16px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);font-size:12px;font-weight:600;color:rgba(255,255,255,0.35); }

  .dp-stats { display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-bottom:28px; }
  .dp-stat-card { background:rgba(8,14,36,0.8);border:1px solid var(--border);border-radius:18px;padding:22px 22px 20px;position:relative;overflow:hidden;backdrop-filter:blur(12px);transition:transform 0.25s,border-color 0.25s;cursor:default; }
  .dp-stat-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(96,165,250,0.45),transparent);opacity:0;transition:opacity 0.25s; }
  .dp-stat-card:hover{transform:translateY(-4px);border-color:rgba(59,111,255,0.28);}
  .dp-stat-card:hover::before{opacity:1;}
  .dp-stat-icon { width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;flex-shrink:0; }
  .dp-stat-val { font-family:'Clash Display',sans-serif;font-size:32px;font-weight:700;letter-spacing:-0.03em;line-height:1;animation:count-up 0.6s ease both; }
  .dp-stat-lbl { font-size:12px;color:rgba(255,255,255,0.3);margin-top:5px;font-weight:600;letter-spacing:0.01em; }
  .dp-stat-trend { position:absolute;top:18px;right:18px;display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px; }

  .dp-main { display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start; }
  @media(max-width:960px){ .dp-main{grid-template-columns:1fr;} }

  .dp-card { background:rgba(8,14,36,0.8);border:1px solid var(--border);border-radius:20px;padding:26px;position:relative;overflow:hidden;backdrop-filter:blur(12px);transition:border-color 0.3s; }
  .dp-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(96,165,250,0.35),transparent);opacity:0;transition:opacity 0.3s; }
  .dp-card:hover::before{opacity:1;}
  .dp-card-title { font-family:'Clash Display',sans-serif;font-size:18px;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:-0.01em;display:flex;align-items:center;gap:9px;margin-bottom:20px; }
  .dp-card-title-icon { width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }

  .dp-course-row { display:flex;align-items:center;gap:14px;padding:12px;border-radius:13px;transition:background 0.2s,border 0.2s;border:1px solid transparent;cursor:pointer; }
  .dp-course-row:hover { background:rgba(59,111,255,0.07);border-color:rgba(59,111,255,0.14); }
  .dp-course-thumb { width:48px;height:48px;border-radius:11px;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,rgba(29,78,216,0.3),rgba(129,140,248,0.2));display:flex;align-items:center;justify-content:center; }
  .dp-course-thumb img{width:100%;height:100%;object-fit:cover;}
  .dp-course-name { font-size:13.5px;font-weight:600;color:rgba(255,255,255,0.8);line-height:1.3;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:6px; }
  .dp-progress-bar { height:5px;border-radius:100px;background:rgba(255,255,255,0.07);overflow:hidden;position:relative; }
  .dp-progress-fill { height:100%;border-radius:100px;transition:width 1s cubic-bezier(0.4,0,0.2,1);position:relative; }
  .dp-progress-fill::after { content:'';position:absolute;right:0;top:0;bottom:0;width:6px;background:rgba(255,255,255,0.6);border-radius:100px;filter:blur(2px); }
  .dp-continue-btn { display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:var(--accent2);white-space:nowrap;text-decoration:none;padding:5px 10px;border-radius:7px;background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.18);transition:all 0.2s;flex-shrink:0; }
  .dp-continue-btn:hover{background:rgba(96,165,250,0.16);border-color:rgba(96,165,250,0.35);}

  .dp-empty { display:flex;flex-direction:column;align-items:center;padding:48px 24px;gap:12px;text-align:center;animation:fadeUp 0.5s ease both; }
  .dp-empty-icon { width:64px;height:64px;border-radius:18px;background:rgba(59,111,255,0.08);border:1px solid rgba(59,111,255,0.15);display:flex;align-items:center;justify-content:center;animation:float-y 4s ease-in-out infinite;margin-bottom:4px; }

  .dp-insight-section { margin-bottom:22px; }
  .dp-insight-lbl { font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:10px; }
  .dp-topic-chip { display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:100px;font-size:12px;font-weight:600;margin:0 5px 6px 0;transition:transform 0.2s;cursor:default; }
  .dp-topic-chip:hover{transform:translateY(-1px);}
  .dp-topic-weak { background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.25);color:#f87171; }
  .dp-topic-strong { background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.25);color:#34d399; }
  .dp-tutor-btn { width:100%;padding:13px;border-radius:13px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Cabinet Grotesk',sans-serif;font-size:14px;font-weight:700;color:#fff;cursor:pointer;border:none;text-decoration:none;background:linear-gradient(135deg,#1d4ed8,#3b82f6,#818cf8);box-shadow:0 0 28px rgba(59,130,246,0.35);transition:all 0.25s;margin-top:4px;animation:pulse-glow 3.5s ease-in-out infinite;position:relative;overflow:hidden; }
  .dp-tutor-btn::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transform:skewX(-20deg);transition:left 0.5s; }
  .dp-tutor-btn:hover{transform:translateY(-2px);}
  .dp-tutor-btn:hover::after{left:150%;}

  .dp-streak-card { display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:14px;background:linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.05));border:1px solid rgba(251,191,36,0.2);margin-bottom:16px; }
  .dp-streak-num { font-family:'Clash Display',sans-serif;font-size:28px;font-weight:700;color:#fbbf24;animation:streak-glow 2s ease-in-out infinite; }
  .dp-radar-wrap { height:200px;margin-top:8px; }
  .dp-activity-wrap { height:130px;margin-top:4px; }
  .dp-skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);background-size:400% 100%;animation:shimmer 1.6s ease-in-out infinite;border-radius:10px; }

  .dp-quick-link { display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:11px;text-decoration:none;font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);transition:all 0.2s; }
  .dp-quick-link:hover{ color:rgba(255,255,255,0.85);background:rgba(59,111,255,0.08);border-color:rgba(59,111,255,0.2);transform:translateX(3px); }

  .dp-trainer-card { background:linear-gradient(135deg,rgba(167,139,250,0.12),rgba(96,165,250,0.08));border:1px solid rgba(167,139,250,0.25);border-radius:20px;padding:24px;position:relative;overflow:hidden;backdrop-filter:blur(12px); }
  .dp-trainer-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(167,139,250,0.7),rgba(96,165,250,0.5),transparent); }
  .dp-trainer-avatar { width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#3b82f6);display:flex;align-items:center;justify-content:center;flex-shrink:0;animation:avatar-pulse 3s ease-in-out infinite; }
  .dp-trainer-online { width:12px;height:12px;border-radius:50%;background:#34d399;border:2px solid var(--bg);position:absolute;bottom:2px;right:2px;animation:blink-dot 2s ease-in-out infinite; }
  .dp-trainer-name { font-family:'Clash Display',sans-serif;font-size:17px;font-weight:700;color:rgba(255,255,255,0.9);letter-spacing:-0.01em; }
  .dp-trainer-role { font-size:11px;color:rgba(255,255,255,0.35);font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-top:2px; }
  .dp-trainer-stats { display:flex;gap:16px;margin:14px 0;flex-wrap:wrap; }
  .dp-trainer-stat { font-size:12px;color:rgba(255,255,255,0.4);font-weight:600;display:flex;align-items:center;gap:5px; }
  .dp-trainer-btn { width:100%;padding:12px;border-radius:12px;font-family:'Cabinet Grotesk',sans-serif;font-size:13px;font-weight:700;color:#fff;cursor:pointer;border:none;background:linear-gradient(135deg,#7c3aed,#3b82f6);box-shadow:0 0 24px rgba(124,58,237,0.3);transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:7px;letter-spacing:0.01em; }
  .dp-trainer-btn:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(124,58,237,0.5);}

  .dp-modal-overlay { position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn 0.2s ease both; }
  .dp-modal { background:rgba(8,14,36,0.98);border:1px solid rgba(59,111,255,0.25);border-radius:24px;width:100%;max-width:760px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 32px 80px rgba(0,0,0,0.6);animation:card-in 0.3s ease both; }
  .dp-modal-header { padding:28px 28px 20px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:sticky;top:0;background:rgba(8,14,36,0.98);z-index:1; }
  .dp-modal-close { width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 0.2s;color:rgba(255,255,255,0.5); }
  .dp-modal-close:hover{background:rgba(248,113,113,0.15);border-color:rgba(248,113,113,0.3);color:#f87171;}
  .dp-modal-body { padding:24px 28px 28px; }
  .dp-plans-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px; }
  .dp-plan-card { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px;position:relative;overflow:hidden;transition:all 0.25s;cursor:pointer;display:flex;flex-direction:column; }
  .dp-plan-card:hover{border-color:rgba(59,111,255,0.3);background:rgba(59,111,255,0.06);transform:translateY(-3px);}
  .dp-plan-card.popular{border-color:rgba(96,165,250,0.4);background:rgba(59,111,255,0.1);box-shadow:0 0 32px rgba(59,111,255,0.15);}
  .dp-plan-popular-tag { position:absolute;top:0;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1d4ed8,#818cf8);color:#fff;font-size:9px;font-weight:800;letter-spacing:0.09em;padding:3px 14px;border-radius:0 0 8px 8px;text-transform:uppercase; }
  .dp-plan-name { font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;margin-top:8px; }
  .dp-plan-price { font-family:'Clash Display',sans-serif;font-weight:700;letter-spacing:-0.03em;line-height:1;margin-bottom:4px; }
  .dp-plan-period { font-size:11px;color:rgba(255,255,255,0.28);margin-bottom:16px; }
  .dp-plan-feature { display:flex;align-items:flex-start;gap:7px;font-size:12px;color:rgba(255,255,255,0.5);padding:4px 0;font-weight:500; }
  .dp-plan-btn { width:100%;padding:11px;border-radius:10px;font-family:'Cabinet Grotesk',sans-serif;font-size:13px;font-weight:700;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.2s;letter-spacing:0.01em;margin-top:16px; }
  .dp-plan-btn:hover{transform:translateY(-1px);}

  .dp-instructor-cta { background:linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.06));border:1px solid rgba(251,191,36,0.22);border-radius:16px;padding:20px;position:relative;overflow:hidden; }
  .dp-instructor-cta::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.6),transparent); }
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

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function getDateString() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function AnimNum({ value }) {
  const [display, setDisplay] = useState(0);
  const isPercent = typeof value === 'string' && value.includes('%');
  const raw = isPercent ? parseInt(value) : (typeof value === 'number' ? value : parseInt(value) || 0);
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.ceil(raw / 30));
    const iv = setInterval(() => {
      cur = Math.min(cur + step, raw);
      setDisplay(cur);
      if (cur >= raw) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [raw]);
  return <span>{isPercent ? `${display}%` : display}</span>;
}

function ProgressBar({ pct, color = 'linear-gradient(90deg,#3b6fff,#60a5fa)' }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="dp-progress-bar">
      <div className="dp-progress-fill" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}

const ACTIVITY = [
  { day: 'Mon', mins: 45 }, { day: 'Tue', mins: 30 }, { day: 'Wed', mins: 70 },
  { day: 'Thu', mins: 20 }, { day: 'Fri', mins: 90 }, { day: 'Sat', mins: 55 }, { day: 'Sun', mins: 40 },
];

const PLANS = [
  {
    name: 'Starter', price: 'Free', period: 'forever · no card needed',
    color: '#60a5fa', popular: false, btnStyle: 'ghost',
    features: [
      { on: true,  text: '5 courses access' },
      { on: true,  text: 'AI tutor (10 msgs/day)' },
      { on: true,  text: 'Basic quizzes' },
      { on: false, text: 'Personal AI trainer' },
      { on: false, text: 'Certificates' },
      { on: false, text: 'Analytics dashboard' },
    ],
  },
  {
    name: 'Pro', price: '$19', period: 'per month · cancel anytime',
    color: '#a78bfa', popular: true, btnStyle: 'primary',
    features: [
      { on: true, text: 'All 200+ courses' },
      { on: true, text: 'Unlimited AI tutor' },
      { on: true, text: 'Personal AI trainer' },
      { on: true, text: 'Full analytics dashboard' },
      { on: true, text: 'Verified certificates' },
      { on: true, text: 'Priority support' },
    ],
  },
  {
    name: 'Lifetime', price: '$299', period: 'one-time · forever access',
    color: '#fbbf24', popular: false, btnStyle: 'gold',
    features: [
      { on: true, text: 'Everything in Pro' },
      { on: true, text: 'Lifetime access' },
      { on: true, text: '1-on-1 mentoring session' },
      { on: true, text: 'Early course access' },
      { on: true, text: 'Private Discord group' },
      { on: true, text: 'Future updates free' },
    ],
  },
];

const gradients = [
  'linear-gradient(90deg,#3b6fff,#60a5fa)',
  'linear-gradient(90deg,#7c3aed,#a78bfa)',
  'linear-gradient(90deg,#059669,#34d399)',
  'linear-gradient(90deg,#d97706,#fbbf24)',
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: dash } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard });
  const { data: analytics } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
  const [showPricing, setShowPricing] = useState(false);

  const enrolledCourses = dash?.user?.enrolledCourses || [];
  const weakTopics      = analytics?.weakTopics   || [];
  const strongTopics    = analytics?.strongTopics || [];
  const avgScore        = analytics?.avgScore     || 0;
  const totalLessons    = analytics?.totalLessons || 0;

  const radarData = [
    ...weakTopics.slice(0, 3).map(t => ({ topic: t.length > 10 ? t.slice(0, 10) + '…' : t, val: 30 })),
    ...strongTopics.slice(0, 3).map(t => ({ topic: t.length > 10 ? t.slice(0, 10) + '…' : t, val: 80 })),
  ];

  const STATS = [
    { label: 'Courses Enrolled',  value: enrolledCourses.length, icon: <BookOpen size={18} color="#60a5fa" />,   iconBg: 'rgba(96,165,250,0.15)',  iconBorder: 'rgba(96,165,250,0.25)',  valColor: '#60a5fa', trend: '+2 this week', trendColor: 'rgba(52,211,153,0.15)',  trendTxt: '#34d399' },
    { label: 'Avg Quiz Score',    value: `${avgScore}%`,          icon: <Trophy size={18} color="#fbbf24" />,     iconBg: 'rgba(251,191,36,0.15)', iconBorder: 'rgba(251,191,36,0.25)', valColor: '#fbbf24', trend: '↑ Great!',     trendColor: 'rgba(251,191,36,0.12)',  trendTxt: '#fbbf24' },
    { label: 'Lessons Completed', value: totalLessons,            icon: <TrendingUp size={18} color="#34d399" />, iconBg: 'rgba(52,211,153,0.15)', iconBorder: 'rgba(52,211,153,0.25)', valColor: '#34d399', trend: '+5 today',     trendColor: 'rgba(52,211,153,0.12)',  trendTxt: '#34d399' },
    { label: 'Topics to Review',  value: weakTopics.length,       icon: <Brain size={18} color="#f87171" />,      iconBg: 'rgba(248,113,113,0.15)',iconBorder: 'rgba(248,113,113,0.25)',valColor: '#f87171', trend: 'Need focus',  trendColor: 'rgba(248,113,113,0.12)', trendTxt: '#f87171' },
  ];

  return (
    <div className="dp-page">
      <InjectCSS />
      <div className="dp-grid-bg" />
      <div className="dp-orb1" />
      <div className="dp-orb2" />

      <div className="dp-inner">

        {/* HEADER */}
        <div className="dp-header">
          <div>
            <div className="dp-greeting-label"><Sparkles size={11} /> Your Learning Dashboard</div>
            <div className="dp-greeting-title">
              Good {getTimeOfDay()},{' '}
              <span style={{ background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {user?.name?.split(' ')[0] || 'Learner'} 👋
              </span>
            </div>
            <div className="dp-greeting-sub">Here's your learning snapshot — keep the momentum going!</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-end' }}>
            <div className="dp-date-chip"><Calendar size={13} /> {getDateString()}</div>
            <Link to="/courses" style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'10px', fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:'13px', fontWeight:700, color:'#fff', textDecoration:'none', background:'linear-gradient(135deg,#1d4ed8,#3b82f6)', boxShadow:'0 0 20px rgba(59,130,246,0.35)' }}>
              <Zap size={13} /> Explore Courses
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="dp-stats">
          {STATS.map(({ label, value, icon, iconBg, iconBorder, valColor, trend, trendColor, trendTxt }, i) => (
            <div key={label} className="dp-stat-card" style={{ animation:`card-in 0.45s ease ${i * 70}ms both` }}>
              <div className="dp-stat-icon" style={{ background:iconBg, border:`1px solid ${iconBorder}` }}>{icon}</div>
              <div className="dp-stat-val" style={{ color:valColor }}><AnimNum value={value} /></div>
              <div className="dp-stat-lbl">{label}</div>
              <div className="dp-stat-trend" style={{ background:trendColor, color:trendTxt }}>{trend}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="dp-main">

          {/* LEFT COL */}
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            {/* My Courses */}
            <div className="dp-card" style={{ animation:'card-in 0.5s ease 0.3s both' }}>
              <div className="dp-card-title">
                <div className="dp-card-title-icon" style={{ background:'rgba(96,165,250,0.15)', border:'1px solid rgba(96,165,250,0.2)' }}><BookOpen size={16} color="#60a5fa" /></div>
                My Courses
                <span style={{ marginLeft:'auto', fontSize:'12px', color:'rgba(255,255,255,0.25)', fontWeight:500 }}>{enrolledCourses.length} enrolled</span>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="dp-empty">
                  <div className="dp-empty-icon"><BookOpen size={28} color="rgba(96,165,250,0.4)" /></div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'18px', fontWeight:600, color:'rgba(255,255,255,0.4)' }}>No courses yet</div>
                  <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.2)', maxWidth:'280px', lineHeight:1.6 }}>Start your learning journey — discover AI-powered courses built for you.</p>
                  <Link to="/courses" style={{ marginTop:'4px', padding:'10px 24px', borderRadius:'10px', fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:'13px', fontWeight:700, color:'var(--accent2)', background:'rgba(59,111,255,0.1)', border:'1px solid rgba(59,111,255,0.25)', textDecoration:'none' }}>Browse Courses →</Link>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  {enrolledCourses.map((enrollment, idx) => {
                    const course = enrollment.courseId;
                    if (!course) return null;
                    const pct = enrollment.progress || 0;
                    return (
                      <div key={enrollment._id} className="dp-course-row" style={{ animation:`card-in 0.4s ease ${idx*60}ms both` }}>
                        <div className="dp-course-thumb">
                          {course.thumbnail ? <img src={course.thumbnail} alt={course.title} /> : <GraduationCap size={20} color="rgba(255,255,255,0.2)" />}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="dp-course-name">{course.title}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <ProgressBar pct={pct} color={gradients[idx % gradients.length]} />
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', fontWeight:700, flexShrink:0 }}>{pct}%</span>
                          </div>
                        </div>
                        <Link to={`/learn/${course._id}`} className="dp-continue-btn"><PlayCircle size={12} /> Resume</Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Weekly Activity */}
            <div className="dp-card" style={{ animation:'card-in 0.5s ease 0.4s both' }}>
              <div className="dp-card-title">
                <div className="dp-card-title-icon" style={{ background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.2)' }}><BarChart2 size={16} color="#34d399" /></div>
                Weekly Activity
                <span style={{ marginLeft:'auto', fontSize:'12px', color:'rgba(255,255,255,0.25)', fontWeight:500 }}>minutes learned</span>
              </div>
              <div className="dp-activity-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY} margin={{ top:4, right:4, bottom:0, left:-24 }}>
                    <defs>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.25)', fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:'rgba(255,255,255,0.2)', fontSize:10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:'rgba(8,14,36,0.95)', border:'1px solid rgba(59,111,255,0.2)', borderRadius:'10px', fontSize:'12px', color:'rgba(255,255,255,0.8)' }} formatter={(v) => [`${v} min`, 'Time']} />
                    <Area type="monotone" dataKey="mins" stroke="#3b82f6" strokeWidth={2} fill="url(#actGrad)" dot={{ fill:'#3b82f6', r:3, strokeWidth:0 }} activeDot={{ r:5, fill:'#60a5fa' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dp-card" style={{ animation:'card-in 0.5s ease 0.5s both' }}>
              <div className="dp-card-title">
                <div className="dp-card-title-icon" style={{ background:'rgba(167,139,250,0.15)', border:'1px solid rgba(167,139,250,0.2)' }}><Zap size={16} color="#a78bfa" /></div>
                Quick Actions
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {[
                  { to:'/courses', icon:<BookOpen size={15} color="#60a5fa" />, label:'Browse new courses',    sub:'200+ available' },
                  { to:'/profile', icon:<Target size={15} color="#34d399" />,   label:'Update learning goals', sub:'Personalize your path' },
                  { to:'/courses', icon:<Trophy size={15} color="#fbbf24" />,   label:'View certificates',     sub:'Your achievements' },
                ].map(({ to, icon, label, sub }) => (
                  <Link key={label} to={to} className="dp-quick-link">
                    <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'rgba(255,255,255,0.65)', lineHeight:1.2 }}>{label}</div>
                      <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'2px' }}>{sub}</div>
                    </div>
                    <ChevronRight size={14} style={{ opacity:0.3, flexShrink:0 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            {/* Streak */}
            <div className="dp-card" style={{ animation:'card-in 0.5s ease 0.35s both', padding:'22px' }}>
              <div className="dp-streak-card">
                <div style={{ fontSize:'32px' }}>🔥</div>
                <div>
                  <div className="dp-streak-num">7 Day</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>Learning Streak</div>
                </div>
                <div style={{ marginLeft:'auto', textAlign:'right' }}>
                  <div style={{ fontSize:'11px', color:'rgba(251,191,36,0.6)', fontWeight:700 }}>Keep it up!</div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.2)', marginTop:'2px' }}>Best: 14 days</div>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>Daily Goal</span>
                  <span style={{ fontSize:'12px', color:'#60a5fa', fontWeight:700 }}>45 / 60 min</span>
                </div>
                <ProgressBar pct={75} color="linear-gradient(90deg,#fbbf24,#f59e0b)" />
              </div>
            </div>

            {/* AI Insights */}
            <div className="dp-card" style={{ animation:'card-in 0.5s ease 0.45s both' }}>
              <div className="dp-card-title">
                <div className="dp-card-title-icon" style={{ background:'rgba(167,139,250,0.15)', border:'1px solid rgba(167,139,250,0.2)' }}><Brain size={16} color="#a78bfa" /></div>
                AI Insights
              </div>
              {weakTopics.length > 0 ? (
                <div className="dp-insight-section">
                  <div className="dp-insight-lbl">Topics to review</div>
                  <div>{weakTopics.map((t, i) => <span key={t} className="dp-topic-chip dp-topic-weak" style={{ animationDelay:`${i*60}ms` }}><AlertCircle size={10} /> {t}</span>)}</div>
                </div>
              ) : (
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.25)', marginBottom:'16px', lineHeight:1.6 }}>No weak areas yet — take some quizzes to get personalized insights!</p>
              )}
              {strongTopics.length > 0 && (
                <div className="dp-insight-section">
                  <div className="dp-insight-lbl">Strong areas</div>
                  <div>{strongTopics.map((t, i) => <span key={t} className="dp-topic-chip dp-topic-strong" style={{ animationDelay:`${i*60}ms` }}><CheckCircle size={10} /> {t}</span>)}</div>
                </div>
              )}
              {radarData.length > 0 && (
                <div className="dp-radar-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.07)" />
                      <PolarAngleAxis dataKey="topic" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} />
                      <Radar dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.18} strokeWidth={1.5} dot={{ r:3, fill:'#60a5fa' }} />
                      <Tooltip contentStyle={{ background:'rgba(8,14,36,0.95)', border:'1px solid rgba(59,111,255,0.2)', borderRadius:'10px', fontSize:'11px', color:'rgba(255,255,255,0.7)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {enrolledCourses[0]?.courseId && (
                <Link to={`/tutor/${enrolledCourses[0].courseId._id}`} className="dp-tutor-btn">
                  <MessageSquare size={16} /> Ask Your AI Tutor <ArrowUpRight size={14} style={{ marginLeft:'auto' }} />
                </Link>
              )}
            </div>

            {/* Performance */}
            <div className="dp-card" style={{ animation:'card-in 0.5s ease 0.55s both', padding:'22px' }}>
              <div className="dp-card-title" style={{ marginBottom:'16px' }}>
                <div className="dp-card-title-icon" style={{ background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.2)' }}><Star size={16} color="#fbbf24" /></div>
                Performance
              </div>
              {[
                { label:'Quiz Accuracy',      pct: avgScore || 72, color:'linear-gradient(90deg,#fbbf24,#f59e0b)' },
                { label:'Course Completion',  pct: enrolledCourses.length > 0 ? Math.round(enrolledCourses.reduce((a,e) => a+(e.progress||0),0)/enrolledCourses.length) : 0, color:'linear-gradient(90deg,#3b6fff,#60a5fa)' },
                { label:'Consistency',        pct: 75, color:'linear-gradient(90deg,#7c3aed,#a78bfa)' },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{pct}%</span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </div>
              ))}
            </div>

            {/* Personal Trainer */}
            <div className="dp-trainer-card" style={{ animation:'card-in 0.5s ease 0.6s both' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <div style={{ position:'relative' }}>
                  <div className="dp-trainer-avatar"><User size={26} color="white" /></div>
                  <div className="dp-trainer-online" />
                </div>
                <div>
                  <div className="dp-trainer-name">Dr. Aria — AI Coach</div>
                  <div className="dp-trainer-role">Personal Learning Trainer</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.38)', lineHeight:1.65, marginBottom:14 }}>
                Your dedicated AI trainer analyzes your learning patterns, weak spots, and goals — then crafts a custom study plan just for you.
              </p>
              <div className="dp-trainer-stats">
                {[
                  { icon:<Star size={12} color="#fbbf24" />,  text:'4.9 rated' },
                  { icon:<Users size={12} color="#60a5fa" />, text:'12K+ trained' },
                  { icon:<Clock size={12} color="#34d399" />, text:'24/7 available' },
                ].map(({ icon, text }) => (
                  <div key={text} className="dp-trainer-stat">{icon} {text}</div>
                ))}
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:12, color:'rgba(255,255,255,0.38)', lineHeight:1.6 }}>
                💡 <strong style={{ color:'rgba(255,255,255,0.6)' }}>Today's tip:</strong> You're 78% through React fundamentals. Focus on useEffect next — it's in your weak areas.
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setShowPricing(true)} className="dp-trainer-btn" style={{ flex:1 }}>
                  <Crown size={14} /> Get Personal Trainer
                </button>
                {enrolledCourses[0]?.courseId && (
                  <Link to={`/tutor/${enrolledCourses[0].courseId._id}`} style={{ padding:'12px 14px', borderRadius:12, flexShrink:0, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', transition:'all 0.2s' }}>
                    <MessageSquare size={15} />
                  </Link>
                )}
              </div>
            </div>

            {/* Instructor CTA */}
            {user?.role === 'instructor' ? (
              <div className="dp-instructor-cta" style={{ animation:'card-in 0.5s ease 0.65s both' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <GraduationCap size={18} color="#fbbf24" />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.88)' }}>Instructor Studio</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>Create & manage your courses</div>
                  </div>
                </div>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.6, marginBottom:14 }}>Share your knowledge with 50,000+ learners. Build courses, track enrollments, and earn.</p>
                <Link to="/instructor" style={{ width:'100%', padding:'11px', borderRadius:11, fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:13, fontWeight:700, color:'#fbbf24', background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.28)', display:'flex', alignItems:'center', justifyContent:'center', gap:7, textDecoration:'none' }}>
                  <Zap size={14} /> Go to Instructor Studio
                </Link>
              </div>
            ) : (
              <div className="dp-instructor-cta" style={{ animation:'card-in 0.5s ease 0.65s both' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Award size={18} color="#fbbf24" />
                  </div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>Become an Instructor</div>
                </div>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.6, marginBottom:14 }}>Have expertise to share? Teach thousands, earn revenue, and build your brand.</p>
                <Link to="/instructor" style={{ width:'100%', padding:'11px', borderRadius:11, fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:13, fontWeight:700, color:'#fbbf24', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', display:'flex', alignItems:'center', justifyContent:'center', gap:7, textDecoration:'none' }}>
                  <ChevronRight size={14} /> Start Teaching →
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* PRICING MODAL — inside return, after dp-inner */}
      {showPricing && (
        <div className="dp-modal-overlay" onClick={e => e.target === e.currentTarget && setShowPricing(false)}>
          <div className="dp-modal">
            <div className="dp-modal-header">
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Crown size={15} color="white" />
                  </div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    Choose Your Plan
                  </div>
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>Unlock personal AI training, unlimited courses & verified certificates</div>
              </div>
              <button className="dp-modal-close" onClick={() => setShowPricing(false)}><X size={16} /></button>
            </div>

            <div className="dp-modal-body">
              <div className="dp-plans-grid">
                {PLANS.map(({ name, price, period, color, popular, btnStyle, features }) => (
                  <div key={name} className={`dp-plan-card ${popular ? 'popular' : ''}`} style={{ paddingTop: popular ? 36 : 22 }}>
                    {popular && <div className="dp-plan-popular-tag">Most Popular</div>}
                    <div className="dp-plan-name" style={{ color }}>{name}</div>
                    <div className="dp-plan-price" style={{ fontSize: price === 'Free' ? 36 : 32, background:`linear-gradient(135deg,#fff,${color})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{price}</div>
                    <div className="dp-plan-period">{period}</div>
                    <div style={{ flex:1 }}>
                      {features.map(({ on, text }) => (
                        <div key={text} className="dp-plan-feature" style={{ opacity: on ? 1 : 0.35, textDecoration: on ? 'none' : 'line-through' }}>
                          <CheckCircle size={13} color={on ? color : 'rgba(255,255,255,0.2)'} style={{ flexShrink:0, marginTop:1 }} />
                          {text}
                        </div>
                      ))}
                    </div>
                    <button
                      className="dp-plan-btn"
                      style={
                        btnStyle === 'primary' ? { color:'#fff', background:'linear-gradient(135deg,#1d4ed8,#818cf8)', boxShadow:'0 0 20px rgba(59,111,255,0.3)' }
                        : btnStyle === 'gold'   ? { color:'#fbbf24', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)' }
                        :                         { color:'rgba(255,255,255,0.55)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }
                      }
                      onClick={() => { setShowPricing(false); toast.success(`${name} plan selected!`); }}
                    >
                      {price === 'Free' ? 'Current Plan' : `Get ${name}`}
                      {price !== 'Free' && <ArrowUpRight size={13} />}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:20, padding:'12px 18px', borderRadius:12, background:'rgba(52,211,153,0.07)', border:'1px solid rgba(52,211,153,0.18)', display:'flex', alignItems:'center', gap:10, justifyContent:'center', fontSize:12, color:'rgba(52,211,153,0.75)', fontWeight:600 }}>
                <Shield size={14} color="#34d399" />
                30-day money-back guarantee · No questions asked · Instant refund
              </div>

              <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginTop:16 }}>
                {['VISA','Mastercard','PayPal','Stripe','UPI'].map(p => (
                  <div key={p} style={{ padding:'5px 12px', borderRadius:7, fontSize:11, fontWeight:800, fontFamily:"'Clash Display',sans-serif", background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.3)', letterSpacing:'0.03em' }}>{p}</div>
                ))}
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(255,255,255,0.2)', fontWeight:600 }}>
                  <Lock size={11} /> 256-bit SSL
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}