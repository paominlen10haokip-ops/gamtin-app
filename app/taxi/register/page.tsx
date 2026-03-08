'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car,
    Upload,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    User,
    Phone,
    MapPin,
    ShieldCheck,
    FileText,
    Truck,
    Bike
} from 'lucide-react';
import Link from 'next/link';
import TopHeader from '@/components/TopHeader';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../components/AuthProvider';

// Reusing Zap for Auto if needed, or using a custom icon. Lucide doesn't have Auto Rickshaw specifically.
// Let's use Car with a different color or something for now, or Zap for speed.
const Zap = ({ size, color }: { size: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);

const vehicleTypes = [
    { id: 'car', icon: <Car size={24} />, label: 'Taxi Car', desc: 'Standard 4-seater hatchback/sedan' },
    { id: 'auto', icon: <Zap size={24} />, label: 'Auto Rickshaw', desc: 'Local town transport' },
    { id: 'bike', icon: <Bike size={24} />, label: 'Bike Taxi', desc: 'Quick 2-wheeler transport' },
    { id: 'pickup', icon: <Truck size={24} />, label: 'Pickup/Truck', desc: 'Goods & heavy transport' },
];

export default function DriverRegistrationPage() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        vehicleNumber: '',
        licenseNumber: ''
    });
    const [files, setFiles] = useState<{ [key: string]: boolean }>({
        license: false,
        rc: false,
        insurance: false
    });

    const handleNext = async () => {
        if (step === 3) {
            // Update user metadata and database profile to mark as driver
            if (user) {
                await supabase.auth.updateUser({
                    data: { is_driver: true }
                });

                await supabase
                    .from('profiles')
                    .update({ is_driver: true })
                    .eq('id', user.id);
            }
        }
        setStep(s => s + 1);
    };
    const handleBack = () => setStep(s => s - 1);

    const handleFileSimulate = (key: string) => {
        setFiles(prev => ({ ...prev, [key]: true }));
    };

    const isStep1Valid = selectedVehicle !== '';
    const isStep2Valid = formData.fullName && formData.phone && formData.address;
    const isStep3Valid = files.license && files.rc;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'white' }}>
            <TopHeader title="Driver Hub Registration" showBack />

            <div style={{ padding: '24px 20px', maxWidth: '500px', margin: '0 auto' }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: step >= i ? 'var(--green-primary)' : 'rgba(255,255,255,0.1)',
                            transition: 'all 0.3s'
                        }} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Select Vehicle Type</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>What will you be driving with Gamtin?</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {vehicleTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedVehicle(type.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: '20px',
                                            borderRadius: '20px',
                                            background: selectedVehicle === type.id ? 'var(--green-light)' : 'var(--bg-card)',
                                            border: selectedVehicle === type.id ? '1px solid var(--green-primary)' : '1px solid var(--border)',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            color: 'white'
                                        }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: selectedVehicle === type.id ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: selectedVehicle === type.id ? '#111' : 'var(--green-primary)'
                                        }}>
                                            {type.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '16px' }}>{type.label}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{type.desc}</div>
                                        </div>
                                        {selectedVehicle === type.id && <CheckCircle2 size={20} color="var(--green-primary)" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Personal Details</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Tell us about yourself</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="input-group">
                                    <label style={labelStyle}><User size={14} /> Full Name</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Enter your legal name"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}><Phone size={14} /> Phone Number</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={labelStyle}><MapPin size={14} /> Current Address</label>
                                    <textarea
                                        style={{ ...inputStyle, height: '100px', resize: 'none' }}
                                        placeholder="Your locality / building in CCPur"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Verification Documents</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Upload clear photos of your documents</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={uploadBoxStyle} onClick={() => handleFileSimulate('license')}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={iconCircleStyle}><ShieldCheck size={20} /></div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '15px' }}>Driving License</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Front & Back photo required</div>
                                        </div>
                                    </div>
                                    {files.license ? <CheckCircle2 size={24} color="var(--green-primary)" /> : <Upload size={20} color="var(--text-muted)" />}
                                </div>

                                <div style={uploadBoxStyle} onClick={() => handleFileSimulate('rc')}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={iconCircleStyle}><FileText size={20} /></div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '15px' }}>Vehicle RC</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registration Certificate</div>
                                        </div>
                                    </div>
                                    {files.rc ? <CheckCircle2 size={24} color="var(--green-primary)" /> : <Upload size={20} color="var(--text-muted)" />}
                                </div>

                                <div style={uploadBoxStyle} onClick={() => handleFileSimulate('insurance')}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={iconCircleStyle}><ShieldCheck size={20} /></div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '15px' }}>Insurance Policy</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Valid vehicle insurance</div>
                                        </div>
                                    </div>
                                    {files.insurance ? <CheckCircle2 size={24} color="var(--green-primary)" /> : <Upload size={20} color="var(--text-muted)" />}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '40px 0' }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--green-light)',
                                color: 'var(--green-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px'
                            }}>
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Application Submitted!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                                Our team will verify your documents within 24-48 hours. You'll receive a notification and SMS once approved.
                            </p>

                            <Link href="/taxi/driver" style={{
                                display: 'block',
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                background: 'var(--green-primary)',
                                color: '#111',
                                fontWeight: 800,
                                textDecoration: 'none'
                            }}>
                                Go to Driver Dashboard
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step < 4 && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    color: 'white',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <ChevronLeft size={20} /> Back
                            </button>
                        )}
                        <button
                            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                            onClick={handleNext}
                            style={{
                                flex: 2,
                                padding: '16px',
                                borderRadius: '16px',
                                background: 'var(--green-primary)',
                                color: '#111',
                                fontWeight: 800,
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: ((step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)) ? 0.5 : 1
                            }}
                        >
                            {step === 3 ? 'Finish Application' : 'Continue'} <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    paddingLeft: '4px'
};

const uploadBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderRadius: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const iconCircleStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--green-primary)'
};
