'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Users,
    MapPin,
    Calendar,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Settings,
    MoreVertical,
    Car,
    ChevronRight,
    X,
    Clock,
    Trash2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../components/AuthProvider';

export default function DriverDashboard() {
    const [rides, setRides] = useState<any[]>([]);
    const [showAddRide, setShowAddRide] = useState(false);
    const [selectedRide, setSelectedRide] = useState<any>(null);
    const { user } = useAuth();

    // Form State for new ride
    const [newRide, setNewRide] = useState({
        to_city: '',
        vehicle_details: 'Suzuki Swift (White)',
        fare: '1500',
        total_seats: 4,
        departure_at: '',
        driver_phone: '9876543210'
    });

    useEffect(() => {
        if (user) {
            fetchDriverRides();
        }
    }, [user]);

    async function fetchDriverRides() {
        const { data } = await supabase
            .from('taxi_rides')
            .select('*')
            .eq('driver_id', user?.id)
            .order('departure_at', { ascending: true });
        if (data) setRides(data);
    }

    const handleAddRide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { data, error } = await supabase
            .from('taxi_rides')
            .insert([{
                ...newRide,
                driver_id: user.id,
                available_seats: newRide.total_seats,
                status: 'scheduled'
            }])
            .select();

        if (error) {
            alert('Error adding ride: ' + error.message);
        } else {
            setRides([...rides, ...(data || [])]);
            setShowAddRide(false);
            setNewRide({ ...newRide, to_city: '', departure_at: '' });
        }
    };

    const handleDeleteRide = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ride?')) return;

        const { error } = await supabase
            .from('taxi_rides')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting ride: ' + error.message);
        } else {
            setRides(rides.filter(r => r.id !== id));
            setSelectedRide(null);
        }
    };

    const handleToggleSeat = async (rideId: string, seatIndex: number) => {
        // Optimistic local update for the UI
        setRides(prevRides => prevRides.map(r => {
            if (r.id === rideId) {
                // This is a simplification. Usually we'd have a 'filled_seats' array.
                // For now, let's just toggle the available_seats count for the demo.
                const isCurrentlyFilled = seatIndex < (r.total_seats - r.available_seats);
                const newAvailable = isCurrentlyFilled ? r.available_seats + 1 : r.available_seats - 1;

                // Update in DB (Simulated or actually update available_seats)
                supabase.from('taxi_rides').update({ available_seats: newAvailable }).eq('id', rideId).then();

                return { ...r, available_seats: Math.max(0, Math.min(r.total_seats, newAvailable)) };
            }
            return r;
        }));

        if (selectedRide && selectedRide.id === rideId) {
            const isCurrentlyFilled = seatIndex < (selectedRide.total_seats - selectedRide.available_seats);
            const newAvailable = isCurrentlyFilled ? selectedRide.available_seats + 1 : selectedRide.available_seats - 1;
            setSelectedRide({ ...selectedRide, available_seats: Math.max(0, Math.min(selectedRide.total_seats, newAvailable)) });
        }
    };

    const AddRideModal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
            }}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    background: 'var(--bg-card)',
                    borderTop: '1px solid var(--border)',
                    borderRadius: '32px 32px 0 0',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900 }}>Schedule New Ride</h2>
                    <button onClick={() => setShowAddRide(false)} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleAddRide} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Destination</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Aizawl"
                            value={newRide.to_city}
                            onChange={e => setNewRide({ ...newRide, to_city: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginTop: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vehicle Details</label>
                        <input
                            required
                            type="text"
                            value={newRide.vehicle_details}
                            onChange={e => setNewRide({ ...newRide, vehicle_details: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginTop: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contact Number</label>
                        <input
                            required
                            type="tel"
                            value={newRide.driver_phone}
                            onChange={e => setNewRide({ ...newRide, driver_phone: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginTop: '4px' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fare (₹)</label>
                            <input
                                required
                                type="number"
                                value={newRide.fare}
                                onChange={e => setNewRide({ ...newRide, fare: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginTop: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Seats</label>
                            <input
                                required
                                type="number"
                                value={newRide.total_seats}
                                onChange={e => setNewRide({ ...newRide, total_seats: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginTop: '4px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Departure Time</label>
                        <input
                            required
                            type="datetime-local"
                            value={newRide.departure_at}
                            onChange={e => setNewRide({ ...newRide, departure_at: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginTop: '4px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--green-primary)', border: 'none', color: '#111', fontWeight: 800, marginTop: '12px' }}
                    >
                        Publish Ride
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );

    const DriverHome = () => (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900 }}>Driver Hub</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Welcome back, {user?.user_metadata?.full_name || 'Michael'}!</p>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Settings size={20} />
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px' }}>
                    <TrendingUp size={24} color="var(--green-primary)" style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '24px', fontWeight: 900 }}>₹12,450</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Earned</p>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px' }}>
                    <Users size={24} color="#3b82f6" style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '24px', fontWeight: 900 }}>42</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Riders</p>
                </div>
            </div>

            {/* Scheduled Rides */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800 }}>Your Scheduled Rides</h2>
                <button
                    onClick={() => setShowAddRide(true)}
                    style={{ color: 'var(--green-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none' }}
                >
                    <Plus size={16} /> New Ride
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>
                {rides.length > 0 ? rides.map(ride => (
                    <div
                        key={ride.id}
                        onClick={() => setSelectedRide(ride)}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px', cursor: 'pointer', position: 'relative' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--green-light)', color: 'var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Car size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 800 }}>{ride.to_city}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(ride.departure_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} color="var(--text-muted)" />
                        </div>

                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ width: `${((ride.total_seats - ride.available_seats) / ride.total_seats) * 100}%`, height: '100%', background: 'var(--green-primary)' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {ride.total_seats - ride.available_seats}/{ride.total_seats} SEATS FILLED
                            </p>
                            <p style={{ fontSize: '14px', fontWeight: 900, color: 'var(--green-primary)' }}>₹{ride.fare}</p>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border)', borderRadius: '24px' }}>
                        <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No scheduled rides yet. Tap 'New Ride' to begin.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const RideDetails = ({ ride }: { ride: any }) => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => setSelectedRide(null)} style={{ background: 'none', border: 'none', color: 'white', marginRight: '16px' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '18px', fontWeight: 800, flex: 1 }}>Manage Seats</h2>
                <button onClick={() => handleDeleteRide(ride.id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}>
                    <Trash2 size={20} />
                </button>
            </div>

            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px', marginBottom: '32px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Destination</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '16px' }}>{ride.to_city}</h3>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            <Calendar size={14} /> {new Date(ride.departure_at).toLocaleDateString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            <Users size={14} /> {ride.available_seats} Available
                        </div>
                    </div>
                </div>

                <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Tap seats to mark as filled/available
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
                    {Array.from({ length: ride.total_seats }).map((_, i) => {
                        const seatNum = i + 1;
                        const isFilled = i < (ride.total_seats - ride.available_seats);

                        return (
                            <button
                                key={seatNum}
                                onClick={() => handleToggleSeat(ride.id, i)}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    background: isFilled ? 'var(--green-primary)' : 'var(--bg-card)',
                                    color: isFilled ? '#111' : 'white',
                                    fontSize: '14px',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: isFilled ? '0 8px 16px rgba(16, 185, 129, 0.2)' : 'none'
                                }}
                            >
                                {seatNum}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ padding: '24px 20px', borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={() => setSelectedRide(null)}
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--green-primary)', border: 'none', color: '#111', fontWeight: 800 }}
                >
                    Update Ride Status
                </button>
            </div>
        </div>
    );

    const AccessDeniedView = () => (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', background: 'var(--bg-app)', color: 'white' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--green-primary)' }}>
                <Car size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Driver Hub Access</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '300px', fontSize: '15px' }}>
                Only registered drivers can list rides and manage seats.
            </p>
            <Link href="/taxi/register" style={{
                padding: '16px 32px',
                borderRadius: '16px',
                background: 'var(--green-primary)',
                color: '#111',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
            }}>
                Apply as Driver
            </Link>
            <Link href="/taxi" style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Back to Bookings
            </Link>
        </div>
    );

    if (user && !user.user_metadata?.is_driver) {
        return <AccessDeniedView />;
    }

    return (
        <div style={{ height: 'calc(100vh - 70px)', background: 'var(--bg-app)', color: 'white', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
                {!selectedRide ? (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ height: '100%', overflowY: 'auto' }}
                    >
                        <DriverHome />
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        style={{ height: '100%' }}
                    >
                        <RideDetails ride={selectedRide} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddRide && <AddRideModal />}
            </AnimatePresence>

            <Link
                href="/taxi"
                style={{
                    position: 'fixed',
                    bottom: '90px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border)',
                    borderRadius: '99px',
                    padding: '12px 24px',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '13px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 100,
                    whiteSpace: 'nowrap'
                }}
            >
                <Users size={16} /> Switch to Passenger Mode
            </Link>
        </div>
    );
}
