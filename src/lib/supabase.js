import { createClient } from '@supabase/supabase-js';
// The publishable key is safe for browser use. Environment variables still
// take priority, while these fallbacks keep the deployed static site connected
// when the host was built without Vite variables.
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzbzjczzbegcasxlrxxt.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NfxsaDI6m1tQH0Nwd8GTpg_MGp2HAOO';
// Accept either the project URL or a pasted REST URL from Supabase.
const url = rawUrl?.replace(/\/rest\/v1\/?$/, '');
export const supabase = url && key ? createClient(url, key) : null;
