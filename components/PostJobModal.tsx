'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

type PostJobModalProps = {
    onClose: () => void;
    onSuccess: () => void;
};

const CATEGORIES = ['Teaching', 'Healthcare', 'Logistics', 'Tech', 'Govt', 'Finance', 'Sales', 'General'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const SALARY_OPTIONS = ['Negotiable', 'Up to ₹10,000/mo', '₹10k–₹20k/mo', '₹20k–₹35k/mo', '₹35k–₹50k/mo', '₹50k+/mo'];

const EMOJIS = ['💼', '🏥', '🚚', '💻', '🏛️', '💰', '📊', '🎓', '🔧', '🧑‍🍳', '🌾', '📱', '🏗️', '✂️', '🎨', '📦'];
const BG_COLORS = [
    { label: 'Forest', value: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' },
    { label: 'Ocean', value: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)' },
    { label: 'Sunset', value: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)' },
    { label: 'Midnight', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { label: 'Emerald', value: 'linear-gradient(135deg, #022c22 0%, #14532d 100%)' },
    { label: 'Violet', value: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)' },
    { label: 'Rose', value: 'linear-gradient(135deg, #4c0519 0%, #881337 100%)' },
    { label: 'Amber', value: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)' },
];

const COMPANY_COLORS = ['#11d442', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#ef4444'];

const TOTAL_STEPS = 5;

export default function PostJobModal({ onClose, onSuccess }: PostJobModalProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [published, setPublished] = useState(false);

    // Step 1: Basics
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');

    // Step 2: Details
    const [category, setCategory] = useState('General');
    const [jobType, setJobType] = useState('Full-time');
    const [salaryRange, setSalaryRange] = useState('Negotiable');
    const [companyColor, setCompanyColor] = useState('#11d442');

    // Step 3: Description
    const [description, setDescription] = useState('');
    const [reqInput, setReqInput] = useState('');
    const [requirements, setRequirements] = useState<string[]>([]);

    // Step 4: Visuals
    const [emoji, setEmoji] = useState('💼');
    const [emojiBg, setEmojiBg] = useState('linear-gradient(135deg, #064e3b 0%, #065f46 100%)');

    const addReq = () => {
        const trimmed = reqInput.trim();
        if (trimmed && requirements.length < 8) {
            setRequirements(prev => [...prev, trimmed]);
            setReqInput('');
        }
    };
    const removeReq = (i: number) => setRequirements(prev => prev.filter((_, idx) => idx !== i));

    const validateStep = () => {
        if (step === 1) return title.trim() && company.trim() && location.trim();
        if (step === 3) return description.trim().length >= 20;
        return true;
    };

    const handlePublish = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const { error: insertError } = await supabase.from('jobs').insert({
                user_id: user.id,
                title,
                company,
                company_color: companyColor,
                location,
                job_type: jobType,
                category,
                salary_range: salaryRange,
                description,
                requirements: requirements.join('\n'),
                emoji,
                emoji_bg: emojiBg,
                cta: 'Apply',
                cta_style: 'primary',
            });
            if (insertError) throw insertError;
            setPublished(true);
        } catch (err: any) {
            setError(err.message || 'Failed to publish job.');
        } finally {
            setLoading(false);
        }
    };

    const progress = (step / TOTAL_STEPS) * 100;

    if (published) return <SuccessScreen onClose={() => { onSuccess(); onClose(); }} jobTitle={title} />;

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                background: 'linear-gradient(180deg, #0f1a0f 0%, #0a120a 100%)',
                width: '100%', maxWidth: '480px',
                borderRadius: '32px 32px 0 0',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
                maxHeight: '92vh',
                display: 'flex', flexDirection: 'column',
                animation: 'sheetUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                overflow: 'hidden',
            }}>
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
                </div>

                {/* Header */}
                <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Step {step} of {TOTAL_STEPS}
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginTop: 2 }}>
                            {step === 1 && 'Job Basics'}
                            {step === 2 && 'Job Details'}
                            {step === 3 && 'Description'}
                            {step === 4 && 'Pick Visuals'}
                            {step === 5 && 'Preview & Publish'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
                        color: 'white', width: 36, height: 36, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div style={{ margin: '0 24px', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', width: `${progress}%`, borderRadius: 2,
                        background: 'linear-gradient(90deg, #11d442, #0aff50)',
                        transition: 'width 0.4s ease',
                        boxShadow: '0 0 10px rgba(17,212,66,0.5)',
                    }} />
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {step === 1 && <Step1 title={title} setTitle={setTitle} company={company} setCompany={setCompany} location={location} setLocation={setLocation} />}
                    {step === 2 && <Step2 category={category} setCategory={setCategory} jobType={jobType} setJobType={setJobType} salaryRange={salaryRange} setSalaryRange={setSalaryRange} companyColor={companyColor} setCompanyColor={setCompanyColor} />}
                    {step === 3 && <Step3 description={description} setDescription={setDescription} reqInput={reqInput} setReqInput={setReqInput} requirements={requirements} addReq={addReq} removeReq={removeReq} />}
                    {step === 4 && <Step4 emoji={emoji} setEmoji={setEmoji} emojiBg={emojiBg} setEmojiBg={setEmojiBg} />}
                    {step === 5 && <Step5Preview title={title} company={company} companyColor={companyColor} location={location} jobType={jobType} category={category} salaryRange={salaryRange} description={description} requirements={requirements} emoji={emoji} emojiBg={emojiBg} />}
                    {error && <div style={{ color: '#ff6b6b', fontSize: '13px', fontWeight: 500, padding: '10px 16px', background: 'rgba(255,107,107,0.08)', borderRadius: 10 }}>⚠️ {error}</div>}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px 28px', display: 'flex', gap: 12 }}>
                    {step > 1 && (
                        <button onClick={() => setStep(s => s - 1)} style={{
                            flex: 1, height: 52, borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        }}>
                            ← Back
                        </button>
                    )}
                    {step < TOTAL_STEPS ? (
                        <button onClick={() => validateStep() && setStep(s => s + 1)} style={{
                            flex: 2, height: 52, borderRadius: 16, border: 'none',
                            background: validateStep() ? 'var(--green-primary)' : 'rgba(255,255,255,0.08)',
                            color: validateStep() ? 'white' : 'rgba(255,255,255,0.3)',
                            fontWeight: 800, fontSize: 16, cursor: validateStep() ? 'pointer' : 'not-allowed',
                            boxShadow: validateStep() ? '0 4px 20px rgba(17,212,66,0.35)' : 'none',
                            transition: 'all 0.2s',
                        }}>
                            Continue →
                        </button>
                    ) : (
                        <button onClick={handlePublish} disabled={loading} style={{
                            flex: 2, height: 52, borderRadius: 16, border: 'none',
                            background: 'var(--green-primary)',
                            color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(17,212,66,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            opacity: loading ? 0.7 : 1,
                        }}>
                            {loading ? <Spinner /> : '🚀 Publish Job'}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes sheetUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .pj-input {
                    width: 100%;
                    padding: 14px 16px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .pj-input:focus { border-color: var(--green-primary); background: rgba(17,212,66,0.04); }
                .pj-input::placeholder { color: rgba(255,255,255,0.25); }
                .pj-label { display: block; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.45); margin-bottom: 8px; letter-spacing: 0.06em; text-transform: uppercase; }
                .pj-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
                .pj-chip { padding: 8px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
                .pj-chip.active { border-color: var(--green-primary); background: rgba(17,212,66,0.12); color: var(--green-primary); }
                .pj-section-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
            `}</style>
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 1: Basics
// ──────────────────────────────────────────────────────────────────────────────
function Step1({ title, setTitle, company, setCompany, location, setLocation }: any) {
    return (
        <>
            <div>
                <label className="pj-label">Job Title *</label>
                <input className="pj-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Primary School Teacher" />
            </div>
            <div>
                <label className="pj-label">Company / Organisation *</label>
                <input className="pj-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Zion Academy" />
            </div>
            <div>
                <label className="pj-label">Location *</label>
                <input className="pj-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Churachandpur, Manipur" />
            </div>
        </>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 2: Details
// ──────────────────────────────────────────────────────────────────────────────
function Step2({ category, setCategory, jobType, setJobType, salaryRange, setSalaryRange, companyColor, setCompanyColor }: any) {
    return (
        <>
            <div>
                <p className="pj-section-title">Category</p>
                <div className="pj-chip-grid">
                    {CATEGORIES.map(c => (
                        <span key={c} className={`pj-chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</span>
                    ))}
                </div>
            </div>
            <div>
                <p className="pj-section-title">Job Type</p>
                <div className="pj-chip-grid">
                    {JOB_TYPES.map(t => (
                        <span key={t} className={`pj-chip${jobType === t ? ' active' : ''}`} onClick={() => setJobType(t)}>{t}</span>
                    ))}
                </div>
            </div>
            <div>
                <p className="pj-section-title">Salary Range</p>
                <div className="pj-chip-grid">
                    {SALARY_OPTIONS.map(s => (
                        <span key={s} className={`pj-chip${salaryRange === s ? ' active' : ''}`} onClick={() => setSalaryRange(s)}>{s}</span>
                    ))}
                </div>
            </div>
            <div>
                <p className="pj-section-title">Brand Color</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {COMPANY_COLORS.map(c => (
                        <div key={c} onClick={() => setCompanyColor(c)} style={{
                            width: 36, height: 36, borderRadius: '50%', background: c, cursor: 'pointer',
                            border: companyColor === c ? '3px solid white' : '3px solid transparent',
                            boxShadow: companyColor === c ? `0 0 12px ${c}80` : 'none',
                            transition: 'all 0.15s',
                        }} />
                    ))}
                </div>
            </div>
        </>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 3: Description & Requirements
// ──────────────────────────────────────────────────────────────────────────────
function Step3({ description, setDescription, reqInput, setReqInput, requirements, addReq, removeReq }: any) {
    return (
        <>
            <div>
                <label className="pj-label">Job Description * <span style={{ color: description.length < 20 ? '#ff6b6b' : 'var(--green-primary)', fontWeight: 600 }}>({description.length} chars, min 20)</span></label>
                <textarea
                    className="pj-input"
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the role, responsibilities, and what makes this job special..."
                    style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
            </div>
            <div>
                <label className="pj-label">Key Requirements (up to 8)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        className="pj-input"
                        value={reqInput}
                        onChange={e => setReqInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addReq())}
                        placeholder="e.g. B.Ed degree"
                        style={{ flex: 1 }}
                    />
                    <button onClick={addReq} style={{
                        padding: '0 18px', borderRadius: 14, background: 'var(--green-primary)', border: 'none',
                        color: 'white', fontWeight: 800, fontSize: 18, cursor: 'pointer', flexShrink: 0, height: 48,
                    }}>+</button>
                </div>
                {requirements.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                        {requirements.map((r: string, i: number) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px', borderRadius: 12, background: 'rgba(17,212,66,0.06)',
                                border: '1px solid rgba(17,212,66,0.15)',
                            }}>
                                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>✓ {r}</span>
                                <button onClick={() => removeReq(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16, lineHeight: 1, padding: '0 4px' }}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 4: Visuals
// ──────────────────────────────────────────────────────────────────────────────
function Step4({ emoji, setEmoji, emojiBg, setEmojiBg }: any) {
    return (
        <>
            {/* Live Preview */}
            <div style={{
                height: 130, borderRadius: 20, background: emojiBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 70, boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                transition: 'background 0.3s',
                marginBottom: 4,
            }}>
                {emoji}
            </div>

            <div>
                <p className="pj-section-title">Choose Emoji</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
                    {EMOJIS.map(e => (
                        <div key={e} onClick={() => setEmoji(e)} style={{
                            fontSize: 26, textAlign: 'center', padding: '8px 4px', borderRadius: 12, cursor: 'pointer',
                            background: emoji === e ? 'rgba(17,212,66,0.15)' : 'rgba(255,255,255,0.04)',
                            border: emoji === e ? '1px solid var(--green-primary)' : '1px solid transparent',
                            transition: 'all 0.15s',
                        }}>{e}</div>
                    ))}
                </div>
            </div>

            <div>
                <p className="pj-section-title">Background Gradient</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {BG_COLORS.map(bg => (
                        <div key={bg.label} onClick={() => setEmojiBg(bg.value)} style={{
                            height: 56, borderRadius: 14, background: bg.value, cursor: 'pointer',
                            border: emojiBg === bg.value ? '2px solid white' : '2px solid transparent',
                            boxShadow: emojiBg === bg.value ? '0 4px 16px rgba(0,0,0,0.5)' : 'none',
                            transition: 'all 0.15s',
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6,
                        }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{bg.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 5: Preview
// ──────────────────────────────────────────────────────────────────────────────
function Step5Preview({ title, company, companyColor, location, jobType, category, salaryRange, description, requirements, emoji, emojiBg }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textAlign: 'center' }}>This is how your job will appear to candidates</p>

            {/* Mock Job Card */}
            <div style={{
                borderRadius: 24, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}>
                <div style={{ height: 130, background: emojiBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70 }}>
                    {emoji}
                </div>
                <div style={{ padding: '16px', background: '#111b11' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 18, color: 'white', lineHeight: 1.2 }}>{title || 'Job Title'}</h3>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3, flexShrink: 0, marginLeft: 8 }}>Just now</span>
                    </div>
                    <div style={{ color: companyColor, fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{company || 'Company Name'}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>📍 {location || 'Location'}</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>🗂️ {jobType}</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>🏷️ {category}</span>
                    </div>
                    <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(17,212,66,0.08)', border: '1px solid rgba(17,212,66,0.15)', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: 'var(--green-primary)', fontWeight: 700 }}>💰 {salaryRange}</span>
                    </div>
                    {description && (
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 12 }}>
                            {description.slice(0, 120)}{description.length > 120 ? '...' : ''}
                        </p>
                    )}
                    {requirements.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Requirements</p>
                            {requirements.slice(0, 3).map((r: string, i: number) => (
                                <span key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>✓ {r}</span>
                            ))}
                            {requirements.length > 3 && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>+{requirements.length - 3} more</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Success Screen
// ──────────────────────────────────────────────────────────────────────────────
function SuccessScreen({ onClose, jobTitle }: { onClose: () => void; jobTitle: string }) {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            padding: 24, flexDirection: 'column', gap: 24, textAlign: 'center',
            animation: 'fadeIn 0.4s ease',
        }}>
            <div style={{ fontSize: 80, animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}>🎉</div>
            <div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 8 }}>Job Published!</h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--green-primary)' }}>{jobTitle}</strong> is now live and visible to candidates in Churachandpur.
                </p>
            </div>
            <button onClick={onClose} style={{
                padding: '16px 40px', borderRadius: 20, background: 'var(--green-primary)',
                border: 'none', color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(17,212,66,0.4)',
            }}>
                View Job Board →
            </button>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}

function Spinner() {
    return (
        <div style={{
            width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white', borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
        }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
