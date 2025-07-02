import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance for the entire app
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// For use in React components where we need the authenticated client
export function useSupabaseClient() {
  return getSupabaseClient();
}

// Legacy export for backward compatibility
export const supabase = getSupabaseClient();