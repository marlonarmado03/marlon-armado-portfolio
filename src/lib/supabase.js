import { createClient } from '@supabase/supabase-js';
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Accept either the project URL or a pasted REST URL from Supabase.
const url = rawUrl?.replace(/\/rest\/v1\/?$/, '');
export const supabase = url && key ? createClient(url, key) : null;
