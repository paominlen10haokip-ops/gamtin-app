'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopHeader from '../../../components/TopHeader';
import { supabase, TaxiBooking } from '../../../lib/supabase';
import { useAuth } from '../../../components/AuthProvider';

export default function RideHistoryPage() {
    const [rides, setRides] = useState<TaxiBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading && !user) return; // Wait for auth to resolve
        if (!user) {
            router.push('/auth');
            return;
        }

        async function fetchRides() {
            setLoading(true);
            const { data, error } = await supabase
                .from('taxi_bookings')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (data) setRides(data);
            setLoading(false);
        }

        fetchRides();
    }, [user, router]); // Dependency on user helps to fetch if session changes

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    return (
        <>
            <TopHeader title="Ride History" showBack />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading ride history...</div>
                ) : rides.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No previous rides found.</div>
                ) : (rides.map(r => (
                    <div key={r.id} className="card" style={{ padding: '16px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ width: 42, height: 42, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{r.vehicle_emoji}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{r.vehicle_type}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--green-primary)' }}>{r.fare}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: r.status === 'Completed' ? '#22c55e' : (r.status === 'Cancelled' ? '#ef4444' : '#f59e0b') }}>{r.status}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <span>🟢 From: {r.from_location}</span>
                            <span>🔴 To: {r.to_location}</span>
                        </div>
                    </div>
                )))}
            </div>
        </>
    );
}
