'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store,
    Upload,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    User,
    Phone,
    MapPin,
    ShieldCheck,
    FileText,
    ShoppingBag,
    Star,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import TopHeader from '../../../components/TopHeader';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../components/AuthProvider';

const storeCategories = [
    { id: 'fashion', label: 'Fashion & Handloom', icon: '👘' },
    { id: 'grocery', label: 'Grocery & Farm Produce', icon: '🧺' },
    { id: 'electronics', label: 'Electronics & Gadgets', icon: '📱' },
    { id: 'crafts', label: 'Local Crafts & Bamboo', icon: '🎋' },
    { id: 'services', label: 'Services & Others', icon: '💼' }
];

export default function SellerRegistrationPage() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({
        storeName: '',
        sellerName: '',
        phone: '',
        location: '',
    });
    const [verified, setVerified] = useState(false);

    const handleNext = async () => {
        if (step === 3) {
            // Update user metadata and database profile to mark as seller
            if (user) {
                await supabase.auth.updateUser({
                    data: { is_seller: true }
                });

                await supabase
                    .from('profiles')
                    .update({ is_seller: true })
                    .eq('id', user.id);
            }
        }
        setStep(s => s + 1);
    };
    const handleBack = () => setStep(s => s - 1);

    const handleVerifySimulate = () => {
        setVerified(true);
    };

    const isStep1Valid = selectedCategory !== '';
    const isStep2Valid = formData.storeName && formData.sellerName && formData.phone && formData.location;
    const isStep3Valid = verified;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'white' }}>
            <TopHeader title="Seller Center" showBack />

            <div style={{ padding: '24px 20px', maxWidth: '500px', margin: '0 auto' }}>
                {/* Progress Hub */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                            width: step === i ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: step >= i ? 'var(--green-primary)' : 'rgba(255,255,255,0.1)',
                            transition: 'all 0.3s'
                        }} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>Start Your Business</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Select your primary category</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                {storeCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: '18px 24px',
                                            borderRadius: '24px',
                                            background: selectedCategory === cat.id ? 'var(--green-primary)' : 'var(--bg-card)',
                                            border: selectedCategory === cat.id ? '1px solid var(--green-primary)' : '1px solid var(--border)',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            color: selectedCategory === cat.id ? '#111' : 'white',
                                            fontWeight: 700
                                        }}
                                    >
                                        <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                                        <span style={{ flex: 1, fontSize: '16px' }}>{cat.label}</span>
                                        {selectedCategory === cat.id && <CheckCircle2 size={20} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>Store Profile</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Help customers find you</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="input-group">
                                    <label style={labelStyle}><ShoppingBag size={14} /> Store Name</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="e.g. Lamka Handlooms"
                                        value={formData.storeName}
                                        onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}><User size={14} /> Owner Name</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Your full legal name"
                                        value={formData.sellerName}
                                        onChange={e => setFormData({ ...formData, sellerName: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}><Phone size={14} /> WhatsApp Number</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="For customer inquiries"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}><MapPin size={14} /> Store Location</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Area / Market in CCPur"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>Verification</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Secure your marketplace account</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '24px',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '50%', background: 'var(--green-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--green-primary)'
                                    }}>
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Store Identification</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                                        Upload your ID proof (Aadhaar/Voter ID) to enable selling privileges.
                                    </p>

                                    <button
                                        onClick={handleVerifySimulate}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '16px',
                                            background: verified ? 'var(--green-light)' : 'rgba(255,255,255,0.05)',
                                            border: verified ? '1px solid var(--green-primary)' : '1px dashed var(--border)',
                                            color: verified ? 'var(--green-primary)' : 'white',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {verified ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                                        {verified ? 'ID Uploaded Successfully' : 'Upload ID Proof'}
                                    </button>
                                </div>

                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    lineHeight: '1.6'
                                }}>
                                    By finishing, you agree to Gamtin's <strong>Marketplace Seller Agreement</strong> and local vending policies of Churachandpur.
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '40px 0' }}
                        >
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--green-primary), #22c55e)',
                                color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                                boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)'
                            }}>
                                <Store size={48} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>Store Created!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '40px' }}>
                                Congratulations! Your store <strong>{formData.storeName}</strong> is now live. You can start listing products immediately.
                            </p>

                            <Link href="/marketplace" style={{
                                display: 'block',
                                width: '100%',
                                padding: '18px',
                                borderRadius: '20px',
                                background: 'var(--green-primary)',
                                color: '#111',
                                fontWeight: 900,
                                textDecoration: 'none',
                                fontSize: '16px',
                                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
                            }}>
                                Start Listing Products
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step < 4 && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '48px' }}>
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '20px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <button
                            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                            onClick={handleNext}
                            style={{
                                flex: 1,
                                padding: '16px',
                                borderRadius: '20px',
                                background: 'var(--green-primary)',
                                color: '#111',
                                fontWeight: 900,
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '16px',
                                opacity: ((step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)) ? 0.4 : 1
                            }}
                        >
                            {step === 3 ? 'Launch Store' : 'Next Step'} <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 800,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
    paddingLeft: '4px'
};
