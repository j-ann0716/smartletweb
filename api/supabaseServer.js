import { createClient } from '@supabase/supabase-js';

// 1. Read from Vite's environment manager
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Fail early with a clear message if variables are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Critical Failure: Vite cannot read your .env file. Check your key names or restart your server.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
