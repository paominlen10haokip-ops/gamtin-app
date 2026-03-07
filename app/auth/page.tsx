'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            console.log('Initiating auth for:', email, isLogin ? '(Login)' : '(Signup)');
            if (isLogin) {
                const { error, data } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    console.error('Login error:', error);
                    throw error;
                }
                console.log('Login successful:', data);
                router.push('/');
                router.refresh();
            } else {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (error) {
                    console.error('Signup error:', error);
                    throw error;
                }
                console.log('Signup initiated successfully:', data);
                // Transition to OTP verification step
                setIsVerifying(true);
                setSuccessMsg('Confirmation code sent! Please check your email.');
            }
        } catch (err: any) {
            console.error('Caught error during handleAuth:', err);
            if (err.message.includes('already been registered')) {
                setError('This email is already registered. Please sign in instead!');
            } else if (err.message.includes('Database error saving new user')) {
                setError('There was a technical issue creating your profile. Please try a different email or contact support.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'signup'
            });
            if (error) throw error;
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '32px', marginTop: '20px' }}
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 1, -1, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '200px', height: '200px', margin: '0 auto 24px',
                        borderRadius: 'var(--radius-full)', overflow: 'hidden',
                        boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
                        border: '4px solid rgba(255,255,255,0.1)',
                        position: 'relative'
                    }}
                >
                    <img
                        src="/birds_nest.png"
                        alt="Birds feeding young ones"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </motion.div>

                <h1 style={{ fontWeight: 800, fontSize: '28px', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Welcome to Gamtin Community</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    {isVerifying ? 'Check your email for the code' : (isLogin ? 'Sign in to your account' : 'Join our caring community')}
                </p>
            </motion.div>

            <motion.div
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ flex: 1, padding: '24px', maxWidth: '400px', margin: '0 auto', width: '100%' }}
            >
                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '20px', fontWeight: 500, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {error}
                    </motion.div>
                )}

                {successMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(17, 212, 66, 0.15)', color: '#4ade80', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '20px', fontWeight: 500, border: '1px solid rgba(17, 212, 66, 0.2)' }}>
                        {successMsg}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {isVerifying ? (
                        <motion.form
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOtp}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>6-Digit Confirmation Code</label>
                                <input
                                    type="text"
                                    required
                                    value={otpCode}
                                    onChange={e => setOtpCode(e.target.value)}
                                    placeholder="123456"
                                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '18px', outline: 'none', background: 'rgba(255, 255, 255, 0.05)', color: 'white', letterSpacing: '4px', textAlign: 'center' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                {loading ? 'Verifying...' : 'Complete Signup'}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="auth"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleAuth}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            {!isLogin && (
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '15px', outline: 'none', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '15px', outline: 'none', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '15px', outline: 'none', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {!isVerifying && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#11d442', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                        </button>
                    </div>
                )}
            </motion.div>

            <div style={{ textAlign: 'center', paddingBottom: '20px', marginTop: 'auto' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
