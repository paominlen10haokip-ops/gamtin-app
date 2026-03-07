import Link from 'next/link';
import TopHeader from '../../components/TopHeader';

const faqs = [
    {
        q: 'What is Gamtin?',
        a: 'Gamtin is a community platform for Churachandpur, Manipur. It connects residents with local services, news, job alerts, marketplace listings, and public notices.',
    },
    {
        q: 'How do I book a taxi?',
        a: 'Go to the Taxi Booking section from the Home screen or bottom navigation. Enter your destination and select a vehicle type, then tap "Track Ride".',
    },
    {
        q: 'Can I post items on the Marketplace?',
        a: 'Yes! Tap the "Sell" button in the Marketplace screen to list your item with photos, price, and location.',
    },
    {
        q: 'How do I apply for a job?',
        a: 'Browse job listings in the Job Alerts section and tap "Apply" on any listing you\'re interested in.',
    },
    {
        q: 'Is Gamtin free to use?',
        a: 'Yes, Gamtin is completely free for community members. Some premium features may be added in the future.',
    },
    {
        q: 'How do I report a problem?',
        a: 'Use the Contact Us section to send us a message. Our support team will respond within 24 hours.',
    },
];

export default function FAQPage() {
    return (
        <>
            <TopHeader title="FAQ" showBack />
            <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    Find answers to the most common questions about Gamtin.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} className="card" style={{ padding: '16px' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                                <span style={{ color: 'var(--green-primary)', fontWeight: 800, fontSize: '16px' }}>Q</span>
                                <h3 style={{ fontWeight: 700, fontSize: '15px' }}>{faq.q}</h3>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', paddingLeft: '22px' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ padding: '18px', marginTop: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤔</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Still have questions?</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>Our support team is happy to help you.</p>
                    <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Contact Support</Link>
                </div>
            </div>
        </>
    );
}
