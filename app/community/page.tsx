'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from '@/components/TopHeader';
import { supabase, CommunityPost } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import ShareButton from '@/components/ShareButton';
import { useSidebar } from '../../components/LayoutWrapper';

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

function PostCard({ post, user, variants }: { post: CommunityPost, user: any, variants: any }) {
    const [likes, setLikes] = useState(post.likes);
    const [hasLiked, setHasLiked] = useState(false);
    const [comments, setComments] = useState(post.comments);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [postComments, setPostComments] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            // Check if user has liked
            supabase.from('community_post_likes')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', post.id)
                .eq('user_id', user.id)
                .then(({ count }) => {
                    if (count && count > 0) setHasLiked(true);
                });
        }
    }, [user, post.id]);

    const handleLike = async () => {
        if (!user) return router.push('/auth');

        if (hasLiked) {
            setLikes(prev => prev - 1);
            setHasLiked(false);
            await supabase.from('community_post_likes')
                .delete().eq('post_id', post.id).eq('user_id', user.id);
        } else {
            setLikes(prev => prev + 1);
            setHasLiked(true);
            await supabase.from('community_post_likes')
                .insert([{ post_id: post.id, user_id: user.id }]);
        }
    };

    const toggleCommentBox = async () => {
        if (!user) return router.push('/auth');
        setShowCommentBox(!showCommentBox);
        if (!showCommentBox && postComments.length === 0) {
            const { data } = await supabase.from('community_post_comments')
                .select('*').eq('post_id', post.id).order('created_at', { ascending: true });
            if (data) setPostComments(data);
        }
    };

    const submitComment = async () => {
        if (!commentText.trim()) return;
        setComments(prev => prev + 1);
        const newComment = { post_id: post.id, user_id: user.id, user_name: user.user_metadata?.full_name || 'User', content: commentText.trim() };
        setPostComments(prev => [...prev, newComment]);
        setCommentText('');
        await supabase.from('community_post_comments').insert([newComment]);
    };

    return (
        <motion.div variants={variants} className="card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
                <div style={{
                    width: 40, height: 40, background: 'var(--ochre-light)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>{post.avatar}</div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{post.author}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDate(post.created_at)} • <span style={{ color: 'var(--rust-accent)', fontWeight: 600 }}>{post.category}</span>
                    </div>
                </div>
            </div>

            <h3 className="section-title" style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px', lineHeight: '1.4' }}>{post.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: post.has_image ? '12px' : '14px' }}>{post.body}</p>

            {post.has_image && (
                <div style={{
                    height: 160, background: post.image_bg || 'var(--green-light)', borderRadius: 'var(--radius-md)',
                    marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                }}>🌳</div>
            )}

            <div className="flex items-center justify-between">
                <div className="stat-row" style={{ display: 'flex', gap: '16px' }}>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={handleLike}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: hasLiked ? 'var(--rust-accent)' : 'var(--text-secondary)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{likes}</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.8 }}
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
                    title={`${post.title} | ${post.author} on Gamtin`}
                    text={`Check out this discussion by ${post.author} in Gamtin Community!`}
                    url={`/community?id=${post.id}`}
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
                            {postComments.map((c, i) => (
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
        </motion.div>
    );
}

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('General');
    const [creating, setCreating] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const { openSidebar } = useSidebar();

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            let query = supabase.from('community_posts').select('*').order('created_at', { ascending: false });

            if (filter !== 'All') {
                query = query.eq('category', filter);
            }

            const { data, error } = await query;
            if (data) setPosts(data);
            setLoading(false);
        }

        fetchPosts();
    }, [filter]);

    const handleCreatePost = () => {
        if (!user) router.push('/auth');
        else setShowCreateModal(true);
    };

    const submitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newPostTitle.trim() || !newPostBody.trim()) return;
        setCreating(true);

        const { error } = await supabase.from('community_posts').insert({
            user_id: user.id,
            author: user.user_metadata?.full_name || 'Anonymous',
            avatar: '👤',
            title: newPostTitle,
            body: newPostBody,
            category: newPostCategory,
            likes: 0,
            comments: 0
        });

        if (error) {
            alert('Error creating post: ' + error.message);
        } else {
            setShowCreateModal(false);
            setNewPostTitle('');
            setNewPostBody('');
            // Trigger refresh
            setFilter(filter);
        }
        setCreating(false);
    };

    // Staggered animation variants
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 50,
            }}>
                <button onClick={openSidebar} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2.5, background: 'var(--text-primary)', borderRadius: 2 }} />)}
                </button>
                <span className="section-title" style={{ fontWeight: 700, fontSize: '18px' }}>Community Hub</span>
                <Link href="/notifications" style={{ position: 'relative', display: 'flex', color: 'inherit' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--green-primary)', borderRadius: '50%', border: '1.5px solid white' }} />
                </Link>
            </div>

            <div style={{ padding: '16px' }}>
                {/* Search */}
                <div className="search-bar" style={{ marginBottom: '14px', background: 'var(--border)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Search discussions in Churachandpur…
                </div>

                {/* Chips */}
                <div className="chips" style={{ marginBottom: '20px' }}>
                    {['All', 'General', 'Help', 'Events', 'Trade', 'Sports'].map((f) => (
                        <span key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</span>
                    ))}
                </div>

                {/* Posts */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No posts found.</div>
                    ) : (posts.map(p => (
                        <PostCard key={p.id} post={p} user={user} variants={itemVariants} />
                    )))}
                </motion.div>

                {/* FAB */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleCreatePost}
                    style={{
                        position: 'fixed',
                        bottom: 'calc(var(--nav-height) + 20px)',
                        right: '50%',
                        transform: 'translateX(160px)',
                        width: 56, height: 56,
                        background: 'var(--green-primary)',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        fontSize: '28px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        zIndex: 100
                    }}>+</motion.button>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '24px'
                }}>
                    <div style={{
                        background: '#1a1a1a', padding: '28px', borderRadius: '28px',
                        width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Start Discussion</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={submitPost} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {['General', 'Help', 'Events', 'Trade', 'Sports'].map(cat => (
                                        <button
                                            key={cat} type="button"
                                            onClick={() => setNewPostCategory(cat)}
                                            style={{
                                                padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)',
                                                background: newPostCategory === cat ? 'var(--green-primary)' : 'rgba(255,255,255,0.05)',
                                                color: newPostCategory === cat ? 'white' : 'var(--text-secondary)',
                                                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s'
                                            }}
                                        >{cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Topic Title</label>
                                <input
                                    type="text" required value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)}
                                    placeholder="What's on your mind?"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Discussion Body</label>
                                <textarea
                                    required value={newPostBody} onChange={e => setNewPostBody(e.target.value)}
                                    placeholder="Share your thoughts with the community..."
                                    style={{ ...inputStyle, minHeight: '130px', resize: 'none' }}
                                />
                            </div>
                            <button disabled={creating} type="submit" className="btn-primary" style={{ background: 'var(--green-primary)', color: 'white', marginTop: '10px', height: '52px', fontSize: '16px' }}>
                                {creating ? 'Posting...' : 'Post to Community'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}

const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px'
};

const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '15px'
};
