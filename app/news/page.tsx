'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, NewsItem } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import ShareButton from '@/components/ShareButton';

const tabs = ['All News', 'Local News', 'Weather', 'Events', 'Jobs'];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function NewsCard({ news, user, variants }: { news: NewsItem, user: any, variants: any }) {
    const [likes, setLikes] = useState(news.likes);
    const [hasLiked, setHasLiked] = useState(false);
    const [comments, setComments] = useState(news.comments);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [newsComments, setNewsComments] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            supabase.from('news_feed_likes')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', news.id)
                .eq('user_id', user.id)
                .then(({ count }) => {
                    if (count && count > 0) setHasLiked(true);
                });
        }
    }, [user, news.id]);

    const handleLike = async () => {
        if (!user) return router.push('/auth');

        if (hasLiked) {
            setLikes(prev => prev - 1);
            setHasLiked(false);
            await supabase.from('news_feed_likes')
                .delete().eq('post_id', news.id).eq('user_id', user.id);
        } else {
            setLikes(prev => prev + 1);
            setHasLiked(true);
            await supabase.from('news_feed_likes')
                .insert([{ post_id: news.id, user_id: user.id }]);
        }
    };

    const toggleCommentBox = async () => {
        if (!user) return router.push('/auth');
        setShowCommentBox(!showCommentBox);
        if (!showCommentBox && newsComments.length === 0) {
            const { data } = await supabase.from('news_feed_comments')
                .select('*').eq('post_id', news.id).order('created_at', { ascending: true });
            if (data) setNewsComments(data);
        }
    };

    const submitComment = async () => {
        if (!commentText.trim()) return;
        setComments(prev => prev + 1);
        const newComment = { post_id: news.id, user_id: user.id, user_name: user.user_metadata?.full_name || 'User', content: commentText.trim() };
        setNewsComments(prev => [...prev, newComment]);
        setCommentText('');
        await supabase.from('news_feed_comments').insert([newComment]);
    };

    return (
        <motion.div variants={variants} className="card" style={{ overflow: 'hidden', background: 'var(--bg-card)' }}>
            {news.has_image && (
                <div style={{
                    height: 170, background: news.image_bg || 'var(--green-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '72px',
                }}>{news.image_emoji}</div>
            )}
            <div style={{ padding: '14px' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                    <span className={`badge ${news.category_class}`}>{news.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(news.created_at)}</span>
                </div>
                <h3 className="section-title" style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px', lineHeight: '1.4' }}>{news.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>{news.body}</p>
                <div className="flex items-center justify-between">
                    <div className="stat-row" style={{ display: 'flex', gap: '16px' }}>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLike}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: hasLiked ? 'var(--rust-accent)' : 'var(--text-secondary)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{likes}</span>
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleCommentBox}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: showCommentBox ? 'var(--green-primary)' : 'var(--text-secondary)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{comments}</span>
                        </motion.button>
                    </div>
                    <ShareButton
                        title={`${news.title} on Gamtin`}
                        text={`Check out this news report in Gamtin Feed!`}
                        url={`/news?id=${news.id}`}
                    />
                </div>

                <AnimatePresence>
                    {showCommentBox && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                {newsComments.map((c, i) => (
                                    <div key={i} style={{ fontSize: '13px', display: 'flex', gap: '8px' }}>
                                        <span style={{ fontWeight: 600 }}>{c.user_name || 'User'}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{c.content}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    style={{ flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: '13px' }}
                                />
                                <button onClick={submitComment} style={{ background: 'var(--green-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '0 16px', fontSize: '13px', fontWeight: 600 }}>Post</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default function NewsFeedPage() {
    const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All News');
    const { user } = useAuth();

    useEffect(() => {
        async function fetchNews() {
            setLoading(true);
            let query = supabase.from('news_feed').select('*').order('created_at', { ascending: false });

            if (activeTab !== 'All News') {
                query = query.eq('category', activeTab.toUpperCase());
            }

            const { data, error } = await query;
            if (data) setNewsFeed(data);
            setLoading(false);
        }

        fetchNews();
    }, [activeTab]);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 50,
            }}>
                <span className="section-title" style={{ fontWeight: 700, fontSize: '18px' }}>Gamtin Feed</span>
                <div style={{ display: 'flex', gap: '14px' }}>
                    <Link href="/search">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </Link>
                    <Link href="/notifications" style={{ position: 'relative' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--green-primary)', borderRadius: '50%', border: '1.5px solid white' }} />
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 16px' }}>
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flexShrink: 0,
                            padding: '12px 14px',
                            fontWeight: activeTab === tab ? 700 : 500,
                            fontSize: '14px',
                            color: activeTab === tab ? 'var(--green-primary)' : 'var(--text-secondary)',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2.5px solid var(--green-primary)' : '2.5px solid transparent',
                            cursor: 'pointer',
                        }}>{tab}</button>
                    ))}
                </div>
            </div>

            {/* Feed */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading news...</div>
                ) : newsFeed.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No news found.</div>
                ) : (newsFeed.map(n => (
                    <NewsCard key={n.id} news={n} user={user} variants={itemVariants} />
                )))}
            </motion.div>
        </>
    );
}
