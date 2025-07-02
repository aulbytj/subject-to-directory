import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase-client';
import { Profile } from '@/lib/supabase';

const supabase = getSupabaseClient();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let authStateChangeCount = 0;

    // Get initial session - handle auth state properly
    const getInitialSession = async () => {
      try {
        // Add a small delay to let auth state settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (sessionError) {
          // Only log errors that aren't about missing sessions
          if (!sessionError.message.includes('Auth session missing')) {
            console.error('Session error:', sessionError);
          }
        }

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          // Clear auth state for unauthenticated users
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with strict event filtering
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        // Only log meaningful auth events
        if (event === 'SIGNED_OUT' || (event === 'SIGNED_IN' && !user)) {
          authStateChangeCount++;
          console.log(`Auth state change #${authStateChangeCount}:`, event, !!session);
        } else if (event === 'SIGNED_IN' && user) {
          // Ignore redundant SIGNED_IN events when already authenticated
          console.log('Ignoring redundant SIGNED_IN event (already authenticated)');
          return;
        }

        // Prevent infinite loops
        if (authStateChangeCount > 10) {
          console.warn('Too many auth state changes, possible infinite loop');
          return;
        }

        // Handle only essential auth events
        if (event === 'SIGNED_IN' && session?.user && !user) {
          // Only handle SIGNED_IN if we weren't previously authenticated
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user && user) {
          // Silent token refresh - only update session
          setSession(session);
        }
        // Ignore all other events (INITIAL_SESSION, redundant SIGNED_IN, etc.)
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent re-running

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch exception:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await auth.signIn({ email, password });
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, full_name: string, role: 'buyer' | 'seller' | 'both') => {
    setLoading(true);
    const result = await auth.signUp({ email, password, full_name, role });
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await auth.signOut();
    setProfile(null);
    setLoading(false);
    // Navigate to home page after sign out
    router.push('/');
    return result;
  };

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
}