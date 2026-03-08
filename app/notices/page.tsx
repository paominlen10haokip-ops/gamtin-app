'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopHeader from '@/components/TopHeader';
import { supabase, Notice } from '../../lib/supabase';

const typeClassMap: Record<string, string> = {
    'EMERGENCY': 'badge-red',
    'OFFICIAL': 'badge-green',
    'EVENTS': 'badge-blue',
    'UTILITIES': 'badge-orange'
};

export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const router = useRouter();

    useEffect(() => {
        async function fetchNotices() {
            setLoading(true);
            let query = supabase.from('notices').select('*').order('created_at', { ascending: false });

            if (filter !== 'All') {
                query = query.eq('type', filter.toUpperCase());
            }

            const { data, error } = await query;
            if (data) setNotices(data);
            setLoading(false);
        }

        fetchNotices();
    }, [filter]);

    // Format date string to display '2 hours ago', 'Yesterday', or actual date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <TopHeader title="Public Notices" showBack />
            <div style={{ padding: '16px' }}>
                {/* Search */}
                <div className="search-bar" style={{ marginBottom: '14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Search announcements…
                </div>

                {/* Filter chips */}
                <div className="chips" style={{ marginBottom: '20px' }}>
                    {['All', 'Official', 'Emergency', 'Utilities', 'Events'].map((f) => (
                        <span key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)} style={{ cursor: 'pointer' }}>{f}</span>
                    ))}
                </div>

                {/* Notice Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading notices...</div>
                    ) : notices.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No notices found.</div>
                    ) : (notices.map(n => (
                        <div key={n.id} className="card" style={{ padding: '16px' }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                                <span className={`badge ${typeClassMap[n.type] || 'badge-green'}`}>{n.type}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(n.created_at)}</span>
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', lineHeight: '1.4' }}>{n.title}</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>{n.body}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    <span>{n.author_icon}</span>
                                    <span>{n.author}</span>
                                </div>
                                <button className="text-green font-semibold text-sm"
                                    onClick={() => router.push('/news')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    {n.cta} ›
                                </button>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        </>
    );
}
