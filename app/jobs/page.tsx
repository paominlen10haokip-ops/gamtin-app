'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Job } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import ShareButton from '../../components/ShareButton';
import ApplyJobModal from '../../components/ApplyJobModal';

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showMyJobs, setShowMyJobs] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchJobs();
        if (user) fetchApplications();
    }, [filter, user]);

    async function fetchJobs() {
        setLoading(true);
        let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

        if (filter !== 'All') {
            query = query.eq('category', filter);
        }

        const { data, error } = await query;
        if (data) setJobs(data);
        setLoading(false);
    }

    async function fetchApplications() {
        if (!user) return;
        // Fetch applications for jobs owned by the user
        const { data, error } = await supabase
            .from('job_applications')
            .select('*, jobs!inner(*)')
            .eq('jobs.user_id', user.id);

        if (data) setApplications(data);
    }

    const handleApply = (job: Job) => {
        if (!user) {
            router.push('/auth');
        } else {
            setSelectedJob(job);
        }
    };

    const handleCreateJob = () => {
        if (!user) {
            router.push('/auth');
        } else {
            alert('Opening Post a Job modal...');
        }
    };

    const handleUpdateStatus = async (appId: string, status: string) => {
        const { error } = await supabase
            .from('job_applications')
            .update({ status })
            .eq('id', appId);

        if (!error) fetchApplications();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 50,
            }}>
                <Link href="/" style={{ display: 'flex', color: 'inherit' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                </Link>
                <span style={{ fontWeight: 700, fontSize: '17px' }}>Job Alerts</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {user && (
                        <button
                            onClick={() => setShowMyJobs(!showMyJobs)}
                            style={{
                                background: showMyJobs ? 'var(--green-primary)' : 'none',
                                border: '1px solid var(--green-primary)',
                                borderRadius: '12px', padding: '6px 12px', fontSize: '12px',
                                color: showMyJobs ? 'white' : 'var(--green-primary)',
                                fontWeight: 600
                            }}
                        >
                            {showMyJobs ? 'Browse All' : 'Applications'}
                        </button>
                    )}
                    <Link href="/notifications" style={{ position: 'relative', display: 'flex', color: 'inherit' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div style={{ padding: '16px' }}>
                {!showMyJobs ? (
                    <>
                        <div className="search-bar" style={{ marginBottom: '14px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Search jobs in Churachandpur
                        </div>

                        <div className="chips" style={{ marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '4px' }}>
                            {['All', 'Teaching', 'Healthcare', 'Logistics', 'Tech', 'Govt', 'Finance', 'Sales'].map((f) => (
                                <span key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)} style={{ cursor: 'pointer', marginRight: '8px' }}>{f}</span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading jobs...</div>
                            ) : jobs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No jobs found.</div>
                            ) : (jobs.map(job => (
                                <div key={job.id} className="card" style={{ overflow: 'hidden' }}>
                                    <div style={{
                                        height: 120,
                                        background: job.emoji_bg || '#f0fdf4',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '60px',
                                    }}>{job.emoji}</div>

                                    <div style={{ padding: '16px' }}>
                                        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                                            <h3 style={{ fontWeight: 800, fontSize: '18px' }}>{job.title}</h3>
                                            <ShareButton
                                                title={`Hiring: ${job.title}`}
                                                text={`Check out this job at ${job.company} in ${job.location}!`}
                                                url={`/jobs?id=${job.id}`}
                                            />
                                        </div>
                                        <div style={{ color: job.company_color || '#11d442', fontWeight: 600, fontSize: '14px', marginBottom: 8 }}>{job.company}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 4 }}>📍 {job.location}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 12 }}>🗂️ {job.job_type}</div>
                                        <div className="flex items-center justify-between">
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Posted {formatDate(job.created_at)}</span>
                                            <button
                                                className={job.cta_style === 'primary' ? 'btn-primary' : 'btn-outline'}
                                                style={{ width: 'auto', padding: '10px 24px', fontSize: '14px', fontWeight: 700 }}
                                                onClick={() => handleApply(job)}
                                            >
                                                {job.cta}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Applications Received</h2>
                        {applications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                <p>No applications received yet for your postings.</p>
                            </div>
                        ) : (
                            applications.map(app => (
                                <div key={app.id} className="card" style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, fontSize: '16px' }}>{app.full_name}</h4>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Applied for: <strong>{app.jobs.title}</strong></p>
                                        </div>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                            background: app.status === 'approved' ? 'rgba(17,212,66,0.1)' : app.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                                            color: app.status === 'approved' ? '#11d442' : app.status === 'rejected' ? '#ef4444' : 'var(--text-muted)',
                                            textTransform: 'uppercase'
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', marginBottom: '16px' }}>
                                        <a href={`mailto:${app.email}`} style={{ color: 'var(--green-primary)', textDecoration: 'none' }}>✉️ Email</a>
                                        <a href={`tel:${app.phone}`} style={{ color: 'var(--green-primary)', textDecoration: 'none' }}>📞 Call</a>
                                        {app.resume_url && (
                                            <a href={app.resume_url} target="_blank" rel="noreferrer" style={{ color: 'var(--green-primary)', textDecoration: 'none' }}>📄 Resume</a>
                                        )}
                                    </div>
                                    {app.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'approved')}
                                                style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'var(--green-primary)', color: 'white', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                style={{ flex: 1, padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                Ignore
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleCreateJob}
                style={{
                    position: 'fixed',
                    bottom: 'calc(var(--nav-height) + 16px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--green-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '12px 24px',
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 4px 14px rgba(17,212,66,0.4)',
                    cursor: 'pointer',
                    zIndex: 100
                }}>+ Post a Job</button>

            {selectedJob && (
                <ApplyJobModal
                    jobId={selectedJob.id}
                    jobTitle={selectedJob.title}
                    onClose={() => setSelectedJob(null)}
                    onSuccess={() => alert('Application submitted successfully!')}
                />
            )}
        </div>
    );
}
