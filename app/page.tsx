'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, NewsItem } from '../lib/supabase';
import ShareButton from '../components/ShareButton';
import { useSidebar } from '../components/LayoutWrapper';

const quickLinks = [
  { icon: '📢', label: 'Public Notices', sub: 'Stay informed', href: '/notices' },
  { icon: '🛒', label: 'Marketplace', sub: 'Buy & sell local', href: '/marketplace' },
  { icon: '💼', label: 'Job Alerts', sub: 'Career growth', href: '/jobs' },
  { icon: '🚕', label: 'Taxi Booking', sub: 'Book a ride', href: '/taxi' },
  { icon: '📂', label: 'Town Directory', sub: 'Find services', href: '/directory' },
  { icon: '🏆', label: 'Competitions', sub: 'Join activities', href: '/competitions' },
];

const spotlight = [
  { title: 'Kut Festival 2024', sub: 'Main Ground • Oct 31', emoji: '🎭', bg: '#fef3c7' },
  { title: 'Inter-Village Football', sub: 'Lamka Stadium', emoji: '⚽', bg: '#dcfce7' },
];

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
};

export default function HomePage() {
  const [updates, setUpdates] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { openSidebar } = useSidebar();

  useEffect(() => {
    async function fetchLatestNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3); // Just show the top 3 latest news

      if (data) setUpdates(data);
      setLoading(false);
    }
    fetchLatestNews();
  }, []);

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={openSidebar} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2.5, background: 'var(--text-primary)', borderRadius: 2 }} />)}
          </button>
          <div style={{ width: 36, height: 36, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🌿</div>
          <span className="section-title" style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px', margin: 0, color: 'white' }}>Gamtin</span>
        </div>
        <Link href="/search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
      </div>

      {/* Hero Banner */}
      <div style={{
        margin: '16px 16px 0',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '24px 20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -20, width: 140, height: 140, background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 40, width: 100, height: 100, background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '28px', marginBottom: 6 }}>🏔️</div>
          <h1 style={{ fontWeight: 700, fontSize: '20px', marginBottom: 6, letterSpacing: '-0.2px' }}>Welcome back, Churachandpur</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Stay connected with your local community today.</p>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Quick Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', marginTop: '4px' }}>
          {quickLinks.map(ql => (
            <Link key={ql.label} href={ql.href} className="card" style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              textDecoration: 'none',
              background: 'var(--bg-card)',
            }}>
              <div style={{ width: 42, height: 42, background: 'var(--green-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                {ql.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{ql.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>{ql.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Community Spotlight */}
        <div className="section-header">
          <span className="section-title">Community Spotlight</span>
          <Link href="/community" className="see-all">See all</Link>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '24px', paddingBottom: '4px' }}>
          {spotlight.map(s => (
            <div key={s.title} className="card" style={{
              flexShrink: 0,
              width: 200,
              overflow: 'hidden',
              background: 'var(--bg-card)',
            }}>
              <div style={{ height: 120, background: 'var(--ochre-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
                {s.emoji}
                <span className="badge badge-green" style={{ position: 'absolute', top: 8, left: 8, background: 'var(--bg-page)', color: 'var(--rust-accent)' }}>FEATURED</span>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Updates (Live News) */}
        <div className="section-header">
          <span className="section-title">Latest Updates</span>
          <Link href="/news" className="see-all">See all</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading updates...</div>
          ) : updates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No live updates found.</div>
          ) : (updates.map((u, i) => (
            <Link key={u.id} href="/news" className="card" style={{ padding: '14px', textDecoration: 'none', background: 'var(--bg-card)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                <div style={{ width: 38, height: 38, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {u.image_emoji || '📰'}
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--green-primary)' }}>{u.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 6 }}>{formatTimestamp(u.created_at)}</span>
                </div>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '10px', color: 'var(--text-secondary)' }}>{u.title}</p>
              <div className="stat-row" style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    {u.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    {u.comments}
                  </span>
                </div>
                <ShareButton
                  title={u.title}
                  text={`Breaking News from Gamtin: ${u.title}`}
                  url={`/news?id=${u.id}`}
                />
              </div>
            </Link>
          )))}
        </div>
      </div>
    </>
  );
}
