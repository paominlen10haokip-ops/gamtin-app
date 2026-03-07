'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Search, User, ArrowLeft, Bell } from 'lucide-react';

interface TopHeaderProps {
    onMenuClick?: () => void;
    title?: string;
    showSearch?: boolean;
    showBack?: boolean;
    showBell?: boolean;
}

const TopHeader = ({ onMenuClick, title = "GAMTIN", showSearch = true, showBack = false, showBell = true }: TopHeaderProps) => {
    const router = useRouter();

    return (
        <header style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(20, 20, 20, 0.4)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={showBack ? () => router.back() : onMenuClick}
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    {showBack ? <ArrowLeft size={20} /> : <Menu size={20} />}
                </button>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    color: 'var(--text-primary)'
                }}>
                    {title}
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {showSearch && (
                    <Link href="/search" style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none'
                    }}>
                        <Search size={18} />
                    </Link>
                )}
                {showBell && (
                    <Link href="/notifications" style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        position: 'relative'
                    }}>
                        <Bell size={18} />
                        <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--green-primary)', borderRadius: '50%', border: '1.5px solid #111' }} />
                    </Link>
                )}
                <Link href="/profile" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--green-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.1)',
                    textDecoration: 'none'
                }}>
                    <User size={18} color="#111" />
                </Link>
            </div>
        </header>
    );
};

export default TopHeader;
