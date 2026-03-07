'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopHeader from '../../components/TopHeader';
import { useAuth } from '../../components/AuthProvider';

type SettingItem = {
    icon: string;
    label: string;
    href?: string;
    val?: string | null;
    toggle?: boolean;
    on?: boolean;
};

type SettingSection = {
    title: string;
    items: SettingItem[];
};

export default function SettingsPage() {
    const { profile, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading settings...</div>;
    }

    const settingsSections: SettingSection[] = [
        {
            title: 'Account',
            items: [
                { icon: '👤', label: 'Edit Profile' },
                { icon: '🔒', label: 'Change Password' },
                { icon: '📱', label: 'Phone Number', val: profile?.phone_number || 'Add phone number' },
            ],
        },
        {
            title: 'Notifications',
            items: [
                { icon: '🔔', label: 'Push Notifications', toggle: true, on: true },
                { icon: '📢', label: 'Public Notice Alerts', toggle: true, on: true },
                { icon: '💼', label: 'Job Alerts', toggle: true, on: false },
            ],
        },
        {
            title: 'App',
            items: [
                { icon: '🌍', label: 'Language', val: 'English' },
                { icon: '🎨', label: 'Theme', val: 'Dark' },
                { icon: '📦', label: 'App Version', val: '1.0.0' },
            ],
        },
        {
            title: 'Legal',
            items: [
                { icon: '📄', label: 'Terms of Service' },
                { icon: '🔐', label: 'Privacy Policy' },
                { icon: '❓', label: 'Help & FAQ', href: '/faq' },
            ],
        },
    ];

    return (
        <>
            <TopHeader title="Settings" showBack />
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {settingsSections.map(section => (
                    <div key={section.title}>
                        <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', paddingLeft: '4px' }}>
                            {section.title}
                        </div>
                        <div className="card">
                            {section.items.map((item, i) => {
                                const Content = (
                                    <div
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '14px 16px',
                                            borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                                            cursor: 'pointer',
                                            width: '100%',
                                            textDecoration: 'none',
                                            color: 'inherit'
                                        }}>
                                        <div className="flex items-center gap-3">
                                            <span style={{ fontSize: '18px', width: 24 }}>{item.icon}</span>
                                            <span style={{ fontSize: '15px', fontWeight: 500 }}>{item.label}</span>
                                        </div>
                                        {item.toggle ? (
                                            <div style={{
                                                width: 44, height: 24,
                                                background: item.on ? 'var(--green-primary)' : '#d1d5db',
                                                borderRadius: 12,
                                                position: 'relative',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 3, left: item.on ? 23 : 3,
                                                    width: 18, height: 18,
                                                    background: 'white',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    transition: 'left 0.2s',
                                                }} />
                                            </div>
                                        ) : item.val !== undefined ? (
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.val}</span>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                        )}
                                    </div>
                                );

                                if (item.href) {
                                    return (
                                        <Link key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {Content}
                                        </Link>
                                    );
                                }

                                return <div key={item.label}>{Content}</div>;
                            })}
                        </div>
                    </div>
                ))}

                {/* Danger zone */}
                <button style={{
                    width: '100%', padding: '14px',
                    background: 'white', border: '1.5px solid #fee2e2',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--red-alert)', fontWeight: 700, fontSize: '15px',
                    cursor: 'pointer',
                }}>🗑️ Delete Account</button>
            </div>
        </>
    );
}
