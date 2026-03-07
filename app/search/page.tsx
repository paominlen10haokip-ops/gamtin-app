'use client';
import { useState } from 'react';
import Link from 'next/link';

const results = [
    { type: 'Notice', icon: '📢', title: 'Water Supply Interruption', sub: 'Public Notice · 2 hours ago', href: '/notices' },
    { type: 'Job', icon: '💼', title: 'Staff Nurse at District Hospital', sub: 'Job Alert · Posted 2 days ago', href: '/jobs' },
    { type: 'Business', icon: '🏨', title: 'Hilltop Hotel', sub: 'Town Directory · Hotels', href: '/directory' },
    { type: 'Post', icon: '💬', title: 'Inter-Village Football Tournament', sub: 'Community Hub · Sports', href: '/community' },
];

export default function SearchPage() {
    const [query, setQuery] = useState('');

    return (
        <>
            <div style={{
                padding: '14px 18px',
                background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                <Link href="/" style={{ display: 'flex', flexShrink: 0, color: 'inherit' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                </Link>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '10px 16px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search Gamtin…"
                        style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', color: 'white' }}
                        autoFocus
                    />
                </div>
            </div>

            <div style={{ padding: '16px' }}>
                {/* Suggestions */}
                <div className="section-header"><span className="section-title">Suggested</span></div>
                <div className="chips" style={{ marginBottom: '20px' }}>
                    {['Water supply', 'Job vacancy', 'Taxi', 'Market', 'Hospital'].map(s => (
                        <span key={s} className="chip" onClick={() => setQuery(s)} style={{ cursor: 'pointer' }}>{s}</span>
                    ))}
                </div>

                {/* Results */}
                <div className="section-header"><span className="section-title">Recent Results</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {results.map((r, i) => (
                        <Link key={i} href={r.href} style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '13px 4px',
                            borderBottom: '1px solid var(--border)',
                            textDecoration: 'none',
                        }}>
                            <div style={{ width: 40, height: 40, background: 'var(--green-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{r.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{r.title}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.sub}</div>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
