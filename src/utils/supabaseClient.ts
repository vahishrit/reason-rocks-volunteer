
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://YOUR_SUPABASE_URL.supabase.co"; // TODO: replace
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // TODO: replace

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
