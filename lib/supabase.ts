import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types for our database
export interface ShortUrl {
  id: string;
  short_code: string;
  long_url: string;
  title?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  clicks: number;
  created_at: string;
  created_by?: string;
  expires_at?: string;
  is_active: boolean;
}

export interface ClickAnalytics {
  id: string;
  short_url_id: string;
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: string;
}