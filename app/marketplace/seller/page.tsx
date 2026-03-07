'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store,
    Plus,
    ChevronRight,
    TrendingUp,
    ShoppingBag,
    ArrowLeft,
    Settings,
    Package,
    Heart,
    DollarSign,
    X
} from 'lucide-react';
import { useAuth } from '../../../components/AuthProvider';

export default function SellerDashboard() {
    const { user } = useAuth();
    const [products, setProducts] = useState([
        { id: 1, name: 'Traditional Shawl', price: '1,250', sales: 12, status: 'Active' },
        { id: 2, name: 'Bamboo Baskets', price: '890', sales: 5, status: 'Active' }
    ]);
    const [showAddProduct, setShowAddProduct] = useState(false);

    const AccessDeniedView = () => (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', background: 'var(--bg-app)', color: 'white' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--green-primary)' }}>
                <Store size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Seller Hub Access</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '300px', fontSize: '15px' }}>
                You need to register as a seller to list products and manage your store.
            </p>
            <Link href="/marketplace/register" style={{
                padding: '16px 32px',
                borderRadius: '16px',
                background: 'var(--green-primary)',
                color: '#111',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
            }}>
                Register as Seller
            </Link>
            <Link href="/marketplace" style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Back to Marketplace
            </Link>
        </div>
    );

    if (user && !user.user_metadata?.is_seller) {
        return <AccessDeniedView />;
    }

    return (
        <div style={{ background: 'var(--bg-app)', minHeight: '100vh', padding: '24px 20px', color: 'white' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900 }}>Seller Hub</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Manage your Gamtin store</p>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Settings size={20} />
                </div>
            </header>

            {/* Seller Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px' }}>
                    <DollarSign size={24} color="var(--green-primary)" style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '24px', fontWeight: 900 }}>₹8,400</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Monthly Sales</p>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '20px' }}>
                    <Package size={24} color="#3b82f6" style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '24px', fontWeight: 900 }}>17</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Orders</p>
                </div>
            </div>

            {/* Inventory Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800 }}>Your Products</h2>
                <button
                    onClick={() => setShowAddProduct(true)}
                    style={{ color: 'var(--green-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none' }}
                >
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {products.map(p => (
                    <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag size={24} color="var(--green-primary)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700 }}>{p.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>₹{p.price} • {p.sales} sales</p>
                        </div>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                    </div>
                ))}
            </div>

            <Link
                href="/marketplace"
                style={{
                    position: 'fixed',
                    bottom: '100px',
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    zIndex: 100
                }}
            >
                <Store size={16} /> Exit Seller Mode
            </Link>
        </div>
    );
}
