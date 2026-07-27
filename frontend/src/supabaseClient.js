import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.supabase.co') &&
      !url.hostname.includes('your-project-ref')
    );
  } catch {
    return false;
  }
}

export const isSupabaseConfigured =
  isValidSupabaseUrl(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'your-anon-public-key';

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
