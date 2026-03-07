'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Newspaper,
    Wrench,
    MessageSquare,
    Calendar,
    Flag,
    BookOpen,
    MapPin,
    ArrowLeft
} from 'lucide-react';

const AboutPage = () => {
    const team = [
        { name: 'Thang Haokip', role: 'Founder', img: '/founder.png' },
        { name: 'Mary Paite', role: 'Operations', img: '/mary.png' },
        { name: 'Samuel G', role: 'Engineering', img: '/samuel.png' },
    ];

    const offers = [
        { icon: <Newspaper size={24} color="#10b981" />, title: 'Local News', desc: 'Verified updates from across the district.' },
        { icon: <Wrench size={24} color="#10b981" />, title: 'Services', desc: 'Directory of skilled local professionals.' },
        { icon: <MessageSquare size={24} color="#10b981" />, title: 'Discussions', desc: 'Platform for community voices.' },
        { icon: <Calendar size={24} color="#10b981" />, title: 'Events', desc: 'Stay updated with local gatherings.' },
    ];

    return (
        <div style={{ color: 'white' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '300px', width: '100%', overflow: 'hidden' }}>
                <Image
                    src="/about_hero.png"
                    alt="Churachandpur Hills"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))'
                }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                    <span style={{
                        background: 'var(--green-primary)',
                        color: '#111',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        display: 'inline-block'
                    }}>
                        ESTABLISHED 2024
                    </span>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Connecting<br />Churachandpur
                    </h2>
                </div>
            </section>

            {/* Intro Text */}
            <section style={{ padding: '24px' }}>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    Gamtin is a dedicated digital ecosystem built specifically for the residents of
                    <span style={{ color: 'var(--green-primary)', fontWeight: 600 }}> Churachandpur, Manipur</span>.
                    We bridge the communication gap by providing a centralized hub for local discovery.
                </p>
            </section>

            {/* Mission & Story */}
            <section style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Flag size={24} color="#10b981" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Our Mission</h3>
                        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                            To empower every citizen in our district with real-time information, access to essential services, and a safe space for communal dialogue.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <BookOpen size={24} color="#10b981" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Our Story</h3>
                        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                            Born from a need for localized digital solutions, Gamtin started as a small community project to list local vendors and has grown into the district's most trusted companion app.
                        </p>
                    </div>
                </div>
            </section>

            {/* What We Offer */}
            <section style={{ padding: '40px 24px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>What We Offer</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {offers.map((offer, idx) => (
                        <div key={idx} style={{
                            background: 'var(--bg-card)',
                            borderRadius: '20px',
                            padding: '20px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {offer.icon}
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{offer.title}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{offer.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Meet the Team */}
            <section style={{ paddingBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 700 }}>Meet the Team</h3>
                    <Link href="#" style={{ fontSize: '14px', color: 'var(--green-primary)', fontWeight: 500 }}>Join us</Link>
                </div>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '0 24px 10px', scrollbarWidth: 'none' }}>
                    {team.map((member, idx) => (
                        <div key={idx} style={{ flexShrink: 0, width: '130px', textAlign: 'center' }}>
                            <div style={{
                                width: '110px',
                                height: '110px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 12px',
                                border: '3px solid var(--green-primary)',
                                padding: '4px'
                            }}>
                                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                                    <Image src={member.img} alt={member.name} fill style={{ objectFit: 'cover' }} />
                                </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{member.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.role}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Roots (Map) */}
            <section style={{ padding: '0 24px 40px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Our Roots</h3>
                <div style={{
                    height: '240px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Fallback for the map asset if it didn't generate well */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at center, #c28e5d 0%, #a67c52 100%)',
                        opacity: 0.2
                    }} />

                    <div style={{
                        background: 'white',
                        padding: '10px 16px',
                        borderRadius: '99px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        zIndex: 10
                    }}>
                        <MapPin size={18} color="#10b981" fill="#10b981" />
                        <span style={{ color: '#111', fontWeight: 700, fontSize: '13px' }}>Churachandpur, Manipur</span>
                    </div>

                    <div style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        background: 'var(--green-primary)',
                        filter: 'blur(60px)',
                        opacity: 0.3
                    }} />
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
