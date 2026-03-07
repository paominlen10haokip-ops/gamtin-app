'use client';
import { useState } from 'react';

type ShareButtonProps = {
    title: string;
    text: string;
    url: string;
    imageUrl?: string;
};

export default function ShareButton({ title, text, url, imageUrl }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: fullUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    const shareToWhatsApp = () => {
        const message = encodeURIComponent(`${title}\n${text}\n${fullUrl}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
        setIsOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullUrl);
        alert('Link copied to clipboard!');
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleShare}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Share"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    marginBottom: '10px',
                    background: 'rgba(26, 26, 26, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    width: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    animation: 'sharePop 0.2s ease-out'
                }}>
                    <button onClick={shareToWhatsApp} style={menuItemStyle}>
                        <div style={{ width: 24, height: 24, background: '#25D366', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.373a9.945 9.945 0 004.773 1.215h.004c5.505 0 9.987-4.478 9.989-9.984 0-2.669-1.037-5.176-2.927-7.065A9.925 9.925 0 0012.012 2z" /></svg>
                        </div>
                        <span>WhatsApp</span>
                    </button>
                    <button onClick={copyToClipboard} style={menuItemStyle}>
                        <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                        </div>
                        <span>Copy Link</span>
                    </button>
                </div>
            )}
            <style jsx>{`
                @keyframes sharePop {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}

const menuItemStyle = {
    background: 'none',
    border: 'none',
    padding: '10px 12px',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};
