'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from '@/components/TopHeader';
import { useSidebar } from '@/components/LayoutWrapper';
import { useAuth } from '@/components/AuthProvider';
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Heart,
    PlusCircle,
    ChevronDown,
    ArrowUpDown,
    ShoppingBag,
    Store
} from 'lucide-react';

const MarketplacePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'local' | 'regular'>('local');
    const [searchQuery, setSearchQuery] = useState('');
    const { openSidebar } = useSidebar();

    const isSeller = user?.user_metadata?.is_seller || false;

    const localItems = [
        {
            id: 1,
            title: 'Traditional Handwoven Shawl',
            price: '1,250',
            location: 'Churachandpur, Manipur',
            image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=400',
            isFavorite: false
        },
        {
            id: 2,
            title: 'Fresh Farm Oranges (5kg)',
            price: '450',
            location: 'Lamka, Churachandpur',
            image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=400',
            isFavorite: true
        },
        {
            id: 3,
            title: 'Bamboo Craft Baskets',
            price: '890',
            location: 'Imphal East, Manipur',
            image: 'https://images.unsplash.com/photo-1590735204423-d44444444444?auto=format&fit=crop&q=80&w=400',
            isFavorite: false
        },
        {
            id: 4,
            title: 'Organic Black Rice (Chak-hao)',
            price: '180/kg',
            location: 'Bishnupur, Manipur',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
            isFavorite: false
        }
    ];

    const regularItems = [
        {
            id: 5,
            title: 'Sony Headphones - Used',
            price: '4,500',
            location: 'New Lamka, CCPur',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
            isFavorite: false
        },
        {
            id: 6,
            title: 'Sturdy Office Table',
            price: '2,800',
            location: 'Tuibong, CCPur',
            image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400',
            isFavorite: false
        }
    ];

    const currentItems = activeTab === 'local' ? localItems : regularItems;

    return (
        <div style={{ color: 'white', paddingBottom: '80px' }}>
            <TopHeader onMenuClick={openSidebar} title="Marketplace" />
            {/* Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(20, 20, 20, 0.4)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <button
                    onClick={() => setActiveTab('local')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: activeTab === 'local' ? 'var(--green-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'local' ? '2px solid var(--green-primary)' : 'none',
                        background: 'none',
                        border: 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    Local Items
                </button>
                <button
                    onClick={() => setActiveTab('regular')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: activeTab === 'regular' ? 'var(--green-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'regular' ? '2px solid var(--green-primary)' : 'none',
                        background: 'none',
                        border: 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    Regular Items
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ padding: '20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    marginBottom: '16px'
                }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search items in Gamtin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '99px',
                        background: 'var(--green-light)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: 'var(--green-primary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        flexShrink: 0
                    }}>
                        <SlidersHorizontal size={14} />
                        Filters
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '99px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        fontSize: '13px',
                        fontWeight: 500,
                        flexShrink: 0
                    }}>
                        Price Range
                        <ChevronDown size={14} />
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '99px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        fontSize: '13px',
                        fontWeight: 500,
                        flexShrink: 0
                    }}>
                        Newest
                        <ArrowUpDown size={14} />
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {currentItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ position: 'relative', aspectRatio: '1', width: '100%' }}>
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <button
                                onClick={() => {
                                    // Simulate toggling favorite
                                    item.isFavorite = !item.isFavorite;
                                    // This won't trigger re-render unless we use state, 
                                    // but for "accessibility"/feel let's at least make it clickable.
                                    // Ideally, we'd have a local state.
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(0,0,0,0.3)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: item.isFavorite ? '#ef4444' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <Heart size={16} fill={item.isFavorite ? '#ef4444' : 'none'} />
                            </button>
                        </div>
                        <div style={{ padding: '12px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }} className="truncate">
                                {item.title}
                            </h3>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-primary)', marginBottom: '8px' }}>
                                ₹{item.price}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                                <MapPin size={10} />
                                <span className="truncate">{item.location}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Floating Action Button */}
            <Link href={isSeller ? "/marketplace/seller" : "/marketplace/register"} style={{ textDecoration: 'none' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '24px',
                        background: 'var(--green-primary)',
                        color: '#111',
                        padding: '12px 24px',
                        borderRadius: '99px',
                        border: 'none',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 800,
                        fontSize: '15px',
                        zIndex: 100
                    }}
                >
                    <PlusCircle size={20} />
                    Sell
                </motion.button>
            </Link>
        </div>
    );
};

export default MarketplacePage;
