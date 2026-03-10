'use client';

import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';

export const SidebarContext = createContext<{ openSidebar: () => void }>({ openSidebar: () => { } });

export const useSidebar = () => useContext(SidebarContext);

interface LayoutWrapperProps {
    children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <SidebarContext.Provider value={{ openSidebar: () => setIsSidebarOpen(true) }}>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={async () => {
                    await supabase.auth.signOut();
                    setIsSidebarOpen(false);
                }}
            />

            <div className="app-container">
                <TopNavBar />
                <div className="shell">
                    <main className="page">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};

export default LayoutWrapper;
