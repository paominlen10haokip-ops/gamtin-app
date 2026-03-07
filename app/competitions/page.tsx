'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import ShareButton from '../../components/ShareButton';

type Competition = {
    id: string;
    title: string;
    description: string;
    category: string;
    organizer: string;
    prize_details: string;
    event_date: string;
    emoji: string;
    image_bg: string;
    status: string;
    competition_type?: string;
};

export default function CompetitionsPage() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
    const [activeTab, setActiveTab] = useState<'browse' | 'results'>('browse');
    const [applying, setApplying] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [submissionText, setSubmissionText] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchCompetitions();
        if (activeTab === 'results') fetchResults();
    }, [activeTab]);

    async function fetchCompetitions() {
        setLoading(true);
        const { data } = await supabase.from('competitions').select('*').order('created_at', { ascending: false });
        if (data) setCompetitions(data);
        setLoading(false);
    }

    async function fetchResults() {
        setLoading(true);
        const { data } = await supabase
            .from('competition_applications')
            .select('*, competitions!inner(*), competition_votes(count)')
            .eq('status', 'approved');

        if (data) {
            // Sort by vote count for results
            const sortedResults = data.sort((a, b) => (b.competition_votes?.[0]?.count || 0) - (a.competition_votes?.[0]?.count || 0));
            setResults(sortedResults);
        }
        setLoading(false);
    }

    const handleVote = async (appId: string, compId: string) => {
        if (!user) return router.push('/auth');
        const { error } = await supabase.from('competition_votes').insert({
            competition_id: compId,
            application_id: appId,
            user_id: user.id
        });

        if (error) {
            if (error.code === '23505') alert('You have already voted in this competition!');
            else alert('Error voting: ' + error.message);
        } else {
            fetchResults();
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedComp) return;
        setApplying(true);

        const { error } = await supabase.from('competition_applications').insert({
            competition_id: selectedComp.id,
            user_id: user.id,
            full_name: fullName,
            phone: phone,
            submission_text: submissionText
        });

        if (error) {
            if (error.code === '23505') alert('You have already applied for this competition!');
            else alert('Error applying: ' + error.message);
        } else {
            alert('Successfully applied for ' + selectedComp.title + '!');
            setSelectedComp(null);
            setFullName('');
            setPhone('');
            setSubmissionText('');
        }
        setApplying(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 50,
            }}>
                <Link href="/" style={{ display: 'flex' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                </Link>
                <span style={{ fontWeight: 700, fontSize: '17px' }}>Town Competitions</span>
                <div style={{ width: 22 }}></div>
            </div>

            <div style={{ padding: '16px' }}>
                {/* Tabs */}
                <div style={{
                    display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)',
                    padding: '4px', borderRadius: '14px', marginBottom: '20px',
                    border: '1px solid var(--border)'
                }}>
                    <button
                        onClick={() => setActiveTab('browse')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, border: 'none',
                            background: activeTab === 'browse' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeTab === 'browse' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >Browse</button>
                    <button
                        onClick={() => setActiveTab('results')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, border: 'none',
                            background: activeTab === 'results' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeTab === 'results' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >Results & Votes</button>
                </div>

                {activeTab === 'browse' ? (
                    <>
                        <div className="search-bar" style={{ marginBottom: '20px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Find activities to join...
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading competitions...</div>
                            ) : (competitions.map(comp => (
                                <div key={comp.id} className="card" style={{ overflow: 'hidden' }}>
                                    <div style={{
                                        height: 140,
                                        background: comp.image_bg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '64px',
                                    }}>{comp.emoji}</div>

                                    <div style={{ padding: '18px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                                                    color: 'var(--ochre-accent)', letterSpacing: '0.5px'
                                                }}>{comp.category}</span>
                                                <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>{comp.title}</h3>
                                            </div>
                                            <ShareButton
                                                title={`Join: ${comp.title}`}
                                                text={`I found this cool competition on Gamtin: ${comp.description}`}
                                                url={`/competitions?id=${comp.id}`}
                                            />
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                                            {comp.description}
                                        </p>

                                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>🗓️</span> <span style={{ color: 'var(--text-secondary)' }}><strong>Date:</strong> {formatDate(comp.event_date)}</span>
                                            </div>
                                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>🏢</span> <span style={{ color: 'var(--text-secondary)' }}><strong>Organizer:</strong> {comp.organizer}</span>
                                            </div>
                                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>🎁</span> <span style={{ color: 'var(--text-secondary)' }}><strong>Prizes:</strong> {comp.prize_details}</span>
                                            </div>
                                        </div>

                                        <button
                                            className="btn-primary"
                                            style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700, background: 'var(--green-primary)', color: 'white' }}
                                            onClick={() => {
                                                if (!user) router.push('/auth');
                                                else setSelectedComp(comp);
                                            }}
                                        >
                                            Apply to Join
                                        </button>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading results...</div>
                        ) : results.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No results yet.</div>
                        ) : (results.map(res => (
                            <div key={res.id} className="card" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green-primary)' }}>{res.competitions.title}</div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 800 }}>{res.full_name}</h4>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-primary)' }}>{res.competition_votes?.[0]?.count || 0}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Votes</div>
                                    </div>
                                </div>
                                {res.submission_text && (
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                                        "{res.submission_text}"
                                    </p>
                                )}
                                <button
                                    className="btn-primary"
                                    style={{ padding: '8px', fontSize: '13px', background: 'var(--green-primary)', color: 'white' }}
                                    onClick={() => handleVote(res.id, res.competition_id)}
                                >
                                    Vote for Entry
                                </button>
                            </div>
                        )))}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {selectedComp && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '24px'
                }}>
                    <div style={{
                        background: '#1a1a1a', padding: '28px', borderRadius: '28px',
                        width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        position: 'relative',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>Join Competition</h2>
                                <p style={{ fontSize: '14px', color: 'var(--green-primary)', fontWeight: 600 }}>{selectedComp.title}</p>
                            </div>
                            <button onClick={() => setSelectedComp(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                                <input
                                    type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone Number</label>
                                <input
                                    type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone"
                                    style={inputStyle}
                                />
                            </div>
                            {selectedComp.competition_type === 'article' && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Article Entry</label>
                                    <textarea
                                        required value={submissionText} onChange={(e) => setSubmissionText(e.target.value)}
                                        placeholder="Write your submission here..."
                                        style={{ ...inputStyle, minHeight: '120px', resize: 'none', borderRadius: '16px' }}
                                    />
                                </div>
                            )}
                            <button disabled={applying} type="submit" className="btn-primary" style={{ background: 'var(--green-primary)', color: 'white', marginTop: '10px', height: '52px', fontSize: '16px' }}>
                                {applying ? 'Submitting...' : 'Confirm Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
};
