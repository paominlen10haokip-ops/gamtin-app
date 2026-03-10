'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase, NewsItem } from '../lib/supabase';
import ShareButton from '../components/ShareButton';
import { useSidebar } from '../components/LayoutWrapper';
import { useAuth } from '../components/AuthProvider';

/* ── Quick-link data ─────────────────────────────────────────── */
const quickLinks = [
  { icon: '📢', label: 'Public Notices', sub: 'Stay informed', href: '/notices', accent: '#3b82f6' },
  { icon: '🛒', label: 'Marketplace', sub: 'Buy & sell local', href: '/marketplace', accent: '#a855f7' },
  { icon: '💼', label: 'Job Alerts', sub: 'Career growth', href: '/jobs', accent: '#11d442' },
  { icon: '🚕', label: 'Taxi Booking', sub: 'Book a ride', href: '/taxi', accent: '#f59e0b' },
  { icon: '📂', label: 'Town Directory', sub: 'Find services', href: '/directory', accent: '#06b6d4' },
  { icon: '🏆', label: 'Competitions', sub: 'Join activities', href: '/competitions', accent: '#ec4899' },
];

/* ── Spotlight carousel data ─────────────────────────────────── */
const spotlight = [
  { title: 'Kut Festival 2024', sub: 'Main Ground • Oct 31', emoji: '🎭', gradient: 'linear-gradient(135deg,#78350f,#92400e)' },
  { title: 'Inter-Village Football', sub: 'Lamka Stadium', emoji: '⚽', gradient: 'linear-gradient(135deg,#064e3b,#065f46)' },
  { title: 'Annual Cultural Meet', sub: 'Town Hall • Dec 15', emoji: '🎶', gradient: 'linear-gradient(135deg,#1e1b4b,#312e81)' },
];

/* ── Live stats ──────────────────────────────────────────────── */
const stats = [
  { value: '12k+', label: 'Community Members' },
  { value: '340+', label: 'Active Listings' },
  { value: '80+', label: 'Jobs Posted' },
];

const formatTimestamp = (d: string) => {
  const hrs = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ── Fade-in hook ────────────────────────────────────────────── */
function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ref;
}

