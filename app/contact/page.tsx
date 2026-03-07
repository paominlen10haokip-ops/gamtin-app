'use client';
import { useState } from 'react';
import TopHeader from '../../components/TopHeader';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [sent, setSent] = useState(false);

    return (
        <>
            <TopHeader title="Contact Us" showBack />
            <div style={{ padding: '16px' }}>
                {/* Contact methods */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                    {[
                        { icon: '📧', label: 'Email', val: 'support@gamtin.in' },
                        { icon: '📞', label: 'Phone', val: '+91 385-2420000' },
                        { icon: '📍', label: 'Office', val: 'Lamka, CCPur' },
                        { icon: '🕐', label: 'Hours', val: 'Mon–Sat, 9–5' },
                    ].map(c => (
                        <div key={c.label} className="card" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '22px' }}>{c.icon}</span>
                            <div style={{ fontWeight: 600, fontSize: '13px', marginTop: 6 }}>{c.label}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>{c.val}</div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                {sent ? (
                    <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                        <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Message Sent!</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '20px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>Send a Message</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Your Name', val: name, setter: setName, type: 'text', placeholder: 'John Doe' },
                                { label: 'Email Address', val: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={f.val}
                                        onChange={e => f.setter(e.target.value)}
                                        placeholder={f.placeholder}
                                        style={{
                                            width: '100%', padding: '11px 14px',
                                            border: '1.5px solid var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '14px', outline: 'none',
                                        }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Message</label>
                                <textarea
                                    value={msg}
                                    onChange={e => setMsg(e.target.value)}
                                    placeholder="How can we help you?"
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '11px 14px',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px', outline: 'none', resize: 'vertical',
                                    }}
                                />
                            </div>
                            <button className="btn-primary" onClick={() => setSent(true)}>Send Message</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
