// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Access environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing. Check your .env.local file.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;