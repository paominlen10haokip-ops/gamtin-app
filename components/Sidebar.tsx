'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Bell,
    Users,
    Briefcase,
    ShoppingBag,
    Car,
    Trophy,
    Info,
    LogOut,
    X,
    User,
    Store
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
    onLogout?: () => void;
}

const Sidebar = ({ isOpen, onClose, user, onLogout }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: <Home size={20} />, label: 'Home', href: '/' },
        { icon: <Bell size={20} />, label: 'Notices', href: '/notices' },
        { icon: <Users size={20} />, label: 'Community Hub', href: '/community' },
        { icon: <Briefcase size={20} />, label: 'Job Alerts', href: '/jobs' },
        { icon: <ShoppingBag size={20} />, label: 'Marketplace', href: '/marketplace' },
        { icon: <Store size={20} />, label: 'Become a Seller', href: '/marketplace/register' },
        { icon: <Car size={20} />, label: 'Taxi Booking', href: '/taxi' },
        { icon: <Briefcase size={20} />, label: 'Driver Dashboard', href: '/taxi/driver' },
        { icon: <Trophy size={20} />, label: 'Competitions', href: '/competitions' },
        { icon: <Info size={20} />, label: 'About Us', href: '/about' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1000,
                        }}
                    />

                    {/* Sidebar Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '280px',
                            background: 'rgba(25, 25, 20, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                            zIndex: 1001,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px',
                            color: 'white',
                            boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Header / Close */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--green-primary)' }}>GAMTIN</div>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Profile Section */}
                        {user ? (
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                padding: '16px',
                                marginBottom: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'var(--green-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={24} color="#111" />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }} className="truncate">
                                        {user.email?.split('@')[0]}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} className="truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/auth" onClick={onClose} style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '16px',
                                padding: '16px',
                                marginBottom: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                textDecoration: 'none',
                                color: 'white'
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={24} color="rgba(255,255,255,0.5)" />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--green-primary)' }} className="truncate">
                                        Sign In / Register
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} className="truncate">
                                        Create an account to join
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Navigation Links */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                fontSize: '15px',
                                                fontWeight: isActive ? 600 : 400,
                                                background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                                color: isActive ? 'var(--green-primary)' : 'rgba(255,255,255,0.8)',
                                                transition: 'all 0.2s',
                                                border: isActive ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid transparent'
                                            }}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer / Logout */}
                        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            {user && (
                                <button
                                    onClick={onLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        color: '#ff4444',
                                        background: 'none',
                                        border: 'none',
                                        width: '100%',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            )}
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '16px' }}>
                                Gamtin v1.0.4 • Made for Churachandpur
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
