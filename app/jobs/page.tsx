'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Job } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import ShareButton from '../../components/ShareButton';
import ApplyJobModal from '../../components/ApplyJobModal';
import PostJobModal from '../../components/PostJobModal';

const FILTERS = ['All', 'Teaching', 'Healthcare', 'Logistics', 'Tech', 'Govt', 'Finance', 'Sales'];

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [myApps, setMyApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [tab, setTab] = useState<'browse' | 'posted' | 'applied'>('browse');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showPostJob, setShowPostJob] = useState(false);
    const [expandedJob, setExpandedJob] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    useEffect(() => {
        if (user) {
            fetchApplicationsReceived();
            fetchMyApplications();
        }
    }, [user]);

    async function fetchJobs() {
        setLoading(true);
        let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (filter !== 'All') query = query.eq('category', filter);
        const { data } = await query;
        if (data) setJobs(data);
        setLoading(false);
    }

    async function fetchApplicationsReceived() {
        if (!user) return;
        const { data } = await supabase
            .from('job_applications')
            .select('*, jobs!inner(*)')
            .eq('jobs.user_id', user.id);
        if (data) setApplications(data);
    }

    async function fetchMyApplications() {
        if (!user) return;
        const { data } = await supabase
            .from('job_applications')
            .select('*, jobs(*)')
            .eq('applicant_id', user.id)
            .order('created_at', { ascending: false });
        if (data) setMyApps(data);
    }

    const handleApply = (job: Job) => {
        if (!user) { router.push('/auth'); return; }
        setSelectedJob(job);
    };

    const handleUpdateStatus = async (appId: string, status: string) => {
        await supabase.from('job_applications').update({ status }).eq('id', appId);
        fetchApplicationsReceived();
    };

    const formatDate = (dateString: string) => {
        const diffMs = Date.now() - new Date(dateString).getTime();
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffHrs / 24);
        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const filteredJobs = jobs.filter(j =>
        search === '' || j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())
    );

    const myPostedJobs = jobs.filter(j => j.user_id === user?.id);

    const statusColor = (s: string) =>
        s === 'approved' ? { bg: 'rgba(17,212,66,0.12)', text: '#11d442' }
            : s === 'rejected' ? { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' }
                : { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.45)' };

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* ── Sticky Header ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(10,18,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
                    <Link href="/" style={{ display: 'flex', color: 'inherit' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </Link>
                    <span style={{ fontWeight: 800, fontSize: '17px' }}>Job Alerts</span>
                    <Link href="/notifications" style={{ display: 'flex', color: 'inherit' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </Link>
                </div>

                {/* ── Tab Bar ── */}
                {user && (
                    <div style={{ display: 'flex', padding: '0 18px 14px', gap: 8 }}>
                        {[
                            { key: 'browse', label: '🔍 Browse' },
                            { key: 'posted', label: `📋 Posted (${myPostedJobs.length})` },
                            { key: 'applied', label: `📨 Applied (${myApps.length})` },
                        ].map(t => (
                            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
                                flex: 1, padding: '8px 6px', borderRadius: 12, border: 'none',
                                background: tab === t.key ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                                color: tab === t.key ? 'white' : 'rgba(255,255,255,0.4)',
                                fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: tab === t.key ? '0 2px 12px rgba(17,212,66,0.3)' : 'none',
                            }}>{t.label}</button>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '16px 16px 0' }}>

                {/* ══════════════════ BROWSE TAB ══════════════════ */}
                {tab === 'browse' && (
                    <>
                        {/* Search */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '12px 16px',
                            border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search jobs in Churachandpur…"
                                style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    color: 'white', fontSize: 14, flex: 1,
                                }}
                            />
                        </div>

                        {/* Filter Chips */}
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
                            {FILTERS.map(f => (
                                <button key={f} onClick={() => setFilter(f)} style={{
                                    padding: '7px 16px', borderRadius: 20, border: 'none', whiteSpace: 'nowrap',
                                    background: filter === f ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                                    color: filter === f ? 'white' : 'rgba(255,255,255,0.5)',
                                    fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: filter === f ? '0 2px 10px rgba(17,212,66,0.3)' : 'none',
                                }}>{f}</button>
                            ))}
                        </div>

                        {/* Job Count */}
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12, fontWeight: 600 }}>
                            {loading ? 'Loading…' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
                        </p>

                        {/* Job Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : filteredJobs.length === 0 ? (
                                <EmptyState icon="🔍" title="No jobs found" sub="Try a different filter or search term" />
                            ) : filteredJobs.map(job => (
                                <JobCard
                                    key={job.id} job={job}
                                    expanded={expandedJob === job.id}
                                    onToggle={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                    onApply={() => handleApply(job)}
                                    formatDate={formatDate}
                                    isOwner={job.user_id === user?.id}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* ══════════════════ POSTED TAB ══════════════════ */}
                {tab === 'posted' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Your Listings</h2>
                            <button onClick={() => setShowPostJob(true)} style={{
                                padding: '8px 16px', borderRadius: 12, background: 'var(--green-primary)',
                                border: 'none', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            }}>+ Post</button>
                        </div>
                        {myPostedJobs.length === 0 ? (
                            <EmptyState icon="📋" title="No jobs posted yet" sub='Tap "+ Post a Job" to create your first listing' />
                        ) : myPostedJobs.map(job => (
                            <PostedJobCard key={job.id} job={job} applications={applications.filter(a => a.job_id === job.id)} onUpdateStatus={handleUpdateStatus} formatDate={formatDate} />
                        ))}
                    </div>
                )}

                {/* ══════════════════ APPLIED TAB ══════════════════ */}
                {tab === 'applied' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>My Applications</h2>
                        {myApps.length === 0 ? (
                            <EmptyState icon="📨" title="No applications yet" sub="Browse jobs and hit Apply!" />
                        ) : myApps.map(app => {
                            const sc = statusColor(app.status);
                            return (
                                <div key={app.id} style={{
                                    padding: 18, borderRadius: 20, background: 'var(--bg-card)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: 16, color: 'white' }}>{app.jobs?.title}</p>
                                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{app.jobs?.company} · {app.jobs?.location}</p>
                                        </div>
                                        <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text, textTransform: 'uppercase', flexShrink: 0 }}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Applied {formatDate(app.created_at)}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── FAB: Post a Job ── */}
            <button
                onClick={() => { if (!user) { router.push('/auth'); return; } setShowPostJob(true); }}
                style={{
                    position: 'fixed',
                    bottom: 'calc(var(--nav-height, 68px) + 16px)',
                    left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--green-primary)',
                    border: 'none', borderRadius: 50,
                    color: 'white', fontWeight: 800, fontSize: 14,
                    padding: '14px 28px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 6px 24px rgba(17,212,66,0.45)',
                    cursor: 'pointer', zIndex: 40,
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Post a Job
            </button>

            {/* ── Modals ── */}
            {selectedJob && (
                <ApplyJobModal
                    jobId={selectedJob.id}
                    jobTitle={selectedJob.title}
                    onClose={() => setSelectedJob(null)}
                    onSuccess={() => { fetchMyApplications(); setSelectedJob(null); }}
                />
            )}
            {showPostJob && (
                <PostJobModal
                    onClose={() => setShowPostJob(false)}
                    onSuccess={() => { fetchJobs(); fetchApplicationsReceived(); }}
                />
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Job Card
// ──────────────────────────────────────────────────────────────────────────────
function JobCard({ job, expanded, onToggle, onApply, formatDate, isOwner }: any) {
    const reqs = job.requirements ? job.requirements.split('\n').filter(Boolean) : [];
    return (
        <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={onToggle}>
            {/* Banner */}
            <div style={{
                height: 110, background: job.emoji_bg || '#f0fdf4',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60,
                position: 'relative',
            }}>
                {job.emoji}
                {isOwner && (
                    <span style={{
                        position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700,
                        padding: '4px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.5)', color: 'white',
                        backdropFilter: 'blur(4px)',
                    }}>YOUR POST</span>
                )}
            </div>

            <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 2 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 17, color: 'white', lineHeight: 1.3, flex: 1 }}>{job.title}</h3>
                    <ShareButton title={`Hiring: ${job.title}`} text={`Check out this job at ${job.company}!`} url={`/jobs?id=${job.id}`} />
                </div>
                <div style={{ color: job.company_color || '#11d442', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{job.company}</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>📍 {job.location}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>🗂️ {job.job_type}</span>
                    {job.salary_range && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>💰 {job.salary_range}</span>}
                </div>

                {/* Expanded details */}
                {expanded && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 12 }} onClick={e => e.stopPropagation()}>
                        {job.description && (
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{job.description}</p>
                        )}
                        {reqs.length > 0 && (
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Requirements</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {reqs.map((r: string, i: number) => (
                                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                            <span style={{ color: 'var(--green-primary)', marginTop: 1, flexShrink: 0 }}>✓</span>
                                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Posted {formatDate(job.created_at)}</span>
                    <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '10px 24px', fontSize: 13, fontWeight: 700 }}
                        onClick={e => { e.stopPropagation(); onApply(); }}
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Posted Job Card (for employer view)
// ──────────────────────────────────────────────────────────────────────────────
function PostedJobCard({ job, applications, onUpdateStatus, formatDate }: any) {
    const [expanded, setExpanded] = useState(false);
    const pendingCount = applications.filter((a: any) => a.status === 'pending').length;

    const statusColor = (s: string) =>
        s === 'approved' ? { bg: 'rgba(17,212,66,0.12)', text: '#11d442' }
            : s === 'rejected' ? { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' }
                : { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.45)' };

    return (
        <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: job.emoji_bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                    {job.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, color: 'white', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{job.job_type} · {formatDate(job.created_at)}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>{applications.length}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>APPLICANTS</div>
                    {pendingCount > 0 && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green-primary)', marginTop: 2 }}>
                            {pendingCount} pending
                        </div>
                    )}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {expanded && applications.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {applications.map((app: any, i: number) => {
                        const sc = statusColor(app.status);
                        return (
                            <div key={app.id} style={{
                                padding: '14px 16px',
                                borderBottom: i < applications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{app.full_name}</p>
                                        <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                                            <a href={`mailto:${app.email}`} style={{ fontSize: 12, color: 'var(--green-primary)', textDecoration: 'none', fontWeight: 600 }}>✉️ Email</a>
                                            <a href={`tel:${app.phone}`} style={{ fontSize: 12, color: 'var(--green-primary)', textDecoration: 'none', fontWeight: 600 }}>📞 Call</a>
                                            {app.resume_url && <a href={app.resume_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--green-primary)', textDecoration: 'none', fontWeight: 600 }}>📄 Resume</a>}
                                        </div>
                                    </div>
                                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text, textTransform: 'uppercase', flexShrink: 0 }}>
                                        {app.status}
                                    </span>
                                </div>
                                {app.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => onUpdateStatus(app.id, 'approved')} style={{
                                            flex: 1, padding: '9px', borderRadius: 12, background: 'var(--green-primary)',
                                            border: 'none', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                        }}>✓ Approve</button>
                                        <button onClick={() => onUpdateStatus(app.id, 'rejected')} style={{
                                            flex: 1, padding: '9px', borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
                                            fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                        }}>✕ Ignore</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {expanded && applications.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    No applications yet
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-card)' }}>
            <div style={{ height: 110, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ height: 20, width: '60%', borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ height: 14, width: '40%', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ height: 14, width: '80%', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
    );
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
    return (
        <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)',
        }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
            <p style={{ fontWeight: 800, fontSize: 17, color: 'white', marginBottom: 8 }}>{title}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{sub}</p>
        </div>
    );
}
