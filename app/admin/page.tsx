'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import TopHeader from '@/components/TopHeader';
import { useSidebar } from '@/components/LayoutWrapper';
import { CheckCircle, XCircle, Clock, ShieldCheck, Car, Briefcase, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user } = useAuth();
    const { openSidebar } = useSidebar();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'taxi' | 'activity'>('taxi');
    const [taxiBookings, setTaxiBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock check for admin. In production, check user metadata or an `admins` table
    const isAdmin = true; // For demo purposes, we will treat the viewer as admin to show the UI

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
        }
    }, [isAdmin, router]);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('taxi_bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setTaxiBookings(data);
            }
            setLoading(false);
        };

        if (isAdmin) {
            fetchBookings();
        }
    }, [isAdmin]);

    const handleUpdateBookingStatus = async (id: number, newStatus: string) => {
        const { error } = await supabase
            .from('taxi_bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setTaxiBookings(prev => prev.map(booking =>
                booking.id === id ? { ...booking, status: newStatus } : booking
            ));
        } else {
            alert('Failed to update booking status.');
        }
    };

    if (!isAdmin) return null;

    const pendingTaxi = taxiBookings.filter(b => b.status === 'Active' || b.status === 'Pending').length;

    return (
        <div style={{ color: 'white', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-app)' }}>
            <TopHeader onMenuClick={openSidebar} title="Admin Portal" />

            <div style={{ padding: '24px 20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,0,0,0))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <ShieldCheck size={28} color="var(--green-primary)" />
                    <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>Command Center</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Oversee platform approvals. Taxi rides require strict admin approval here. Other platform features are transparently managed by users.
                </p>
            </div>

            <div style={{ padding: '0 20px', display: 'flex', gap: '8px', marginBottom: '20px', marginTop: '10px' }}>
                <button
                    onClick={() => setActiveTab('taxi')}
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                        background: activeTab === 'taxi' ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                        color: activeTab === 'taxi' ? '#111' : 'var(--text-secondary)',
                        border: '1px solid ' + (activeTab === 'taxi' ? 'transparent' : 'var(--border)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Car size={16} />
                    Taxi Approvals
                    {pendingTaxi > 0 && (
                        <span style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '99px', fontSize: '10px' }}>{pendingTaxi}</span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                        background: activeTab === 'activity' ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                        color: activeTab === 'activity' ? '#111' : 'var(--text-secondary)',
                        border: '1px solid ' + (activeTab === 'activity' ? 'transparent' : 'var(--border)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <ShieldCheck size={16} />
                    Audit Logs
                </button>
            </div>

            <div style={{ padding: '0 20px' }}>
                {activeTab === 'taxi' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', color: 'var(--green-primary)' }}>Pending & Active Bookings</h2>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading records...</div>
                        ) : taxiBookings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                                <Car size={32} color="var(--border)" style={{ margin: '0 auto 12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No taxi bookings in the system.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {taxiBookings.map((booking) => (
                                    <div key={booking.id} style={{
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                        borderRadius: '16px', padding: '16px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    Booking #{booking.id.toString().padStart(4, '0')}
                                                </div>
                                                <div style={{ fontSize: '15px', fontWeight: 800 }}>{booking.from_location} → {booking.to_location}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    {booking.vehicle_type}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--green-primary)' }}>₹{booking.fare}</div>
                                                <div style={{
                                                    display: 'inline-block', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', marginTop: '4px',
                                                    background: booking.status === 'Completed' ? 'rgba(16,185,129,0.2)' : booking.status === 'Cancelled' || booking.status === 'Rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                                                    color: booking.status === 'Completed' ? '#4ade80' : booking.status === 'Cancelled' || booking.status === 'Rejected' ? '#f87171' : '#fbbf24'
                                                }}>
                                                    {booking.status.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {new Date(booking.created_at).toLocaleString()}
                                        </div>

                                        {(booking.status === 'Active' || booking.status === 'Pending') && (
                                            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                                <button
                                                    onClick={() => handleUpdateBookingStatus(booking.id, 'Completed')}
                                                    style={{ flex: 1, padding: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--green-primary)', borderRadius: '12px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                                                    <CheckCircle size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateBookingStatus(booking.id, 'Rejected')}
                                                    style={{ flex: 1, padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '12px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'activity' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>Transparent Monitoring</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                                Job applications and Marketplace transactions are handled directly between the poster and the applicant.
                                No admin approval is required, but platform health metrics can be viewed here in future updates.
                            </p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                    <ShoppingBag size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Marketplace</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800 }}>Auto-managed</div>
                                </div>
                                <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                    <Briefcase size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Job Apps</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800 }}>Auto-managed</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
