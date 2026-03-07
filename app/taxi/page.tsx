'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from '../../components/TopHeader';
import { useSidebar } from '../../components/LayoutWrapper';
import {
    ArrowLeft,
    MapPin,
    Phone,
    MessageCircle,
    Share2,
    Info,
    History,
    Navigation,
    Star,
    Zap,
    Car,
    ChevronDown,
    Trash2,
    Filter,
    CreditCard,
    Clock,
    CheckCircle2,
    Users
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

// Mock Vehicle Types for the selector
const vehicleTypes = [
    { id: 'local', name: 'Local Taxi', price: '150', icon: Car, label: 'Within Town' },
    { id: 'aizawl', name: 'Aizawl Taxi', price: '2500', icon: Navigation, label: 'Interstate', needsCall: true, destination: 'Aizawl' },
    { id: 'kanggui', name: 'Kanggui Taxi', price: '1800', icon: Zap, label: 'Inter-district', needsCall: true, destination: 'Kanggui' },
];

const taxiHistory = [
    {
        id: 1,
        type: 'Hatchback • Suzuki Swift',
        date: 'Oct 24, 2023 • 10:30 AM',
        fare: '150.00',
        status: 'Completed',
        from: 'Zoveng, CCpur',
        to: 'Pearsonmun, CCpur',
        icon: Car
    },
    {
        id: 2,
        type: 'Auto Rickshaw',
        date: 'Oct 22, 2023 • 04:15 PM',
        fare: '80.00',
        status: 'Completed',
        from: 'New Lamka Main Market',
        to: 'District Hospital',
        icon: Zap
    }
];

export default function TaxiPage() {
    const { openSidebar } = useSidebar();
    const [view, setView] = useState<'booking' | 'tracking' | 'history' | 'seat_selection'>('booking');
    const [selectedVehicleId, setSelectedVehicleId] = useState('local');
    const [tab, setTab] = useState<'completed' | 'cancelled'>('completed');
    const [scheduledRides, setScheduledRides] = useState<any[]>([]);
    const [realHistory, setRealHistory] = useState<any[]>([]);
    const [selectedRide, setSelectedRide] = useState<any>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [bookedSeats, setBookedSeats] = useState<number[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchData() {
            // Fetch scheduled rides
            const { data: rides } = await supabase
                .from('taxi_rides')
                .select('*')
                .eq('status', 'scheduled');
            if (rides) setScheduledRides(rides);

            // Fetch user's ride history
            if (user) {
                const { data: history } = await supabase
                    .from('taxi_bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (history) setRealHistory(history);
            }
        }
        fetchData();
    }, [user]);

    const handleBookSeats = async (ride: any) => {
        setSelectedRide(ride);
        setView('seat_selection');

        // Fetch specific booked seats
        const { data } = await supabase
            .from('taxi_seat_bookings')
            .select('seat_number')
            .eq('ride_id', ride.id)
            .neq('status', 'cancelled');

        if (data) {
            setBookedSeats(data.map((b: any) => b.seat_number));
        }
    };

    const confirmBooking = async () => {
        if (!user || !selectedRide || selectedSeats.length === 0) return;

        const numSeats = selectedSeats.length;
        const newAvailable = Math.max(0, selectedRide.available_seats - numSeats);

        try {
            // 1. Update available seats in the ride table
            const { error: rideError } = await supabase
                .from('taxi_rides')
                .update({ available_seats: newAvailable })
                .eq('id', selectedRide.id);

            if (rideError) throw rideError;

            // 2. Insert into bookings table for general history
            await supabase.from('taxi_bookings').insert([{
                user_id: user.id,
                vehicle_type: selectedRide.vehicle_details,
                from_location: 'Current Location',
                to_location: selectedRide.to_city,
                fare: (parseFloat(selectedRide.fare) * numSeats).toString(),
                status: 'Active'
            }]);

            // 3. Insert specific seat bookings
            const seatBookings = selectedSeats.map(seat => ({
                ride_id: selectedRide.id,
                user_id: user.id,
                seat_number: seat,
                status: 'confirmed' // Auto confirm for now or pending? Confirmed if driver doesn't need to approve seats one by one.
            }));

            const { error: seatError } = await supabase
                .from('taxi_seat_bookings')
                .insert(seatBookings);

            if (seatError) throw seatError;

            alert(`Successfully reserved ${numSeats} seat(s) for ${selectedRide.to_city}.`);

            // Refresh local state
            setScheduledRides(prev => prev.map(r => r.id === selectedRide.id ? { ...r, available_seats: newAvailable } : r));
            setView('booking');
            setSelectedSeats([]);
        } catch (error: any) {
            alert('Error updating booking: ' + error.message);
        }
    };

    // --- Views ---

    const BookingView = () => {
        const isLongDistance = selectedVehicleId !== 'local';
        const filteredRides = scheduledRides.filter(r =>
            r.to_city.toLowerCase() === vehicleTypes.find(v => v.id === selectedVehicleId)?.destination?.toLowerCase()
        );

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
                {/* Map Segment (30% height) */}
                <div style={{
                    height: '35%',
                    position: 'relative',
                    background: 'url(https://images.unsplash.com/photo-1524660988544-1429dd4740a1?auto=format&fit=crop&q=80&w=800) center/cover',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, var(--bg-app) 100%)',
                    }} />
                    {/* Pulsing Location Marker */}
                    <div style={{
                        position: 'absolute',
                        top: '45%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{
                                position: 'absolute',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--green-primary)',
                            }}
                        />
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--green-primary)',
                            border: '3px solid white',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                            zIndex: 2
                        }} />
                    </div>
                </div>

                {/* Booking Panel w/ Glassmorphism */}
                <div style={{
                    background: 'rgba(20, 20, 20, 0.65)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '32px 32px 0 0',
                    marginTop: '-40px',
                    padding: '24px 20px',
                    zIndex: 10,
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    {/* Become a Driver Promo */}
                    <Link href="/taxi/register" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '20px',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--green-primary)' }}>Earn with Gamtin</h4>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Register your vehicle & start driving</p>
                            </div>
                            <div style={{
                                background: 'var(--green-primary)',
                                color: '#111',
                                padding: '6px 14px',
                                borderRadius: '99px',
                                fontSize: '11px',
                                fontWeight: 800
                            }}>
                                Join Now
                            </div>
                        </div>
                    </Link>

                    {/* Vehicle Selection Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        {vehicleTypes.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVehicleId(v.id)}
                                style={{
                                    background: selectedVehicleId === v.id ? 'var(--green-light)' : 'rgba(255,255,255,0.03)',
                                    border: selectedVehicleId === v.id ? '1px solid var(--green-primary)' : '1px solid var(--border)',
                                    borderRadius: '20px',
                                    padding: '12px 6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    background: selectedVehicleId === v.id ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: selectedVehicleId === v.id ? '#111' : 'var(--text-secondary)'
                                }}>
                                    <v.icon size={18} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 700 }}>{v.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {!isLongDistance ? (
                        <>
                            {/* Local Booking UI */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green-primary)', boxShadow: '0 0 10px var(--green-primary)' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Current Location</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <MapPin size={16} color="#ef4444" />
                                    <input type="text" placeholder="Where to?" style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={18} color="var(--text-muted)" />
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Cash</span>
                                    <ChevronDown size={14} color="var(--text-muted)" />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Fare</p>
                                    <p style={{ fontSize: '24px', fontWeight: 900, color: 'var(--green-primary)' }}>₹150.00</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setView('tracking')}
                                style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--green-primary)', border: 'none', color: '#111', fontWeight: 800, boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}
                            >
                                Track Ride
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Long Distance Ride List */}
                            <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Scheduled Rides to {vehicleTypes.find(v => v.id === selectedVehicleId)?.destination}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {filteredRides.length > 0 ? filteredRides.map(ride => (
                                    <div key={ride.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div>
                                                <p style={{ fontSize: '15px', fontWeight: 800 }}>{ride.vehicle_details}</p>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Departure: {new Date(ride.departure_at).toLocaleDateString()} • {new Date(ride.departure_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '16px', fontWeight: 900, color: 'var(--green-primary)' }}>₹{ride.fare}</p>
                                                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ride.available_seats} seats left</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <a
                                                href={`tel:${ride.driver_phone || '9876543210'}`}
                                                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'none', color: 'white', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}
                                            >
                                                <Phone size={14} /> Call Driver
                                            </a>
                                            <button
                                                onClick={() => handleBookSeats(ride)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'var(--green-primary)', border: 'none', color: '#111', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                                <Users size={14} fill="currentColor" /> Book Seats
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border)', borderRadius: '20px' }}>
                                        <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No scheduled rides found for this route.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Ride History Section (Below CTAs) */}
                    <div style={{ marginTop: '36px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Recent Rides</h3>
                            <button onClick={() => setView('history')} style={{ background: 'none', border: 'none', color: 'var(--green-primary)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>View All</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {realHistory.length > 0 ? realHistory.slice(0, 2).map((ride) => (
                                <div key={ride.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '20px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    transition: 'background 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Car size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '15px', fontWeight: 700 }}>{ride.to_location}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(ride.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '15px', fontWeight: 800 }}>₹{ride.fare}</p>
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ride.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No recent rides.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SeatSelectionView = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setView('booking')} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Select Seats</h1>
            </div>

            <div style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '280px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '32px', padding: '32px 20px' }}>
                    {/* Driver Seat */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            💺
                        </div>
                    </div>

                    {/* Passenger Seats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                        {Array.from({ length: selectedRide?.total_seats || 10 }).map((_, i) => {
                            const seatNum = i + 1;
                            const isSelected = selectedSeats.includes(seatNum);
                            const isTaken = bookedSeats.includes(seatNum);

                            return (
                                <button
                                    key={seatNum}
                                    disabled={isTaken}
                                    onClick={() => {
                                        if (isSelected) setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
                                        else setSelectedSeats([...selectedSeats, seatNum]);
                                    }}
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        background: isTaken
                                            ? 'rgba(255,255,255,0.05)'
                                            : isSelected
                                                ? 'var(--green-primary)'
                                                : 'var(--bg-card)',
                                        color: isTaken ? 'var(--text-muted)' : isSelected ? '#111' : 'white',
                                        fontSize: '12px',
                                        fontWeight: 800,
                                        opacity: isTaken ? 0.3 : 1,
                                        cursor: isTaken ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {seatNum}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)' }} /> Available
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--green-primary)' }} /> Selected
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', opacity: 0.3 }} /> Filled
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div style={{ padding: '24px 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderRadius: '32px 32px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Seats: {selectedSeats.join(', ') || 'None'}</p>
                        <p style={{ fontSize: '18px', fontWeight: 800 }}>Total: ₹{(selectedRide?.fare || 0) * selectedSeats.length}</p>
                    </div>
                    <CheckCircle2 size={32} color={selectedSeats.length > 0 ? 'var(--green-primary)' : 'var(--border)'} />
                </div>
                <button
                    disabled={selectedSeats.length === 0}
                    onClick={confirmBooking}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        background: selectedSeats.length > 0 ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: selectedSeats.length > 0 ? '#111' : 'var(--text-muted)',
                        fontWeight: 800,
                        cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                >
                    Confirm Reservation
                </button>
            </div>
        </div>
    );

    const TrackingView = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Map Header with Glass */}
            <div style={{
                height: '60%',
                background: 'linear-gradient(rgba(0,0,0,0.4), transparent), url(https://images.unsplash.com/photo-1524660988544-1429dd4740a1?auto=format&fit=crop&q=80&w=800)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 20
                }}>
                    <button
                        onClick={() => setView('booking')}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ fontSize: '18px', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Track Your Ride</div>
                    <button style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Info size={20} />
                    </button>
                </div>

                {/* Map Marker Simulation */}
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', boxShadow: '0 0 30px var(--green-primary)' }}>
                        <Car size={32} />
                    </motion.div>
                    <div style={{ background: 'white', color: '#111', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, marginTop: '8px', textAlign: 'center' }}>
                        ARRIVING IN 4M
                    </div>
                </div>
            </div>

            {/* Driver Info Panel */}
            <div style={{
                flex: 1,
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                borderRadius: '32px 32px 0 0',
                marginTop: '-32px',
                padding: '24px 20px',
                zIndex: 10,
                boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Heading to Terminal 2</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Estimated arrival: 10:45 AM</p>
                    </div>
                    <div style={{ background: 'var(--green-light)', color: 'var(--green-primary)', padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>ON TRIP</div>
                </div>

                {/* Driver Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Image
                                src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="Driver"
                                width={64}
                                height={64}
                                style={{ borderRadius: '50%', border: '2px solid var(--green-primary)' }}
                            />
                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', color: '#111', borderRadius: '99px', padding: '2px 6px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px', border: '1px solid var(--border)' }}>
                                4.9 <Star size={10} fill="#f59e0b" color="#f59e0b" />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Michael Smith</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Toyota Prius • ABC-1234</p>
                        </div>
                        <button style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--green-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                            <MessageCircle size={22} fill="currentColor" />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'var(--green-primary)',
                        border: 'none',
                        color: '#111',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Phone size={18} fill="currentColor" /> Call Driver
                    </button>
                    <button style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Share2 size={18} /> Share Trip
                    </button>
                </div>
            </div>
        </div>
    );

    const HistoryView = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-nav)' }}>
                <button onClick={() => setView('booking')} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Ride History</h1>
                <div style={{ flex: 1 }} />
                <Filter size={20} color="var(--text-muted)" />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 20px', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setTab('completed')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: tab === 'completed' ? 'var(--green-primary)' : 'var(--text-muted)',
                        borderBottom: tab === 'completed' ? '2px solid var(--green-primary)' : 'none',
                        background: 'none',
                        border: 'none'
                    }}
                >
                    Completed
                </button>
                <button
                    onClick={() => setTab('cancelled')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: tab === 'cancelled' ? 'var(--green-primary)' : 'var(--text-muted)',
                        borderBottom: tab === 'cancelled' ? '2px solid var(--green-primary)' : 'none',
                        background: 'none',
                        border: 'none'
                    }}
                >
                    Cancelled
                </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>Recent Rides</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {realHistory.length > 0 ? realHistory.map((ride) => (
                        <motion.div
                            key={ride.id}
                            whileHover={{ scale: 1.02 }}
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--green-light)', color: 'var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 700 }}>{ride.vehicle_type}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(ride.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '15px', fontWeight: 800 }}>₹{ride.fare}</p>
                                    <span style={{ fontSize: '10px', background: 'var(--green-light)', color: 'var(--green-primary)', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>{ride.status}</span>
                                </div>
                            </div>
                            <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px dashed var(--border)', marginLeft: '22px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green-primary)', border: '2px solid var(--bg-card)' }} />
                                    <p style={{ fontSize: '13px', fontWeight: 600 }}>{ride.from_location}</p>
                                </div>
                                <div>
                                    <div style={{ position: 'absolute', left: '-7px', bottom: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-muted)', border: '2px solid var(--bg-card)' }} />
                                    <p style={{ fontSize: '13px', fontWeight: 600 }}>{ride.to_location}</p>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border)', borderRadius: '20px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No rides found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    return (
        <div style={{ height: 'calc(100vh - 70px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TopHeader onMenuClick={openSidebar} title="Taxi Booking" />
            <div style={{ flex: 1, position: 'relative' }}>
                {/* Top Overlay Link for History (Global) */}
                <AnimatePresence mode="wait">
                    {view === 'booking' && (
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onClick={() => setView('history')}
                            style={{
                                position: 'fixed',
                                top: '80px',
                                right: '20px',
                                zIndex: 60,
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '10px',
                                color: 'white'
                            }}
                        >
                            <History size={20} />
                        </motion.button>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {view === 'booking' && (
                        <motion.div
                            key="booking"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ height: '100%' }}
                        >
                            <BookingView />
                        </motion.div>
                    )}
                    {view === 'tracking' && (
                        <motion.div
                            key="tracking"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            style={{ height: '100%' }}
                        >
                            <TrackingView />
                        </motion.div>
                    )}
                    {view === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ y: 300, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 300, opacity: 0 }}
                            style={{ height: '100%' }}
                        >
                            <HistoryView />
                        </motion.div>
                    )}
                    {view === 'seat_selection' && (
                        <motion.div
                            key="seat_selection"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            style={{ height: '100%' }}
                        >
                            <SeatSelectionView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
