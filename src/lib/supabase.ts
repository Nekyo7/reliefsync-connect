import { createClient } from '@supabase/supabase-js';

// Access Supabase credentials from Vite environment variables.
// Users must supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in their .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');
