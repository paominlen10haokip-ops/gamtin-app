import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use placeholders during build-time (server-side) to prevent prerendering crashes
// if environment variables are not yet configured in the deployment platform.
const isServer = typeof window === 'undefined';
const effectiveUrl = supabaseUrl || (isServer ? 'https://placeholder.supabase.co' : '');
const effectiveKey = supabaseAnonKey || (isServer ? 'placeholder' : '');

export const supabase = createBrowserClient(effectiveUrl, effectiveKey);

if (!supabaseUrl || !supabaseAnonKey) {
    if (isServer) {
        console.warn('⚠️ [Build Time] Supabase environment variables are missing. Using placeholders to allow build to finish. Please double check your Vercel project settings.');
    }
}

// ─── Type definitions ─────────────────────────────────────────────────────────

export type Profile = {
    id: string;
    full_name: string;
    location: string;
    avatar_emoji: string;
    post_count: number;
    comment_count: number;
    booking_count: number;
    is_driver: boolean;
    is_seller: boolean;
    created_at: string;
};

export type Notice = {
    id: number;
    type: 'EMERGENCY' | 'OFFICIAL' | 'EVENTS' | 'UTILITIES';
    title: string;
    body: string;
    author: string;
    author_icon: string;
    cta: string;
    created_at: string;
};

export type CommunityPost = {
    id: number;
    author: string;
    avatar: string;
    category: string;
    category_color: string;
    title: string;
    body: string;
    likes: number;
    comments: number;
    has_image: boolean;
    image_bg: string | null;
    created_at: string;
};

export type NewsItem = {
    id: number;
    category: 'EVENTS' | 'WEATHER' | 'LOCAL NEWS' | 'JOBS';
    category_class: string;
    title: string;
    body: string;
    likes: number;
    comments: number;
    has_image: boolean;
    image_emoji: string | null;
    image_bg: string | null;
    created_at: string;
};

export type Job = {
    id: number;
    user_id: string;
    title: string;
    company: string;
    company_color: string;
    location: string;
    job_type: string;
    emoji: string;
    emoji_bg: string;
    cta: string;
    cta_style: string;
    created_at: string;
};

export type MarketplaceItem = {
    id: number;
    name: string;
    price: string;
    location: string;
    emoji: string;
    emoji_bg: string;
    item_type: 'local' | 'regular';
    created_at: string;
};

export type TaxiBooking = {
    id: number;
    user_id: string;
    vehicle_type: string;
    vehicle_emoji: string;
    from_location: string;
    to_location: string;
    fare: string;
    status: 'Completed' | 'Cancelled' | 'Active';
    created_at: string;
};
