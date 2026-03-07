import TopHeader from '../../components/TopHeader';

const notifications = [
    {
        id: 1,
        icon: '🚨',
        iconBg: 'rgba(239, 68, 68, 0.15)',
        title: 'Emergency Notice',
        body: 'Water supply interrupted in Zenhang Lamka area.',
        time: '2 min ago',
        unread: true,
    },
    {
        id: 2,
        icon: '💬',
        iconBg: 'var(--green-light)',
        title: 'New Community Reply',
        body: 'Kimboi replied to your post about road repairs.',
        time: '1 hour ago',
        unread: true,
    },
    {
        id: 3,
        icon: '💼',
        iconBg: 'var(--green-light)',
        title: 'New Job Alert',
        body: 'Staff Nurse position posted at District Hospital CCPur.',
        time: '3 hours ago',
        unread: true,
    },
    {
        id: 4,
        icon: '📢',
        iconBg: 'rgba(59, 130, 246, 0.15)',
        title: 'Public Notice',
        body: 'Annual Town Hall Meeting scheduled for next Friday.',
        time: 'Yesterday',
        unread: false,
    },
    {
        id: 5,
        icon: '🚕',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        title: 'Ride Completed',
        body: 'Your taxi ride to Lamka Market has been completed. Rate your driver.',
        time: '2 days ago',
        unread: false,
    },
    {
        id: 6,
        icon: '🛒',
        iconBg: 'rgba(168, 85, 247, 0.15)',
        title: 'Marketplace Update',
        body: 'Your listed item "Bamboo Craft Basket" received an inquiry.',
        time: '3 days ago',
        unread: false,
    },
];

export default function NotificationsPage() {
    return (
        <div style={{ color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TopHeader title="Notifications" showBack showBell={false} />
            <div style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '16px 20px',
                        background: n.unread ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: 46, height: 46, flexShrink: 0,
                            background: n.iconBg,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '22px',
                            border: n.unread ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent'
                        }}>{n.icon}</div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                                <span style={{ fontWeight: n.unread ? 800 : 600, fontSize: '15px', color: n.unread ? 'white' : 'var(--text-secondary)' }}>{n.title}</span>
                                {n.unread && (
                                    <span style={{ width: 8, height: 8, background: 'var(--green-primary)', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 8px var(--green-primary)' }} />
                                )}
                            </div>
                            <p style={{ fontSize: '14px', color: n.unread ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: '1.5', marginBottom: 6 }}>{n.body}</p>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{n.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
