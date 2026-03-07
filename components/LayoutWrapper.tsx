'use client';

import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

export const SidebarContext = createContext<{ openSidebar: () => void }>({ openSidebar: () => { } });

export const useSidebar = () => useContext(SidebarContext);

interface LayoutWrapperProps {
    children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <SidebarContext.Provider value={{ openSidebar: () => setIsSidebarOpen(true) }}>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={() => {
                    setIsSidebarOpen(false);
                }}
            />

            <div className="shell">
                <main className="page">
                    {children}
                </main>
            </div>
        </SidebarContext.Provider>
    );
};

export default LayoutWrapper;
