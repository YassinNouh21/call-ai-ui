'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  selectedOrganizationId: string | null;
  setSelectedOrganizationId: (orgId: string | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedOrganizationId');
    }
    return null;
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedOrganizationId) {
        localStorage.setItem('selectedOrganizationId', selectedOrganizationId);
      } else {
        localStorage.removeItem('selectedOrganizationId');
      }
    }
  }, [selectedOrganizationId]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setError(sessionError.message);
      }
      const currentSessionUser = session?.user ?? null;
      setUser(currentSessionUser);

      if (currentSessionUser) {
        if (selectedOrganizationId) {
          // User logged in, org selected, ensure they are on or go to dashboard
          // No immediate push here, onAuthStateChange will handle it more consistently
          // or a check after setLoading(false) could decide.
        } else {
          // User logged in, no org selected, go to selection
          router.push('/select-organization');
        }
      } else {
        // No user session, go to signin
        router.push('/signin');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentEventUser = session?.user ?? null;
      setUser(currentEventUser);

      if (_event === 'SIGNED_IN') {
        // User just signed in.
        // selectedOrganizationId would have been initialized from localStorage earlier.
        // If it's still null, then no org was stored.
        const orgIdFromStorage = typeof window !== 'undefined' ? localStorage.getItem('selectedOrganizationId') : null;
        if (orgIdFromStorage) {
          if (selectedOrganizationId !== orgIdFromStorage) { // Update state if it's different
            setSelectedOrganizationId(orgIdFromStorage);
          }
          router.push('/dashboard');
        } else {
          // Clear any potentially stale selectedOrganizationId in state if nothing in storage
          if (selectedOrganizationId !== null) {
            setSelectedOrganizationId(null); // This will also clear localStorage via the other useEffect
          }
          router.push('/select-organization');
        }
      } else if (_event === 'SIGNED_OUT') {
        setSelectedOrganizationId(null); // This will also clear localStorage
        router.push('/signin');
      } else if (_event === 'USER_UPDATED' || _event === 'TOKEN_REFRESHED') {
        // User session might have changed, or token refreshed.
        // Ensure selectedOrganizationId is still valid or re-check.
        if (currentEventUser && !selectedOrganizationId) {
            const orgIdFromStorage = typeof window !== 'undefined' ? localStorage.getItem('selectedOrganizationId') : null;
            if (orgIdFromStorage) {
                setSelectedOrganizationId(orgIdFromStorage);
                // Don't push to dashboard here if already on it or another valid page.
                // Let page-specific logic or a final check handle this.
            } else {
                 // Only push if not already on select-organization to avoid loops
                if (window.location.pathname !== '/select-organization') {
                   router.push('/select-organization');
                }
            }
        }
      }
      setLoading(false); // Set loading to false after initial session check and auth listener setup
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const clearError = () => {
    setError(null);
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      // Clear any previously selected org on new sign-in attempt
      setSelectedOrganizationId(null);
      localStorage.removeItem('selectedOrganizationId');
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
      // Redirection will be handled by onAuthStateChange after callback
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // Clear any previously selected org on new sign-in attempt
      setSelectedOrganizationId(null);
      localStorage.removeItem('selectedOrganizationId');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      // Redirection will be handled by onAuthStateChange
    } catch (err: any) {
      console.error('Error signing in with email:', err);
      setError(err.message || 'Failed to sign in with email');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // Clear any previously selected org on new sign-up attempt
      setSelectedOrganizationId(null);
      localStorage.removeItem('selectedOrganizationId');
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) throw signUpError;
      // Redirection will be handled by onAuthStateChange after callback and email confirmation
    } catch (err: any) {
      console.error('Error signing up with email:', err);
      setError(err.message || 'Failed to sign up with email');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      // onAuthStateChange will handle clearing selectedOrganizationId and redirecting
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    selectedOrganizationId,
    setSelectedOrganizationId,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 