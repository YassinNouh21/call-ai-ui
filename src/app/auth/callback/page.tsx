'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext'; // To potentially access user or loading state if needed

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Get user and loading state

  useEffect(() => {
    // Supabase handles the session automatically on the client side when it detects the OAuth params in the URL.
    // The onAuthStateChange listener in AuthContext will then pick up the new session.
    // We just need to ensure this page exists and runs client-side JavaScript.
    
    // The redirect logic is now primarily handled by AuthContext.
    // However, we can add a fallback or initial push here once auth state is resolved.

    // If auth is still loading, wait.
    if (authLoading) {
      return;
    }

    // If user is available, AuthContext should have redirected already.
    // If not, and auth is not loading, it implies the callback might not have resulted in a session, or it's still processing.
    // In a robust app, you might handle errors here if Supabase signals one from the hash.
    // For now, we rely on AuthContext's onAuthStateChange to manage redirects post-authentication.
    // If after a short delay, nothing happens, it might be good to push to a default page.
    
    // Example: If after callback processing, user is set, AuthContext handles it.
    // If user is NOT set after auth is no longer loading, maybe go to signin.
    if (!user && !authLoading) {
        // This might happen if the OAuth flow failed or was cancelled by the user
        // Or if it's a very brief moment before onAuthStateChange from AuthContext kicks in.
        // A small timeout can prevent a flash to signin if AuthContext is about to redirect.
        const timer = setTimeout(() => {
            if (!supabase.auth.getSession()) { // Check session directly just in case context is stale
                 router.push('/signin');
            }
            // If session exists, AuthContext will handle it.
        }, 1000); // Wait 1 second before deciding to push to signin
        return () => clearTimeout(timer);
    }

    // If user is present, AuthContext.tsx handles the redirect to /select-organization or /dashboard
    // So, this page primarily serves as the Supabase designated callback URL.

  }, [router, user, authLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-medium text-gray-700">Processing authentication...</p>
        <p className="text-sm text-gray-500">Please wait, you will be redirected shortly.</p>
      </div>
    </div>
  );
} 