'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

type ApplyJobModalProps = {
    jobId: number;
    jobTitle: string;
    onClose: () => void;
    onSuccess: () => void;
};

export default function ApplyJobModal({ jobId, jobTitle, onClose, onSuccess }: ApplyJobModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [resume, setResume] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            let resumeUrl = null;

            // 1. Upload Resume if provided
            if (resume) {
                const fileExt = resume.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `resumes/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, resume);

                if (uploadError) throw new Error('Failed to upload resume');

                const { data: { publicUrl } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(filePath);

                resumeUrl = publicUrl;
            }

            // 2. Save Application
            const { error: applyError } = await supabase
                .from('job_applications')
                .insert({
                    job_id: jobId,
                    applicant_id: user.id,
                    full_name: fullName,
                    email: user.email,
                    phone: phone,
                    resume_url: resumeUrl,
                    status: 'pending'
                });

            if (applyError) throw applyError;

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>Apply for Job</h2>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--green-primary)', fontWeight: 600, marginBottom: '24px' }}>{jobTitle}</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                        <input
                            type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                            style={inputStyle} placeholder="Your full name"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone Number</label>
                        <input
                            type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                            style={inputStyle} placeholder="e.g. +91 9876543210"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Resume (PDF/DOCX)</label>
                        <input
                            type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files?.[0] || null)}
                            style={{ ...inputStyle, padding: '10px' }}
                        />
                    </div>

                    {error && <div style={{ color: 'var(--red-alert)', fontSize: '13px', fontWeight: 500 }}>⚠️ {error}</div>}

                    <button disabled={loading} type="submit" className="btn-primary" style={{ background: 'var(--green-primary)', color: 'white', marginTop: '10px', height: '52px', fontSize: '16px' }}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
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
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none'
};
