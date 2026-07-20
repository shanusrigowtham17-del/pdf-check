import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safe to push to Git because it doesn't hardcode the actual keys
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
