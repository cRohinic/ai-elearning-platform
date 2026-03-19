import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../services/courseService.js';
import {
  Search, BookOpen, Star, Users, Sparkles, Zap,
  TrendingUp, Filter, X, ChevronDown, GraduationCap, Award,
  Clock, PlayCircle, Flame, Trophy, ChevronRight, Layers
} from 'lucide-react';

/* ─── Styles ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

  :root {
    --bg: #02040f;
    --surface: rgba(8,14,36,0.85);
    --border: rgba(56,114,255,0.13);
    --accent: #3b6fff;
    --accent2: #60a5fa;
    --accent3: #a78bfa;
    --green: #34d399;
    --amber: #fbbf24;
    --red: #f87171;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:-400% center} 100%{background-position:400% center} }
  @keyframes pulse-glow {
    0%,100%{box-shadow:0 0 20px rgba(59,111,255,0.3)}
    50%    {box-shadow:0 0 40px rgba(59,111,255,0.6)}
  }
  @keyframes float-y  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes card-in  { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes badge-glow {
    0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.4)}
    50%    {box-shadow:0 0 0 6px rgba(167,139,250,0)}
  }
  @keyframes grid-pan { from{background-position:0 0} to{background-position:60px 60px} }
  @keyframes search-glow {
    0%,100%{box-shadow:0 0 0 0 rgba(59,111,255,0)} 
    50%    {box-shadow:0 0 0 3px rgba(59,111,255,0.25)}
  }

  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes tag-pop { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

  /* ── Featured section ── */
  .feat-section {
    position:relative;z-index:1;
    max-width:1280px;margin:0 auto;padding:0 24px 56px;
  }
  .feat-header {
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:24px;flex-wrap:wrap;gap:12px;
  }
  .feat-title {
    font-family:'Clash Display',sans-serif;
    font-size:26px;font-weight:700;letter-spacing:-0.02em;
    background:linear-gradient(135deg,#fff 0%,#93c5fd 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    display:flex;align-items:center;gap:10px;
  }
  .feat-title-icon {
    width:34px;height:34px;border-radius:10px;
    display:flex;align-items:center;justify-content:center;
    flex-shrink:0;
  }
  .feat-see-all {
    display:flex;align-items:center;gap:5px;
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:13px;font-weight:600;color:var(--accent2);
    text-decoration:none;
    border:1px solid rgba(96,165,250,0.25);
    border-radius:8px;padding:7px 14px;
    background:rgba(96,165,250,0.07);
    transition:all 0.2s;
  }
  .feat-see-all:hover{background:rgba(96,165,250,0.14);border-color:rgba(96,165,250,0.4);}

  /* Featured card row */
  .feat-scroll {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:16px;
  }

  .feat-card {
    background:rgba(8,14,36,0.8);
    border:1px solid rgba(56,114,255,0.14);
    border-radius:18px;overflow:hidden;
    text-decoration:none;
    display:flex;flex-direction:row;
    align-items:stretch;
    transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;
    position:relative;
    backdrop-filter:blur(10px);
    min-height:120px;
  }
  .feat-card:hover {
    transform:translateY(-4px);
    border-color:rgba(59,111,255,0.3);
    box-shadow:0 16px 40px rgba(0,0,0,0.45),0 0 0 1px rgba(59,111,255,0.1);
  }
  .feat-card-accent {
    width:5px;flex-shrink:0;
  }
  .feat-card-body {
    padding:18px 18px 16px;flex:1;display:flex;flex-direction:column;gap:6px;
  }
  .feat-card-top {
    display:flex;align-items:flex-start;justify-content:space-between;gap:10px;
  }
  .feat-card-title {
    font-family:'Clash Display',sans-serif;
    font-size:15px;font-weight:600;color:rgba(255,255,255,0.88);
    line-height:1.3;letter-spacing:-0.01em;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  }
  .feat-card-badge {
    font-size:9px;font-weight:800;letter-spacing:0.08em;
    text-transform:uppercase;padding:3px 8px;border-radius:5px;
    white-space:nowrap;flex-shrink:0;
  }
  .feat-card-cat {
    font-size:10px;font-weight:700;letter-spacing:0.08em;
    text-transform:uppercase;color:var(--accent3);
  }
  .feat-card-meta {
    display:flex;align-items:center;gap:12px;margin-top:auto;padding-top:8px;
    border-top:1px solid rgba(255,255,255,0.05);
    flex-wrap:wrap;gap:8px;
  }
  .feat-meta-chip {
    display:flex;align-items:center;gap:4px;
    font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);
  }
  .feat-price {
    margin-left:auto;
    font-family:'Clash Display',sans-serif;
    font-size:15px;font-weight:700;
    background:linear-gradient(135deg,#fff,#93c5fd);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .feat-price.free {
    background:linear-gradient(135deg,#34d399,#6ee7b7);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }

  /* Hot tag */
  .hot-tag {
    display:inline-flex;align-items:center;gap:4px;
    background:rgba(251,113,133,0.15);
    border:1px solid rgba(251,113,133,0.3);
    color:#fb7185;
    animation:tag-pop 0.4s ease both;
  }
  .new-tag {
    background:rgba(52,211,153,0.15);
    border:1px solid rgba(52,211,153,0.3);
    color:#34d399;
  }
  .top-tag {
    background:rgba(251,191,36,0.15);
    border:1px solid rgba(251,191,36,0.3);
    color:#fbbf24;
  }

  /* Divider shimmer */
  .feat-divider {
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(96,165,250,0.2),rgba(167,139,250,0.2),transparent);
    margin:0 24px 48px;position:relative;z-index:1;
  }

  .cp-page {
    min-height:100vh;
    background:var(--bg);
    font-family:'Cabinet Grotesk',sans-serif;
    color:rgba(255,255,255,0.88);
    position:relative;
  }
  .cp-grid-bg {
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image:
      linear-gradient(rgba(37,99,235,0.03) 1px,transparent 1px),
      linear-gradient(90deg,rgba(37,99,235,0.03) 1px,transparent 1px);
    background-size:60px 60px;
    animation:grid-pan 10s linear infinite;
  }
  .cp-orb1{
    position:fixed;width:700px;height:700px;border-radius:50%;
    top:-200px;left:-200px;
    background:radial-gradient(circle,rgba(29,78,216,0.12) 0%,transparent 65%);
    pointer-events:none;z-index:0;
    animation:float-y 8s ease-in-out infinite;
  }
  .cp-orb2{
    position:fixed;width:500px;height:500px;border-radius:50%;
    bottom:-100px;right:-100px;
    background:radial-gradient(circle,rgba(129,140,248,0.09) 0%,transparent 65%);
    pointer-events:none;z-index:0;
    animation:float-y 10s ease-in-out infinite;animation-delay:-4s;
  }

  /* ── Hero ── */
  .cp-hero {
    position:relative;z-index:1;
    padding:64px 24px 48px;
    text-align:center;
    max-width:900px;margin:0 auto;
  }
  .cp-hero-badge {
    display:inline-flex;align-items:center;gap:7px;
    background:rgba(167,139,250,0.1);
    border:1px solid rgba(167,139,250,0.28);
    border-radius:100px;padding:6px 18px;
    font-size:11px;font-weight:700;letter-spacing:0.09em;
    color:var(--accent3);text-transform:uppercase;
    margin-bottom:24px;
    animation:badge-glow 2.5s ease-in-out infinite,fadeIn 0.6s ease both;
  }
  .cp-hero-title {
    font-family:'Clash Display',sans-serif;
    font-size:clamp(40px,6vw,72px);font-weight:700;
    line-height:1.05;letter-spacing:-0.03em;
    background:linear-gradient(150deg,#fff 0%,#93c5fd 50%,#a78bfa 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:fadeUp 0.7s ease 0.1s both;
    margin-bottom:16px;
  }
  .cp-hero-sub {
    font-size:clamp(15px,2vw,18px);color:rgba(255,255,255,0.38);
    line-height:1.65;font-weight:400;
    animation:fadeUp 0.7s ease 0.2s both;
    margin-bottom:0;
    max-width:560px;margin-left:auto;margin-right:auto;
  }

  /* ── Search bar ── */
  .cp-search-wrap {
    position:relative;z-index:1;
    max-width:700px;margin:0 auto 32px;
    padding:0 24px;
    animation:fadeUp 0.7s ease 0.3s both;
  }
  .cp-search-box {
    display:flex;align-items:center;
    background:rgba(8,14,36,0.8);
    border:1px solid rgba(59,111,255,0.2);
    border-radius:16px;overflow:hidden;
    backdrop-filter:blur(12px);
    transition:border-color 0.2s,box-shadow 0.2s;
  }
  .cp-search-box:focus-within {
    border-color:rgba(59,111,255,0.5);
    animation:search-glow 1.5s ease-in-out infinite;
  }
  .cp-search-input {
    flex:1;padding:16px 18px;
    background:transparent;border:none;outline:none;
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:15px;font-weight:500;color:rgba(255,255,255,0.8);
  }
  .cp-search-input::placeholder{color:rgba(255,255,255,0.22);}
  .cp-search-icon-wrap {
    padding:0 18px;color:rgba(255,255,255,0.25);
    display:flex;align-items:center;
  }
  .cp-level-select {
    background:rgba(59,111,255,0.1);
    border-left:1px solid rgba(59,111,255,0.15);
    border:none;outline:none;
    padding:0 16px;height:100%;
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);
    cursor:pointer;min-width:130px;
  }
  .cp-level-select option{background:#0a0f28;}

  /* ── Category pills ── */
  .cp-cats {
    display:flex;gap:8px;flex-wrap:wrap;justify-content:center;
    position:relative;z-index:1;
    padding:0 24px 40px;
    animation:fadeUp 0.7s ease 0.4s both;
  }
  .cp-cat-pill {
    padding:8px 18px;border-radius:100px;
    font-family:'Cabinet Grotesk',sans-serif;
    font-size:13px;font-weight:600;cursor:pointer;
    transition:all 0.22s;border:1px solid rgba(255,255,255,0.08);
    color:rgba(255,255,255,0.38);background:rgba(255,255,255,0.03);
    letter-spacing:0.01em;
  }
  .cp-cat-pill:hover {
    color:rgba(255,255,255,0.7);
    border-color:rgba(59,111,255,0.3);
    background:rgba(59,111,255,0.08);
  }
  .cp-cat-pill.active {
    color:#fff;
    background:linear-gradient(135deg,rgba(29,78,216,0.6),rgba(129,140,248,0.4));
    border-color:rgba(96,165,250,0.4);
    box-shadow:0 0 16px rgba(59,111,255,0.25);
  }

  /* ── Stats row ── */
  .cp-stats {
    display:flex;gap:0;justify-content:center;flex-wrap:wrap;
    position:relative;z-index:1;
    max-width:600px;margin:0 auto 52px;
    border:1px solid rgba(255,255,255,0.06);
    border-radius:14px;overflow:hidden;
    background:rgba(8,14,36,0.6);backdrop-filter:blur(8px);
    animation:fadeIn 0.8s ease 0.5s both;
  }
  .cp-stat {
    flex:1;min-width:100px;padding:16px 24px;text-align:center;
    border-right:1px solid rgba(255,255,255,0.05);
  }
  .cp-stat:last-child{border-right:none;}
  .cp-stat-num {
    font-family:'Clash Display',sans-serif;font-size:22px;font-weight:700;
    background:linear-gradient(135deg,#60a5fa,#a78bfa);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .cp-stat-lbl {
    font-size:10px;font-weight:700;letter-spacing:0.08em;
    color:rgba(255,255,255,0.25);text-transform:uppercase;margin-top:2px;
  }

  /* ── Section header ── */
  .cp-section-header {
    max-width:1280px;margin:0 auto;padding:0 24px 20px;
    display:flex;align-items:center;justify-content:space-between;
    position:relative;z-index:1;
    animation:fadeIn 0.6s ease 0.5s both;
  }
  .cp-result-count {
    font-family:'Clash Display',sans-serif;
    font-size:20px;font-weight:600;color:rgba(255,255,255,0.7);
  }
  .cp-sort-btn {
    display:flex;align-items:center;gap:6px;
    padding:7px 14px;border-radius:9px;cursor:pointer;
    font-family:'Cabinet Grotesk',sans-serif;font-size:12px;font-weight:600;
    color:rgba(255,255,255,0.35);
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    transition:all 0.2s;
  }
  .cp-sort-btn:hover{color:rgba(255,255,255,0.6);border-color:rgba(255,255,255,0.15);}

  /* ── Grid ── */
  .cp-grid {
    max-width:1280px;margin:0 auto;padding:0 24px 80px;
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:20px;
    position:relative;z-index:1;
  }

  /* ── Course Card ── */
  .cp-card {
    background:rgba(8,14,36,0.75);
    border:1px solid rgba(56,114,255,0.12);
    border-radius:18px;overflow:hidden;
    text-decoration:none;
    display:flex;flex-direction:column;
    transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;
    position:relative;
    backdrop-filter:blur(10px);
  }
  .cp-card::before {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(96,165,250,0.5),transparent);
    opacity:0;transition:opacity 0.25s;z-index:2;
  }
  .cp-card:hover {
    transform:translateY(-6px);
    border-color:rgba(59,111,255,0.3);
    box-shadow:0 20px 48px rgba(0,0,0,0.5),0 0 0 1px rgba(59,111,255,0.1);
  }
  .cp-card:hover::before{opacity:1;}

  .cp-thumb {
    position:relative;height:180px;overflow:hidden;
    background:linear-gradient(135deg,rgba(29,78,216,0.25),rgba(129,140,248,0.15));
  }
  .cp-thumb img {
    width:100%;height:100%;object-fit:cover;
    transition:transform 0.4s ease;
  }
  .cp-card:hover .cp-thumb img{transform:scale(1.07);}
  .cp-thumb-overlay {
    position:absolute;inset:0;
    background:linear-gradient(to bottom,transparent 40%,rgba(2,4,15,0.85) 100%);
  }
  .cp-thumb-icon {
    width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  }

  .cp-level-tag {
    position:absolute;top:12px;right:12px;z-index:2;
    font-size:10px;font-weight:800;letter-spacing:0.07em;
    text-transform:uppercase;padding:4px 10px;border-radius:6px;
    backdrop-filter:blur(8px);
  }
  .cp-free-tag {
    position:absolute;top:12px;left:12px;z-index:2;
    font-size:10px;font-weight:800;letter-spacing:0.07em;
    padding:4px 10px;border-radius:6px;
    background:linear-gradient(135deg,#059669,#34d399);
    color:#fff;
  }

  .cp-card-body { padding:20px;flex:1;display:flex;flex-direction:column; }
  .cp-card-cat {
    font-size:10px;font-weight:700;letter-spacing:0.09em;
    text-transform:uppercase;color:var(--accent3);margin-bottom:8px;
  }
  .cp-card-title {
    font-family:'Clash Display',sans-serif;
    font-size:16px;font-weight:600;color:rgba(255,255,255,0.88);
    line-height:1.3;letter-spacing:-0.01em;
    margin-bottom:8px;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  }
  .cp-card-desc {
    font-size:12.5px;color:rgba(255,255,255,0.3);line-height:1.55;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
    margin-bottom:16px;flex:1;font-weight:400;
  }
  .cp-card-footer {
    display:flex;align-items:center;justify-content:space-between;
    padding-top:14px;border-top:1px solid rgba(255,255,255,0.05);
  }
  .cp-card-meta {
    display:flex;align-items:center;gap:10px;
  }
  .cp-meta-item {
    display:flex;align-items:center;gap:4px;
    font-size:12px;font-weight:600;color:rgba(255,255,255,0.3);
  }
  .cp-card-price {
    font-family:'Clash Display',sans-serif;
    font-size:17px;font-weight:700;
    background:linear-gradient(135deg,#fff,#93c5fd);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .cp-card-price.free{
    background:linear-gradient(135deg,#34d399,#6ee7b7);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }

  /* ── Empty state ── */
  .cp-empty {
    grid-column:1/-1;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:80px 24px;gap:16px;text-align:center;
    animation:fadeUp 0.6s ease both;
  }
  .cp-empty-icon {
    width:80px;height:80px;border-radius:20px;
    background:rgba(59,111,255,0.08);
    border:1px solid rgba(59,111,255,0.15);
    display:flex;align-items:center;justify-content:center;
    margin-bottom:8px;
    animation:float-y 4s ease-in-out infinite;
  }

  /* ── Skeleton ── */
  .cp-skeleton {
    background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
    background-size:400% 100%;
    animation:shimmer 1.6s ease-in-out infinite;
    border-radius:10px;
  }
  .cp-skel-card {
    background:rgba(8,14,36,0.7);
    border:1px solid rgba(56,114,255,0.1);
    border-radius:18px;overflow:hidden;
  }

  /* Active filter chips */
  .cp-active-filter {
    display:inline-flex;align-items:center;gap:6px;
    padding:5px 12px;border-radius:100px;
    font-size:12px;font-weight:600;
    background:rgba(59,111,255,0.12);
    border:1px solid rgba(59,111,255,0.25);
    color:var(--accent2);
    animation:fadeIn 0.3s ease both;
  }
  .cp-clear-btn {
    background:none;border:none;cursor:pointer;
    color:rgba(255,255,255,0.3);padding:0;
    display:flex;align-items:center;
    transition:color 0.2s;
  }
  .cp-clear-btn:hover{color:rgba(255,255,255,0.7);}
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

const CATEGORIES = ['All','Web Development','Data Science','AI & ML','Design','Business','DevOps'];
const LEVELS     = ['All','Beginner','Intermediate','Advanced'];

const CAT_ICONS = {
  'All': '✦',
  'Web Development': '🌐',
  'Data Science': '📊',
  'AI & ML': '🤖',
  'Design': '🎨',
  'Business': '💼',
  'DevOps': '⚙️',
};

const levelStyleCard = {
  beginner:     { bg:'rgba(52,211,153,0.18)', color:'#34d399', border:'rgba(52,211,153,0.3)' },
  intermediate: { bg:'rgba(251,191,36,0.18)', color:'#fbbf24', border:'rgba(251,191,36,0.3)' },
  advanced:     { bg:'rgba(248,113,113,0.18)', color:'#f87171', border:'rgba(248,113,113,0.3)' },
};

/* ── Course Card ── */
function CourseCard({ course, index }) {
  const isFree = course.isFree || course.price === 0;
  const lvl = levelStyleCard[course.level] || levelStyleCard.beginner;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="cp-card"
      style={{ animation: `card-in 0.45s ease ${index * 55}ms both` }}
    >
      {/* Thumbnail */}
      <div className="cp-thumb">
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} />
          : <div className="cp-thumb-icon">
              <GraduationCap size={40} color="rgba(255,255,255,0.12)" />
            </div>
        }
        <div className="cp-thumb-overlay" />
        {isFree && <div className="cp-free-tag">FREE</div>}
        {course.level && (
          <span className="cp-level-tag" style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.border}` }}>
            {course.level}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="cp-card-body">
        {course.category && <div className="cp-card-cat">{course.category}</div>}
        <h3 className="cp-card-title">{course.title}</h3>
        <p className="cp-card-desc">{course.description}</p>

        <div className="cp-card-footer">
          <div className="cp-card-meta">
            {course.enrollmentCount > 0 && (
              <div className="cp-meta-item">
                <Users size={12} color="#60a5fa" />
                {course.enrollmentCount >= 1000
                  ? `${(course.enrollmentCount / 1000).toFixed(1)}k`
                  : course.enrollmentCount}
              </div>
            )}
            {course.rating > 0 && (
              <div className="cp-meta-item">
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <span style={{ color: '#fbbf24' }}>{course.rating?.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className={`cp-card-price ${isFree ? 'free' : ''}`}>
            {isFree ? 'Free' : `$${course.price}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard({ index }) {
  return (
    <div className="cp-skel-card" style={{ animation: `card-in 0.4s ease ${index * 40}ms both` }}>
      <div className="cp-skeleton" style={{ height: '180px', borderRadius: 0 }} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="cp-skeleton" style={{ height: '10px', width: '60px' }} />
        <div className="cp-skeleton" style={{ height: '16px', width: '85%' }} />
        <div className="cp-skeleton" style={{ height: '12px', width: '70%' }} />
        <div className="cp-skeleton" style={{ height: '12px', width: '50%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <div className="cp-skeleton" style={{ height: '14px', width: '80px' }} />
          <div className="cp-skeleton" style={{ height: '14px', width: '40px' }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Featured course data ─── */
const FEATURED_COURSES = [
  {
    id: 'f1', slug: 'gpt-prompt-engineering',
    title: 'GPT-4 & Prompt Engineering Masterclass',
    category: 'AI & ML', level: 'beginner',
    lessons: 42, duration: '18h 30m', rating: 4.9, students: 12400,
    price: 0, isFree: true,
    badge: 'hot', accent: 'linear-gradient(180deg,#f87171,#fb923c)',
  },
  {
    id: 'f2', slug: 'ml-from-scratch',
    title: 'Machine Learning from Scratch with Python',
    category: 'Data Science', level: 'intermediate',
    lessons: 68, duration: '32h 15m', rating: 4.8, students: 9800,
    price: 49, isFree: false,
    badge: 'top', accent: 'linear-gradient(180deg,#60a5fa,#3b82f6)',
  },
  {
    id: 'f3', slug: 'react-fullstack',
    title: 'Full-Stack React & Node.js — Build Real Apps',
    category: 'Web Development', level: 'intermediate',
    lessons: 91, duration: '45h 00m', rating: 4.7, students: 21000,
    price: 59, isFree: false,
    badge: 'top', accent: 'linear-gradient(180deg,#34d399,#059669)',
  },
  {
    id: 'f4', slug: 'transformer-models',
    title: 'Transformers & LLMs: Theory to Production',
    category: 'AI & ML', level: 'advanced',
    lessons: 55, duration: '28h 45m', rating: 4.9, students: 5600,
    price: 79, isFree: false,
    badge: 'new', accent: 'linear-gradient(180deg,#a78bfa,#7c3aed)',
  },
  {
    id: 'f5', slug: 'data-viz-python',
    title: 'Data Visualization with Python & Plotly',
    category: 'Data Science', level: 'beginner',
    lessons: 34, duration: '14h 20m', rating: 4.6, students: 7300,
    price: 0, isFree: true,
    badge: 'new', accent: 'linear-gradient(180deg,#fbbf24,#f59e0b)',
  },
  {
    id: 'f6', slug: 'devops-kubernetes',
    title: 'Docker, Kubernetes & CI/CD for Developers',
    category: 'DevOps', level: 'intermediate',
    lessons: 77, duration: '36h 10m', rating: 4.8, students: 8900,
    price: 49, isFree: false,
    badge: 'hot', accent: 'linear-gradient(180deg,#fb7185,#e11d48)',
  },
];

const BADGE_CONFIG = {
  hot:  { label: '🔥 Hot',    cls: 'hot-tag' },
  new:  { label: '✦ New',    cls: 'new-tag' },
  top:  { label: '🏆 Top',   cls: 'top-tag' },
};

const levelStyle = {
  beginner:     { color: '#34d399' },
  intermediate: { color: '#fbbf24' },
  advanced:     { color: '#f87171' },
};

function FeaturedSection() {
  return (
    <div className="feat-section" style={{ animation: 'fadeUp 0.7s ease 0.45s both' }}>
      <div className="feat-header">
        <div className="feat-title">
          <div className="feat-title-icon" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <Flame size={17} color="#fbbf24" />
          </div>
          Featured Courses
        </div>
        <a href="#all-courses" className="feat-see-all">
          View all <ChevronRight size={13} />
        </a>
      </div>

      <div className="feat-scroll">
        {FEATURED_COURSES.map((c, i) => {
          const isFree = c.isFree || c.price === 0;
          const badge  = BADGE_CONFIG[c.badge];
          const lvlClr = levelStyle[c.level]?.color || '#60a5fa';

          return (
            <Link
              key={c.id}
              to={`/courses/${c.slug}`}
              className="feat-card"
              style={{ animation: `card-in 0.4s ease ${i * 60}ms both` }}
            >
              {/* Accent stripe */}
              <div className="feat-card-accent" style={{ background: c.accent }} />

              <div className="feat-card-body">
                <div className="feat-card-top">
                  <div>
                    <div className="feat-card-cat">{c.category}</div>
                    <div className="feat-card-title">{c.title}</div>
                  </div>
                  {badge && (
                    <span className={`feat-card-badge ${badge.cls}`}>{badge.label}</span>
                  )}
                </div>

                <div className="feat-card-meta">
                  {/* Duration */}
                  <div className="feat-meta-chip">
                    <Clock size={11} color="#60a5fa" />
                    {c.duration}
                  </div>
                  {/* Lessons */}
                  <div className="feat-meta-chip">
                    <Layers size={11} color="#a78bfa" />
                    {c.lessons} lessons
                  </div>
                  {/* Rating */}
                  <div className="feat-meta-chip">
                    <Star size={11} color="#fbbf24" fill="#fbbf24" />
                    <span style={{ color: '#fbbf24' }}>{c.rating}</span>
                  </div>
                  {/* Students */}
                  <div className="feat-meta-chip">
                    <Users size={11} color="#34d399" />
                    {c.students >= 1000 ? `${(c.students/1000).toFixed(1)}k` : c.students}
                  </div>
                  {/* Level */}
                  <div className="feat-meta-chip" style={{ color: lvlClr }}>
                    ● {c.level}
                  </div>
                  {/* Price */}
                  <div className={`feat-price ${isFree ? 'free' : ''}`}>
                    {isFree ? 'Free' : `$${c.price}`}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function CoursesPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel]       = useState('All');
  const [focused, setFocused]   = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { category: category === 'All' ? '' : category, level: level === 'All' ? '' : level.toLowerCase(), search }],
    queryFn: () => fetchCourses({ category: category === 'All' ? '' : category, level: level === 'All' ? '' : level.toLowerCase(), search }),
  });

  const courses = data?.courses || [];
  const hasFilters = search || category !== 'All' || level !== 'All';

  return (
    <div className="cp-page">
      <InjectCSS />
      <div className="cp-grid-bg" />
      <div className="cp-orb1" />
      <div className="cp-orb2" />

      {/* ── Hero ── */}
      <div className="cp-hero">
        <div className="cp-hero-badge">
          <Sparkles size={10} /> AI-Curated Course Library
        </div>
        <h1 className="cp-hero-title">
          Explore &amp; Master<br />
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>New Skills</span>
        </h1>
        <p className="cp-hero-sub">
          Handpicked courses taught by industry experts — powered by an AI tutor that adapts to your pace, style, and goals.
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '0 24px 40px', position: 'relative', zIndex: 1 }}>
        <div className="cp-stats" style={{ maxWidth: '560px', margin: '0 auto' }}>
          {[
            { num: '200+', lbl: 'Courses' },
            { num: '50K+', lbl: 'Learners' },
            { num: '7',    lbl: 'Categories' },
            { num: '4.9★', lbl: 'Avg Rating' },
          ].map(({ num, lbl }) => (
            <div key={lbl} className="cp-stat">
              <div className="cp-stat-num">{num}</div>
              <div className="cp-stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Courses ── */}
      <FeaturedSection />

      {/* Divider */}
      <div className="feat-divider" />

      {/* ── Search ── */}
      <div id="all-courses" className="cp-search-wrap">
        <div className="cp-search-box" style={{ borderColor: focused ? 'rgba(59,111,255,0.45)' : 'rgba(59,111,255,0.18)' }}>
          <div className="cp-search-icon-wrap">
            <Search size={17} />
          </div>
          <input
            className="cp-search-input"
            type="text"
            placeholder="Search courses, topics, skills…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ padding: '0 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
          <select
            className="cp-level-select"
            value={level}
            onChange={e => setLevel(e.target.value)}
            style={{
              borderLeft: '1px solid rgba(59,111,255,0.15)',
              paddingLeft: '14px', paddingRight: '14px',
              height: '56px',
            }}
          >
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="cp-cats">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`cp-cat-pill ${category === cat ? 'active' : ''}`}
          >
            <span style={{ marginRight: '5px' }}>{CAT_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Active filters ── */}
      {hasFilters && (
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 24px 24px',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
          position: 'relative', zIndex: 1,
          animation: 'fadeIn 0.3s ease both',
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>Filters:</span>
          {search && (
            <div className="cp-active-filter">
              "{search}"
              <button className="cp-clear-btn" onClick={() => setSearch('')}><X size={12} /></button>
            </div>
          )}
          {category !== 'All' && (
            <div className="cp-active-filter">
              {category}
              <button className="cp-clear-btn" onClick={() => setCategory('All')}><X size={12} /></button>
            </div>
          )}
          {level !== 'All' && (
            <div className="cp-active-filter">
              {level}
              <button className="cp-clear-btn" onClick={() => setLevel('All')}><X size={12} /></button>
            </div>
          )}
          <button
            onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); }}
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 600, transition: 'color 0.2s' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Section header ── */}
      {!isLoading && courses.length > 0 && (
        <div className="cp-section-header">
          <div className="cp-result-count">
            <span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {courses.length}
            </span>
            {' '}
            <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500 }}>
              course{courses.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <button className="cp-sort-btn">
            <Filter size={12} /> Sort by <ChevronDown size={12} />
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="cp-grid">
        {isLoading ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} index={i} />)
        ) : courses.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">
              <BookOpen size={32} color="rgba(96,165,250,0.4)" />
            </div>
            <div style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '24px', fontWeight: 600,
              color: 'rgba(255,255,255,0.45)', marginBottom: '8px',
            }}>
              No courses found
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.22)', maxWidth: '320px', lineHeight: 1.6 }}>
              Try adjusting your search or filters to discover what you're looking for.
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); }}
              style={{
                marginTop: '8px', padding: '10px 24px', borderRadius: '10px',
                fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '13px', fontWeight: 700,
                color: 'var(--accent2)', background: 'rgba(59,111,255,0.1)',
                border: '1px solid rgba(59,111,255,0.25)', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          courses.map((course, i) => <CourseCard key={course._id} course={course} index={i} />)
        )}
      </div>
    </div>
  );
}