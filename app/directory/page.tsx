import Link from 'next/link';
import TopHeader from '../../components/TopHeader';

const categories = [
    { icon: '🏥', label: 'Hospitals' },
    { icon: '🎓', label: 'Schools' },
    { icon: '👮', label: 'Police' },
    { icon: '🏦', label: 'Banks' },
    { icon: '🏛️', label: 'Govt Offices' },
    { icon: '🏨', label: 'Hotels' },
    { icon: '🍽️', label: 'Restaurants' },
    { icon: '🎤', label: 'Karaoke' },
];

const listings = [
    { name: 'Hilltop Hotel', cat: 'HOTELS', catColor: '#8b5cf6', addr: 'View Point Road, Churachandpur, Manipur – 795128', emoji: '🏨' },
    { name: 'District Hospital', cat: 'HOSPITALS', catColor: '#ef4444', addr: 'IB Road, Churachandpur, Manipur – 795128', emoji: '🏥', badge: 'UPDATED' },
    { name: 'Rayburn College', cat: 'SCHOOLS', catColor: '#3b82f6', addr: 'New Lamka, Churachandpur, Manipur – 795006', emoji: '🎓' },
    { name: 'State Bank of India', cat: 'BANKS', catColor: '#0da834', addr: 'Main Road, Churachandpur, Manipur – 795128', emoji: '🏦' },
];

export default function DirectoryPage() {
    return (
        <>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 50,
            }}>
                <Link href="/" style={{ color: 'var(--green-primary)', display: 'flex' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                </Link>
                <span style={{ fontWeight: 700, fontSize: '17px' }}>Town Directory</span>
                <div style={{ width: 22 }} />
            </div>

            <div style={{ padding: '16px' }}>
                {/* Search */}
                <div className="search-bar" style={{ marginBottom: '20px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span style={{ color: 'var(--text-muted)' }}>Search hospitals, schools, banks…</span>
                </div>

                {/* Categories */}
                <div className="section-header">
                    <span className="section-title">Categories</span>
                    <span className="see-all">View All</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                    {categories.map(c => (
                        <div key={c.label} className="card" style={{
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                        }}>
                            <div style={{ width: 48, height: 48, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{c.icon}</div>
                            <span style={{ fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>{c.label}</span>
                        </div>
                    ))}
                </div>

                {/* Featured Listings */}
                <div className="section-header" style={{ marginBottom: '12px' }}>
                    <span className="section-title">Featured Listings</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {listings.map(l => (
                        <div key={l.name} className="card" style={{ padding: '14px' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ width: 52, height: 52, background: '#f0fdf4', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{l.emoji}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-2">
                                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{l.name}</span>
                                        {l.badge && <span className="badge badge-green" style={{ fontSize: '9px' }}>{l.badge}</span>}
                                    </div>
                                    <div style={{ color: l.catColor, fontSize: '12px', fontWeight: 700, marginTop: 2 }}>{l.cat}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 3 }}>📍 {l.addr}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" style={{ marginTop: '12px' }}>
                                <button className="btn-primary" style={{ flex: 1, fontSize: '13px', padding: '9px' }}>📞 Call Now</button>
                                <button style={{ width: 36, height: 36, flexShrink: 0, background: 'var(--green-light)', border: 'none', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    🗺️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map preview */}
                <div style={{
                    marginTop: '20px',
                    height: 120,
                    background: '#d1d5db',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <button style={{
                        background: 'rgba(0,0,0,0.75)', color: 'white', border: 'none',
                        borderRadius: 'var(--radius-full)', padding: '10px 18px',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', gap: 6,
                    }}>🗺️ Open in Map View</button>
                </div>
            </div>
        </>
    );
}
