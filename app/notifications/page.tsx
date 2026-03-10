'use client';
import Link from 'next/link';
import TopHeader from '@/components/TopHeader';

type Notification = {
    id: number;
    icon: string;
    iconBg: string;
    title: string;
    body: string;
    time: string;
    unread: boolean;
    href: string;           // ← source page link
    category: string;       // ← small label shown under timestamp
};

const notifications: Notification[] = [
    {
        id: 1,
        icon: '🚨',
        iconBg: 'rgba(239, 68, 68, 0.18)',
        title: 'Emergency Notice',
        body: 'Water supply interrupted in Zenhang Lamka area.',
        time: '2 min ago',
        unread: true,
        href: '/notices',
        category: 'Public Notices',
    },
    {
        id: 2,
        icon: '💬',
        iconBg: 'var(--green-light)',
        title: 'New Community Reply',
        body: 'Kimboi replied to your post about road repairs.',
        time: '1 hour ago',
        unread: true,
        href: '/community',
        category: 'Community',
    },
    {
        id: 3,
        icon: '💼',
        iconBg: 'var(--green-light)',
        title: 'New Job Alert',
        body: 'Staff Nurse position posted at District Hospital CCPur.',
        time: '3 hours ago',
        unread: true,
        href: '/jobs',
        category: 'Job Alerts',
    },
    {
        id: 4,
        icon: '📢',
        iconBg: 'rgba(59, 130, 246, 0.18)',
        title: 'Public Notice',
        body: 'Annual Town Hall Meeting scheduled for next Friday.',
        time: 'Yesterday',
        unread: false,
        href: '/notices',
        category: 'Public Notices',
    },
    {
        id: 5,
        icon: '🚕',
        iconBg: 'rgba(245, 158, 11, 0.18)',
        title: 'Ride Completed',
        body: 'Your taxi ride to Lamka Market has been completed. Rate your driver.',
        time: '2 days ago',
        unread: false,
        href: '/profile/rides',
        category: 'Taxi',
    },
    {
        id: 6,
        icon: '🛒',
        iconBg: 'rgba(168, 85, 247, 0.18)',
        title: 'Marketplace Update',
        body: 'Your listed item "Bamboo Craft Basket" received an inquiry.',
        time: '3 days ago',
        unread: false,
        href: '/marketplace',
        category: 'Marketplace',
    },
];

// Category label colours
const categoryColors: Record<string, string> = {
    'Public Notices': '#3b82f6',
    'Community': '#11d442',
    'Job Alerts': '#11d442',
    'Taxi': '#f59e0b',
    'Marketplace': '#a855f7',
};

export default function NotificationsPage() {
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div style={{ color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TopHeader title="Notifications" showBack showBell={false} />

            {/* Unread count pill */}
            {unreadCount > 0 && (
                <div style={{ padding: '10px 20px 4px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 700, color: 'var(--green-primary)',
                        background: 'rgba(17,212,66,0.08)', borderRadius: 20, padding: '4px 12px',
                        border: '1px solid rgba(17,212,66,0.15)',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-primary)', display: 'inline-block' }} />
                        {unreadCount} unread
                    </span>
                </div>
            )}

            <div style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
                {notifications.map((n, i) => (
                    <Link
                        key={n.id}
                        href={n.href}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '14px',
                            padding: '16px 20px',
                            background: n.unread ? 'rgba(255,255,255,0.04)' : 'transparent',
                            borderBottom: '1px solid var(--border)',
                            transition: 'background 0.15s',
                            cursor: 'pointer',
                            position: 'relative',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = n.unread ? 'rgba(255,255,255,0.04)' : 'transparent')}
                        >
                            {/* Unread left bar */}
                            {n.unread && (
                                <div style={{
                                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                    width: 3, height: '60%', borderRadius: '0 2px 2px 0',
                                    background: 'var(--green-primary)',
                                    boxShadow: '0 0 8px rgba(17,212,66,0.6)',
                                }} />
                            )}

                            {/* Icon */}
                            <div style={{
                                width: 46, height: 46, flexShrink: 0,
                                background: n.iconBg,
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px',
                                border: n.unread ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                            }}>{n.icon}</div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3, gap: 8 }}>
                                    <span style={{
                                        fontWeight: n.unread ? 800 : 600, fontSize: '15px',
                                        color: n.unread ? 'white' : 'var(--text-secondary)',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {n.title}
                                    </span>
                                    {n.unread && (
                                        <span style={{
                                            width: 8, height: 8, flexShrink: 0,
                                            background: 'var(--green-primary)', borderRadius: '50%',
                                            boxShadow: '0 0 8px var(--green-primary)',
                                        }} />
                                    )}
                                </div>

                                <p style={{
                                    fontSize: '13.5px',
                                    color: n.unread ? 'var(--text-secondary)' : 'var(--text-muted)',
                                    lineHeight: '1.5', marginBottom: 6,
                                }}>
                                    {n.body}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>{n.time}</span>
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>·</span>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 700,
                                        color: categoryColors[n.category] || 'var(--text-muted)',
                                        opacity: 0.85,
                                    }}>
                                        {n.category}
                                    </span>
                                </div>
                            </div>

                            {/* Chevron */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}>
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </Link>
                ))}

                {/* Bottom padding for nav bar */}
                <div style={{ height: 'var(--nav-height, 68px)' }} />
            </div>
        </div>
    );
}
