'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    profile: any | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, user: null, profile: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function getInitialSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                } else {
                    setLoading(false);
                }
            }
        }

        async function fetchProfile(userId: string) {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (mounted) {
                setProfile(data);
                setLoading(false);
            }
        }

        async function testConnection() {
            try {
                const { error } = await supabase.from('notices').select('count', { count: 'exact', head: true });
                if (error) {
                    console.error('🔴 Supabase Connection Error:', error.message);
                } else {
                    console.log('🟢 Supabase Connected Successfully');
                }
            } catch (err) {
                console.error('🔴 Failed to test Supabase connection:', err);
            }
        }

        getInitialSession();
        testConnection();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
