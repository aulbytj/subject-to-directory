import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create instances for different use cases
let publicSupabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;
let authSupabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

// Public client for anonymous property viewing (marketplace browsing)
export function getPublicSupabaseClient() {
  if (!publicSupabaseInstance) {
    publicSupabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return publicSupabaseInstance;
}

// Authenticated client for user-specific operations (creating, editing, favorites)
export function getAuthenticatedSupabaseClient() {
  if (!authSupabaseInstance) {
    authSupabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return authSupabaseInstance;
}

// Default client (public for marketplace functionality)
export function getSupabaseClient() {
  return getPublicSupabaseClient();
}

// For use in React components where we need the authenticated client
export function useSupabaseClient() {
  return getAuthenticatedSupabaseClient();
}

// Legacy export for backward compatibility (now uses public client)
export const supabase = getPublicSupabaseClient();