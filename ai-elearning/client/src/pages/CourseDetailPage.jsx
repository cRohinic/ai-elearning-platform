import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchCourse, enrollCourse, createCheckout } from '../services/courseService.js';
import { useAuthStore } from '../store/authStore.js';
import {
  CheckCircle, Clock, Users, BookOpen, Star,
  ChevronRight, Lock, Zap, Shield, Award, PlayCircle,
  GraduationCap, TrendingUp, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';

/* ─── Inject keyframes & styles ─── */
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
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeLeft {
    from { opacity:0; transform:translateX(32px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 24px rgba(59,111,255,0.35); }
    50%      { box-shadow: 0 0 48px rgba(59,111,255,0.65); }
  }
  @keyframes shimmer-line {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  @keyframes typing {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes blink {
    0%,100% { border-color: transparent; }
    50%      { border-color: var(--accent2); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes float-y {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes progress-fill {
    from { width: 0%; }
    to   { width: var(--target-w); }
  }
  @keyframes card-in {
    from { opacity:0; transform: translateY(20px) scale(0.97); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  .cdp-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Cabinet Grotesk', sans-serif;
    color: rgba(255,255,255,0.88);
  }

  /* Hero banner */
  .cdp-hero {
    position: relative; overflow: hidden;
    padding: 60px 24px 0;
    background: linear-gradient(180deg, rgba(8,14,36,0.98) 0%, var(--bg) 100%);
  }
  .cdp-hero::before {
    content:'';
    position:absolute; inset:0;
    backgroundImage: linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events:none;
  }
  .cdp-hero-orb-1 {
    position:absolute; width:700px; height:700px; border-radius:50%;
    top:-300px; left:-200px;
    background: radial-gradient(circle, rgba(29,78,216,0.14) 0%, transparent 65%);
    pointer-events:none;
  }
  .cdp-hero-orb-2 {
    position:absolute; width:500px; height:500px; border-radius:50%;
    top:0; right:-100px;
    background: radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 65%);
    pointer-events:none;
  }

  .cdp-category-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(167,139,250,0.12);
    border: 1px solid rgba(167,139,250,0.28);
    border-radius: 100px; padding: 5px 14px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.09em;
    color: var(--accent3); text-transform: uppercase;
    margin-bottom: 20px;
    animation: fadeIn 0.6s ease both;
  }

  .cdp-title {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 700; line-height: 1.07;
    letter-spacing: -0.03em;
    background: linear-gradient(150deg, #fff 0%, #93c5fd 55%, #a78bfa 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeUp 0.7s ease 0.1s both;
    margin-bottom: 18px;
  }

  .cdp-desc {
    font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.42);
    max-width: 680px;
    animation: fadeUp 0.7s ease 0.2s both;
    margin-bottom: 28px;
    font-weight: 400;
  }

  .cdp-meta-row {
    display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
    animation: fadeUp 0.7s ease 0.3s both;
    margin-bottom: 32px;
  }
  .cdp-meta-chip {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45);
    padding: 6px 12px; border-radius: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .cdp-level-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 5px 12px; border-radius: 6px;
  }

  /* Animated rating stars */
  .star-fill {
    animation: fadeIn 0.3s ease both;
  }

  /* Main layout */
  .cdp-body {
    max-width: 1200px; margin: 0 auto;
    padding: 48px 24px 80px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .cdp-body { grid-template-columns: 1fr; }
    .cdp-sidebar { order: -1; }
  }

  /* Section cards */
  .cdp-card {
    background: rgba(8,14,36,0.75);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    position: relative; overflow: hidden;
    backdrop-filter: blur(12px);
    transition: border-color 0.3s;
  }
  .cdp-card::before {
    content:'';
    position: absolute; top:0; left:0; right:0; height:1px;
    background: linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .cdp-card:hover { border-color: rgba(59,111,255,0.25); }
  .cdp-card:hover::before { opacity: 1; }

  .cdp-section-title {
    font-family: 'Clash Display', sans-serif;
    font-size: 22px; font-weight: 600;
    color: rgba(255,255,255,0.92); letter-spacing: -0.01em;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .cdp-section-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Outcome items */
  .outcome-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0;
    font-size: 14px; color: rgba(255,255,255,0.55);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    animation: fadeUp 0.5s ease both;
    transition: color 0.2s;
  }
  .outcome-item:last-child { border-bottom: none; }
  .outcome-item:hover { color: rgba(255,255,255,0.8); }

  /* Curriculum lessons */
  .lesson-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 12px;
    transition: all 0.2s; cursor: default;
    border: 1px solid transparent;
    animation: card-in 0.4s ease both;
  }
  .lesson-row:hover {
    background: rgba(59,111,255,0.08);
    border-color: rgba(59,111,255,0.15);
  }
  .lesson-num {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
    background: rgba(59,111,255,0.12);
    color: var(--accent2); letter-spacing: 0;
  }
  .lesson-title {
    flex: 1; font-size: 14px; color: rgba(255,255,255,0.6);
    font-weight: 500; letter-spacing: 0.01em;
  }
  .lesson-type-tag {
    font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 5px;
  }

  /* Sidebar */
  .cdp-sidebar-card {
    background: rgba(8,14,36,0.9);
    border: 1px solid rgba(59,111,255,0.18);
    border-radius: 22px;
    overflow: hidden;
    position: sticky; top: 88px;
    animation: fadeLeft 0.7s ease 0.2s both;
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,111,255,0.1);
  }

  .cdp-thumbnail-wrap {
    position: relative; overflow: hidden;
    aspect-ratio: 16/9;
  }
  .cdp-thumbnail-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s ease;
  }
  .cdp-thumbnail-wrap:hover img { transform: scale(1.04); }
  .cdp-thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(2,4,15,0.95) 100%);
  }
  .cdp-play-btn {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 2px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.25s; cursor: pointer;
    animation: pulse-glow 3s ease-in-out infinite;
  }
  .cdp-thumbnail-wrap:hover .cdp-play-btn {
    background: rgba(59,111,255,0.5);
    border-color: rgba(96,165,250,0.6);
    transform: translate(-50%, -50%) scale(1.1);
  }

  .cdp-sidebar-body { padding: 24px; }

  .cdp-price {
    font-family: 'Clash Display', sans-serif;
    font-size: 40px; font-weight: 700; letter-spacing: -0.03em;
    line-height: 1;
    background: linear-gradient(135deg, #fff 0%, #93c5fd 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }
  .cdp-price-sub {
    font-size: 12px; color: rgba(255,255,255,0.28); margin-bottom: 20px;
    font-weight: 500; letter-spacing: 0.04em;
  }

  .cdp-btn-primary {
    width: 100%; padding: 15px 24px; border-radius: 13px;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 700;
    color: #fff; cursor: pointer; border: none;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6, #818cf8);
    box-shadow: 0 0 32px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.3);
    transition: all 0.25s; letter-spacing: 0.01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
    animation: pulse-glow 3.5s ease-in-out infinite;
  }
  .cdp-btn-primary::after {
    content:'';
    position:absolute; top:0; left:-100%; width:60%; height:100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: skewX(-20deg);
    transition: left 0.5s;
  }
  .cdp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(59,130,246,0.55), 0 8px 24px rgba(0,0,0,0.4); }
  .cdp-btn-primary:hover::after { left: 150%; }
  .cdp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .cdp-btn-continue {
    width: 100%; padding: 15px 24px; border-radius: 13px;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 700;
    color: var(--accent2); cursor: pointer; text-decoration: none;
    background: rgba(59,111,255,0.1);
    border: 1px solid rgba(59,130,246,0.3);
    transition: all 0.25s; letter-spacing: 0.01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cdp-btn-continue:hover { background: rgba(59,111,255,0.18); border-color: rgba(59,130,246,0.5); transform: translateY(-1px); }

  /* Trust badges */
  .trust-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    margin-top: 20px;
  }
  .trust-item {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 10px; border-radius: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600;
    letter-spacing: 0.02em;
  }

  /* Requirements */
  .req-item {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.4);
    padding: 6px 0; line-height: 1.5;
  }
  .req-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--accent2); opacity: 0.5;
    flex-shrink: 0; margin-top: 7px;
  }

  /* Instructor strip */
  .instructor-card {
    display: flex; gap: 16px; align-items: center;
    padding: 20px; border-radius: 14px;
    background: rgba(59,111,255,0.06);
    border: 1px solid rgba(59,111,255,0.12);
    animation: fadeUp 0.6s ease 0.5s both;
    margin-bottom: 28px;
  }
  .instructor-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #1d4ed8, #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Clash Display', sans-serif; font-size: 22px; font-weight: 700; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 0 20px rgba(59,111,255,0.35);
  }

  /* Loading skeleton */
  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 400% 100%;
    animation: shimmer-line 1.5s ease-in-out infinite;
    border-radius: 10px;
  }

  /* Animated counter */
  .count-num {
    animation: countUp 0.6s ease both;
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

/* Animated text reveal on mount */
function AnimatedText({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{
      display: 'inline-block',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 0.6s ease, transform 0.6s ease`,
      ...style,
    }}>
      {children}
    </span>
  );
}

/* Typing cursor effect for subtitle */
function TypedText({ text, delay = 400 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(iv);
      }, 22);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return (
    <span>{displayed}<span style={{ borderRight: '2px solid #60a5fa', animation: 'blink 0.9s step-end infinite', marginLeft: '2px' }}>&nbsp;</span></span>
  );
}

/* Star rating display */
function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((n, i) => (
        <span
          key={n}
          className="star-fill"
          style={{ animationDelay: `${i * 80}ms`, color: n <= Math.round(rating) ? '#fbbf24' : 'rgba(255,255,255,0.15)', fontSize: '14px' }}
        >★</span>
      ))}
    </div>
  );
}

/* Lesson type color map */
const lessonTypeStyle = {
  video:   { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  text:    { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
  quiz:    { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  default: { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const mainRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => fetchCourse(slug),
  });

  const course = data?.course;

  const isEnrolled = user?.enrolledCourses?.some(
    (e) => e.courseId?.toString() === course?._id?.toString()
  ) || user?.purchasedCourses?.includes(course?._id);

  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(course._id),
    onSuccess: () => {
      toast.success('Enrolled! Start learning now.');
      navigate(`/learn/${course._id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Enrollment failed'),
  });

  const checkoutMutation = useMutation({
    mutationFn: () => createCheckout(course._id),
    onSuccess: ({ url }) => { window.location.href = url; },
    onError: () => toast.error('Payment setup failed'),
  });

  const handleCTA = () => {
    if (!token) return navigate('/login');
    if (course.isFree || course.price === 0) enrollMutation.mutate();
    else checkoutMutation.mutate();
  };

  const isBusy = enrollMutation.isPending || checkoutMutation.isPending;

  /* ── Loading ── */
  if (isLoading) return (
    <div className="cdp-page" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <InjectCSS />
      <div className="skeleton" style={{ height: '14px', width: '120px', marginBottom: '20px' }} />
      <div className="skeleton" style={{ height: '52px', width: '70%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '20px', width: '50%', marginBottom: '40px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
        <div>
          <div className="skeleton" style={{ height: '220px', marginBottom: '20px' }} />
          <div className="skeleton" style={{ height: '300px' }} />
        </div>
        <div className="skeleton" style={{ height: '480px', borderRadius: '22px' }} />
      </div>
    </div>
  );

  if (!course) return (
    <div className="cdp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <InjectCSS />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
        <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '24px', color: 'rgba(255,255,255,0.5)' }}>Course not found</p>
      </div>
    </div>
  );

  const isFree = course.isFree || course.price === 0;
  const levelColors = {
    beginner:     { bg: 'rgba(52,211,153,0.14)', color: '#34d399' },
    intermediate: { bg: 'rgba(251,191,36,0.14)', color: '#fbbf24' },
    advanced:     { bg: 'rgba(239,68,68,0.14)',  color: '#f87171' },
  };
  const lvl = levelColors[course.level] || levelColors.beginner;

  return (
    <div className="cdp-page" ref={mainRef}>
      <InjectCSS />

      {/* ── HERO BANNER ── */}
      <div className="cdp-hero">
        <div className="cdp-hero-orb-1" />
        <div className="cdp-hero-orb-2" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, paddingBottom: '48px' }}>

          {/* Breadcrumb */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '24px', animation: 'fadeIn 0.5s ease both',
            fontSize: '13px', color: 'rgba(255,255,255,0.25)', fontWeight: 500,
          }}>
            <Link to="/courses" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}>Courses</Link>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--accent2)' }}>{course.category || 'Course'}</span>
          </div>

          {/* Category tag */}
          {course.category && (
            <div className="cdp-category-tag">
              <Sparkles size={10} />
              {course.category}
            </div>
          )}

          {/* Title */}
          <h1 className="cdp-title">{course.title}</h1>

          {/* Typed description */}
          <p className="cdp-desc">
            <TypedText text={course.description || 'Master this course with AI-guided learning.'} delay={300} />
          </p>

          {/* Meta chips */}
          <div className="cdp-meta-row">
            {course.enrollmentCount > 0 && (
              <div className="cdp-meta-chip">
                <Users size={14} color="#60a5fa" />
                <span className="count-num">{course.enrollmentCount.toLocaleString()}</span> students
              </div>
            )}
            {course.rating > 0 && (
              <div className="cdp-meta-chip" style={{ gap: '8px' }}>
                <Stars rating={course.rating} />
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>{course.rating?.toFixed(1)}</span>
              </div>
            )}
            {course.lessons?.length > 0 && (
              <div className="cdp-meta-chip">
                <BookOpen size={14} color="#a78bfa" />
                {course.lessons.length} lessons
              </div>
            )}
            {course.duration && (
              <div className="cdp-meta-chip">
                <Clock size={14} color="#34d399" />
                {course.duration}
              </div>
            )}
            {course.level && (
              <span className="cdp-level-badge" style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.color}30` }}>
                {course.level}
              </span>
            )}
          </div>

          {/* Instructor mini row */}
          {course.instructor && (
            <div className="instructor-card" style={{ display: 'inline-flex', maxWidth: '420px' }}>
              <div className="instructor-avatar">
                {course.instructor?.name?.[0]?.toUpperCase() || 'I'}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>Instructor</div>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                  {course.instructor?.name || 'Expert Instructor'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider shimmer */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.3), rgba(167,139,250,0.3), transparent)' }} />

      {/* ── BODY ── */}
      <div className="cdp-body">

        {/* ── LEFT COL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* What you'll learn */}
          {course.outcomes?.length > 0 && (
            <div className="cdp-card" style={{ animation: 'card-in 0.5s ease 0.1s both' }}>
              <div className="cdp-section-title">
                <div className="cdp-section-icon" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <TrendingUp size={17} color="#34d399" />
                </div>
                What you'll learn
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0 24px' }}>
                {course.outcomes.map((o, i) => (
                  <div key={i} className="outcome-item" style={{ animationDelay: `${i * 60}ms` }}>
                    <CheckCircle size={15} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum */}
          {course.lessons?.length > 0 && (
            <div className="cdp-card" style={{ animation: 'card-in 0.5s ease 0.2s both' }}>
              <div className="cdp-section-title">
                <div className="cdp-section-icon" style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <BookOpen size={17} color="#60a5fa" />
                </div>
                Curriculum
                <span style={{
                  marginLeft: 'auto', fontSize: '12px', fontFamily: "'Cabinet Grotesk', sans-serif",
                  color: 'rgba(255,255,255,0.28)', fontWeight: 600,
                }}>
                  {course.lessons.length} lessons
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {course.lessons.map((lesson, i) => {
                  const ts = lessonTypeStyle[lesson.type] || lessonTypeStyle.default;
                  return (
                    <div key={lesson._id} className="lesson-row" style={{ animationDelay: `${i * 45}ms` }}>
                      <div className="lesson-num">{String(i + 1).padStart(2, '0')}</div>

                      {isEnrolled
                        ? <PlayCircle size={15} color="#60a5fa" style={{ flexShrink: 0 }} />
                        : <Lock size={13} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
                      }

                      <span className="lesson-title">{lesson.title}</span>

                      {lesson.duration && (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginRight: '6px' }}>
                          {lesson.duration}
                        </span>
                      )}

                      {lesson.type && (
                        <span className="lesson-type-tag" style={{ background: ts.bg, color: ts.color }}>
                          {lesson.type}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <div className="cdp-card" style={{ animation: 'card-in 0.5s ease 0.3s both' }}>
              <div className="cdp-section-title">
                <div className="cdp-section-icon" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <Shield size={17} color="#fbbf24" />
                </div>
                Requirements
              </div>
              {course.requirements.map((r, i) => (
                <div key={i} className="req-item">
                  <div className="req-dot" />
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="cdp-sidebar">
          <div className="cdp-sidebar-card">

            {/* Thumbnail */}
            {course.thumbnail ? (
              <div className="cdp-thumbnail-wrap">
                <img src={course.thumbnail} alt={course.title} />
                <div className="cdp-thumb-overlay" />
                <div className="cdp-play-btn">
                  <PlayCircle size={22} color="white" />
                </div>
                {isFree && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'linear-gradient(135deg, #059669, #34d399)',
                    color: '#fff', fontSize: '11px', fontWeight: 800,
                    letterSpacing: '0.07em', padding: '4px 10px', borderRadius: '6px',
                    textTransform: 'uppercase',
                  }}>FREE</div>
                )}
              </div>
            ) : (
              <div style={{
                aspectRatio: '16/9', background: 'linear-gradient(135deg, rgba(29,78,216,0.3), rgba(129,140,248,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <GraduationCap size={52} color="rgba(255,255,255,0.15)" />
                {isFree && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'linear-gradient(135deg, #059669, #34d399)',
                    color: '#fff', fontSize: '11px', fontWeight: 800,
                    letterSpacing: '0.07em', padding: '4px 10px', borderRadius: '6px',
                  }}>FREE</div>
                )}
              </div>
            )}

            <div className="cdp-sidebar-body">
              {/* Price */}
              <div className="cdp-price">
                {isFree ? 'Free' : `$${course.price}`}
              </div>
              <div className="cdp-price-sub">
                {isFree ? 'No credit card required' : 'One-time payment · Lifetime access'}
              </div>

              {/* CTA */}
              {isEnrolled ? (
                <Link to={`/learn/${course._id}`} className="cdp-btn-continue">
                  Continue Learning <ChevronRight size={16} />
                </Link>
              ) : (
                <button onClick={handleCTA} disabled={isBusy} className="cdp-btn-primary">
                  {isBusy
                    ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} /> Processing…</>
                    : isFree
                    ? <><Zap size={16} /> Enroll for Free</>
                    : <><Award size={16} /> Buy for ${course.price}</>
                  }
                </button>
              )}

              {/* Trust badges */}
              <div className="trust-row">
                {[
                  { icon: <Shield size={13} color="#34d399" />, text: 'Secure checkout' },
                  { icon: <Award size={13} color="#a78bfa" />, text: 'Certificate' },
                  { icon: <Clock size={13} color="#60a5fa" />, text: 'Lifetime access' },
                  { icon: <GraduationCap size={13} color="#fbbf24" />, text: 'Expert-made' },
                ].map(({ icon, text }) => (
                  <div key={text} className="trust-item">{icon}{text}</div>
                ))}
              </div>

              {/* Quick stats */}
              <div style={{
                marginTop: '20px', paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                {[
                  course.lessons?.length && { label: 'Lessons', val: `${course.lessons.length} lessons` },
                  course.level && { label: 'Level', val: course.level },
                  course.language && { label: 'Language', val: course.language },
                ].filter(Boolean).map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>{label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'capitalize' }}>{val}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}