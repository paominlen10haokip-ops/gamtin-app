'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    {
        href: '/',
        label: 'Home',
        icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={active ? 'white' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        href: '/notices',
        label: 'Notices',
        icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={active ? 'white' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" />
            </svg>
        ),
    },
    {
        href: '/jobs',
        label: 'Jobs',
        icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={active ? 'white' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
    },
    {
        href: '/taxi',
        label: 'Taxi',
        icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={active ? 'white' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
        ),
    },
    {
        href: '/profile',
        label: 'Profile',
        icon: (active: boolean) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={active ? 'white' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

export default function BottomNavBar() {
    const pathname = usePathname();

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '430px',
            height: 'var(--nav-height)',
            background: 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid var(--border)',
            boxShadow: 'var(--shadow-nav)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 100,
            padding: '0 4px',
        }}>
            {navItems.map(({ href, label, icon }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                    <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease',
                            background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                        }}>
                            {icon(active)}
                            <span style={{
                                fontSize: '10px',
                                fontWeight: active ? 700 : 500,
                                color: active ? 'white' : 'var(--text-muted)',
                                letterSpacing: '0.2px',
                            }}>{label}</span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
