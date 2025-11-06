import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://fbkemhjbseqmcxkspkft.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZia2VtaGpic2VxbWN4a3Nwa2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDgzMDYsImV4cCI6MjA3ODAyNDMwNn0.ADEXB3tNe3Xapar2ylOTlqUlX_W9gKZj8VVtoNqgUEo";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);