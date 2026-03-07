'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';

const menuItems = [
    { icon: '📢', label: 'My Public Notices', href: '/notices' },
    { icon: '🔖', label: 'Saved Jobs', href: '/jobs' },
    { icon: '🚕', label: 'My Taxi Bookings', href: '/profile/rides' },
    { icon: '⚙️', label: 'Account Settings', href: '/settings' },
    { icon: '❓', label: 'Help & Support', href: '/faq' },
];

const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 16px',
    textDecoration: 'none',
    color: 'inherit',
    borderBottom: '1px solid var(--border)',
};

export default function ProfilePage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/'); // Redirect to home or auth page
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading user profile...</div>;
    }

    if (!user || !profile) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8f9fa', minHeight: '100vh' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>You are not logged in</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Please log in to view your profile.</p>
                <button
                    onClick={() => router.push('/auth')}
                    className="btn-primary"
                    style={{ padding: '12px 24px', maxWidth: '200px', margin: '0 auto' }}
                >
                    Login / Sign up
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 100, color: 'white' }}>
            {/* Custom Premium Header */}
            <div style={{
                position: 'relative',
                height: '180px',
                background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.2), transparent)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '14px', left: '18px', right: '18px',
                    display: 'flex', justifyContent: 'space-between', zIndex: 10
                }}>
                    <button onClick={() => router.back()} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', backdropFilter: 'blur(8px)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                    </button>
                    <Link href="/settings" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    </Link>
                </div>

                {/* Decorative background shape */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--green-primary)', filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none' }} />
            </div>

            {/* Profile Info Overlay */}
            <div style={{ marginTop: '-60px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
                <div className="card" style={{ padding: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div style={{
                        width: 100, height: 100,
                        background: 'linear-gradient(135deg, #a8d5a2, #5bb89a)',
                        borderRadius: '35%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '48px',
                        margin: '-74px auto 16px',
                        border: '4px solid var(--bg-card)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                        transform: 'rotate(-5deg)'
                    }}>
                        <div style={{ transform: 'rotate(5deg)' }}>{profile.avatar_url || '🧑'}</div>
                    </div>

                    <h2 style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-0.5px', marginBottom: 6 }}>{profile.full_name}</h2>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
                        <span style={{ color: 'var(--green-primary)' }}>📍</span> {profile.location || 'Churachandpur, Manipur'}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                        <button className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '14px' }}>Edit Profile</button>
                        <button style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: '14px', padding: '0 16px', color: 'white' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[{ val: profile.post_count || 0, label: 'POSTS' }, { val: profile.comment_count || 0, label: 'CMTS' }, { val: profile.booking_count || 0, label: 'TRIPS' }].map(s => (
                        <div key={s.label} className="card" style={{ padding: '14px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>{s.val}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Business & Earnings */}
                <div style={{ padding: '28px 4px 12px', fontWeight: 800, fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Business Hubs</div>
                <div className="card" style={{ padding: 0 }}>
                    {profile.is_driver ? (
                        <Link href="/taxi/driver" style={menuItemStyle}>
                            <div className="flex items-center gap-4">
                                <div style={{ width: 42, height: 42, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚕</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--green-primary)' }}>Driver Hub</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage your rides & earnings</div>
                                </div>
                            </div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </Link>
                    ) : (
                        <Link href="/taxi/register" style={menuItemStyle}>
                            <div className="flex items-center gap-4">
                                <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚖</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Apply as Driver</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Earn money with your vehicle</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '10px', background: 'var(--green-light)', padding: '4px 8px', borderRadius: '6px', color: 'var(--green-primary)', fontWeight: 800 }}>OPEN</div>
                        </Link>
                    )}

                    {profile.is_seller ? (
                        <Link href="/marketplace/seller" style={{ ...menuItemStyle, borderBottom: 'none' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ width: 42, height: 42, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏪</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--green-primary)' }}>Seller Hub</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage your inventory & store</div>
                                </div>
                            </div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </Link>
                    ) : (
                        <Link href="/marketplace/register" style={{ ...menuItemStyle, borderBottom: 'none' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Open a Store</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sell products in Marketplace</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '10px', background: 'var(--green-light)', padding: '4px 8px', borderRadius: '6px', color: 'var(--green-primary)', fontWeight: 800 }}>SELL</div>
                        </Link>
                    )}
                </div>

                {/* Activity */}
                <div style={{ padding: '28px 4px 12px', fontWeight: 800, fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Activity</div>
                <div className="card" style={{ padding: 0 }}>
                    {menuItems.map((item, i) => (
                        <Link key={item.label} href={item.href} style={{
                            ...menuItemStyle,
                            borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                            <div className="flex items-center gap-4">
                                <div style={{ fontSize: '20px', width: 28, textAlign: 'center' }}>{item.icon}</div>
                                <span style={{ fontWeight: 600, fontSize: '15px' }}>{item.label}</span>
                            </div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        marginTop: '32px', marginBottom: '80px', padding: '18px', width: '100%',
                        background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)',
                        borderRadius: '24px', color: 'var(--red-alert)', fontWeight: 800, fontSize: '15px',
                        cursor: 'pointer'
                    }}>
                    <span>🚪</span>
                    Logout from Account
                </button>
            </div>
        </div>
    );
}