export default function HomePage() {
  const [updates, setUpdates] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [spotIdx, setSpotIdx] = useState(0);
  const [pressedLink, setPressedLink] = useState<string | null>(null);
  const { openSidebar } = useSidebar();
  const { user } = useAuth();

  /* refs for staggered entrance */
  const heroRef = useFadeIn(0);
  const statsRef = useFadeIn(120);
  const gridRef = useFadeIn(220);
  const spotlightRef = useFadeIn(340);
  const newsRef = useFadeIn(440);

  /* auto-advance spotlight */
  useEffect(() => {
    const id = setInterval(() => setSpotIdx(i => (i + 1) % spotlight.length), 3500);
    return () => clearInterval(id);
  }, []);

  /* fetch news */
  useEffect(() => {
    supabase.from('news_feed').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setUpdates(data); setLoading(false); });
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      {/* ══ STICKY HEADER ══════════════════════════════════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'rgba(10,12,10,0.75)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={openSidebar} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: 4.5, cursor: 'pointer', padding: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: i === 1 ? 14 : 20, height: 2, background: 'white', borderRadius: 2, transition: 'width 0.2s' }} />
            ))}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#064e3b,#11d442)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 12px rgba(17,212,66,0.35)' }}>🌿</div>
            <span style={{ fontWeight: 900, fontSize: 19, letterSpacing: '-0.5px', color: 'white' }}>Gamtin</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/search" style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <Link href="/notifications" style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)', position: 'relative' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* Unread dot */}
            <span style={{ position: 'absolute', top: 1, right: 1, width: 7, height: 7, borderRadius: '50%', background: '#11d442', boxShadow: '0 0 6px #11d442', border: '1.5px solid #0a0c0a' }} />
          </Link>
        </div>
      </div>

      <div style={{ paddingBottom: 90 }}>

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <div ref={heroRef} style={{ margin: '16px 16px 0', position: 'relative', borderRadius: 28, overflow: 'hidden' }}>
          {/* animated gradient bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,#022c22 0%,#064e3b 40%,#0a4923 70%,#14532d 100%)',
            animation: 'heroPulse 8s ease-in-out infinite alternate',
          }} />
          {/* floating orbs */}
          <div style={{ position: 'absolute', top: -30, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(17,212,66,0.2) 0%,transparent 70%)', animation: 'floatOrb 6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(17,212,66,0.12) 0%,transparent 70%)', animation: 'floatOrb 8s ease-in-out infinite reverse' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '28px 22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#11d442', boxShadow: '0 0 10px #11d442', animation: 'blink 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Community</span>
            </div>
            <h1 style={{ fontWeight: 900, fontSize: 24, color: 'white', lineHeight: 1.25, marginBottom: 8, letterSpacing: '-0.5px' }}>
              {greeting()},{'\n'}
              <span style={{ color: '#4ade80' }}>Churachandpur</span> 🏔️
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 20 }}>
              Your local hub — news, jobs, rides & more, all in one place.
            </p>
            <Link href="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50,
              padding: '10px 20px', fontSize: 13, fontWeight: 600, color: 'white',
              transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              Search anything…
            </Link>
          </div>
        </div>

        {/* ══ COMMUNITY STATS BAR ═══════════════════════════════ */}
        <div ref={statsRef} style={{
          display: 'flex', margin: '14px 16px 0', borderRadius: 20,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, padding: '14px 0', textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#11d442', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 16px 0' }}>

          {/* ══ QUICK LINKS GRID ════════════════════════════════ */}
          <div ref={gridRef}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>Quick Access</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
              {quickLinks.map((ql, i) => (
                <Link
                  key={ql.label}
                  href={ql.href}
                  onMouseDown={() => setPressedLink(ql.label)}
                  onMouseUp={() => setPressedLink(null)}
                  onTouchStart={() => setPressedLink(ql.label)}
                  onTouchEnd={() => setPressedLink(null)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '16px 8px', borderRadius: 20, textDecoration: 'none',
                    background: pressedLink === ql.label ? `${ql.accent}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${pressedLink === ql.label ? ql.accent + '55' : 'rgba(255,255,255,0.08)'}`,
                    transform: pressedLink === ql.label ? 'scale(0.94)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                    animation: `fadeSlideUp 0.4s ease both`,
                    animationDelay: `${i * 55}ms`,
                  }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: `${ql.accent}18`,
                    border: `1px solid ${ql.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                    boxShadow: `0 4px 16px ${ql.accent}20`,
                  }}>
                    {ql.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: 'white', lineHeight: 1.2 }}>{ql.label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{ql.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ══ COMMUNITY SPOTLIGHT CAROUSEL ═════════════════════ */}
          <div ref={spotlightRef} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>Community Spotlight</h2>
              <Link href="/community" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>See all →</Link>
            </div>

            {/* Featured card */}
            <div style={{
              borderRadius: 24, overflow: 'hidden', position: 'relative',
              background: spotlight[spotIdx].gradient,
              minHeight: 160,
              transition: 'background 0.6s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: 10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ padding: '22px 20px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured Event</span>
                  <h3 style={{ fontWeight: 900, fontSize: 20, color: 'white', marginTop: 6, marginBottom: 6 }}>{spotlight[spotIdx].title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{spotlight[spotIdx].sub}</p>
                </div>
                <div style={{ fontSize: 52, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{spotlight[spotIdx].emoji}</div>
              </div>
              {/* dots */}
              <div style={{ display: 'flex', gap: 6, padding: '0 20px 16px' }}>
                {spotlight.map((_, i) => (
                  <button key={i} onClick={() => setSpotIdx(i)} style={{
                    width: i === spotIdx ? 20 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer',
                    background: i === spotIdx ? 'white' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s',
                    padding: 0,
                  }} />
                ))}
              </div>
            </div>

            {/* secondary cards row */}
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {spotlight.map((s, i) => (
                <button key={i} onClick={() => setSpotIdx(i)} style={{
                  flex: 1, borderRadius: 16, padding: '10px 8px',
                  background: i === spotIdx ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === spotIdx ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22 }}>{s.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: i === spotIdx ? 'white' : 'rgba(255,255,255,0.35)', marginTop: 4, lineHeight: 1.3 }}>{s.title.split(' ').slice(0, 2).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ══ LATEST UPDATES ════════════════════════════════════ */}
          <div ref={newsRef} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>Latest Updates</h2>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#11d442', boxShadow: '0 0 8px #11d442', animation: 'blink 2s ease-in-out infinite' }} />
              </div>
              <Link href="/news" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>See all →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loading ? (
                [0, 1, 2].map(i => (
                  <div key={i} style={{ height: 90, borderRadius: 20, background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.5s ease-in-out infinite', border: '1px solid rgba(255,255,255,0.06)' }} />
                ))
              ) : updates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No updates yet.</div>
              ) : (
                updates.map((u, i) => (
                  <Link key={u.id} href="/news" style={{
                    display: 'flex', gap: 14, padding: '14px 16px', borderRadius: 20, textDecoration: 'none',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.2s',
                    animation: `fadeSlideUp 0.4s ease both`,
                    animationDelay: `${i * 80}ms`,
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  >
                    <div style={{
                      width: 46, height: 46, flexShrink: 0, borderRadius: 14,
                      background: 'rgba(17,212,66,0.1)', border: '1px solid rgba(17,212,66,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                    }}>
                      {u.image_emoji || '📰'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#11d442', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{u.category}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{formatTimestamp(u.created_at)}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {u.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                          {u.likes}
                        </span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                          {u.comments}
                        </span>
                        <div style={{ marginLeft: 'auto' }}>
                          <ShareButton title={u.title} text={`Breaking: ${u.title}`} url={`/news?id=${u.id}`} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ══ FOOTER CTA STRIP ══════════════════════════════════ */}
          <div style={{
            borderRadius: 20, padding: '18px 20px',
            background: 'linear-gradient(135deg,rgba(17,212,66,0.08),rgba(17,212,66,0.03))',
            border: '1px solid rgba(17,212,66,0.15)', marginBottom: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: 'white', marginBottom: 3 }}>Share Gamtin</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Help your community stay connected</p>
            </div>
            <ShareButton
              title="Gamtin — Your Local Community Hub"
              text="Stay connected with Churachandpur on Gamtin — news, jobs, rides & more!"
              url="https://gamtin.com"
            />
          </div>

        </div>
      </div>

      {/* ══ GLOBAL KEYFRAMES ══════════════════════════════════════ */}
      <style>{`
        @keyframes heroPulse {
          0%   { filter: brightness(1);   }
          100% { filter: brightness(1.12); }
        }
        @keyframes floatOrb {
          0%,100% { transform: translateY(0) scale(1);    }
          50%      { transform: translateY(-14px) scale(1.08); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
