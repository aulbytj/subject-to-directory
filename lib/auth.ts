import { getSupabaseClient } from './supabase-client';

const supabase = getSupabaseClient();

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: 'buyer' | 'seller' | 'both';
}

export interface SignInData {
  email: string;
  password: string;
}

export const auth = {
  // Sign up new user
  async signUp({ email, password, full_name, role }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
      },
    });
    
    return { data, error };
  },

  // Sign in existing user
  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  },

  // Sign out user - secure server-side token invalidation
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};