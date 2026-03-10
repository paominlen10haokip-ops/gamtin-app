'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './LayoutWrapper';
import { useAuth } from './AuthProvider';
import { useState } from 'react';

const mainNavItems = [
    { href: '/', label: 'Home' },
    { href: '/notices', label: 'Notices' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/taxi', label: 'Taxi' },
];

export default function TopNavBar() {
    const pathname = usePathname();
    const { openSidebar } = useSidebar();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="top-nav-bar">
            {/* Top Border with Tribal aesthetic (CSS pattern) */}
            <div className="tribal-border"></div>

            <div className="top-nav-content">
                <div className="nav-left">
                    <button onClick={openSidebar} className="hamburger-btn" aria-label="Open Sidebar">
                        {[0, 1, 2].map(i => (
                            <span key={i} className="hamburger-line" style={{ width: i === 1 ? 16 : 22 }} />
                        ))}
                    </button>

                    <Link href="/" className="logo">
                        <div className="logo-icon">🌿</div>
                        <span className="logo-text">Gamtin</span>
                    </Link>
                </div>

                <div className="nav-center">
                    {mainNavItems.map(({ href, label }) => {
                        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <Link key={href} href={href} className={`nav-link ${active ? 'active' : ''}`}>
                                {label}
                            </Link>
                        )
                    })}
                </div>

                <div className="nav-right">
                    <Link href="/search" className="icon-link">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </Link>
                    <Link href="/notifications" className="icon-link relative-icon">
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="unread-dot" />
                    </Link>
                    <Link href={user ? "/profile" : "/auth"} className="profile-btn">
                        {user ? 'Profile' : 'Sign In'}
                    </Link>
                </div>
            </div>

            {/* Mobile Horizontal Scrolling Menu */}
            <div className="mobile-nav-scroll">
                {mainNavItems.map(({ href, label }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href} className={`mobile-nav-link ${active ? 'active' : ''}`}>
                            {label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}
