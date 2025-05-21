'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase'; // Assuming supabase client is here for token

// Define a type for the organization data based on backend.md
interface Organization {
  id: string;
  name: string;
  created_at: string;
}

// Define a type for the API error response based on backend.md
interface ApiErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ApiError {
  detail: ApiErrorDetail[];
}

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Utility function to get the auth token
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// Utility function for making authenticated API calls
async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const headers = new Headers(options.headers || {});
  headers.append('Authorization', `Bearer ${token}`);
  
  // Ensure Content-Type is set for POST/PUT/PATCH if body is JSON
  if (options.body && typeof options.body === 'string') {
    try {
      JSON.parse(options.body); // Check if body is JSON string
      if (!headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
      }
    } catch (e) {
      // Not a JSON string, Content-Type might be different (e.g. form-data)
      // Or it might be intentionally omitted
    }
  }


  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, use text
      errorData = { detail: [{ msg: await response.text(), type: 'network_error', loc: [] }] };
    }
    console.error('API Error:', errorData);
    // Try to extract a meaningful message
    const message = errorData.detail?.[0]?.msg || response.statusText || 'API request failed';
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}


export default function SelectOrganizationPage() {
  const { user, setSelectedOrganizationId, loading: authLoading, selectedOrganizationId, signOut } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin'); // Redirect if not logged in
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !selectedOrganizationId) { // Only fetch if user is loaded and no org is selected yet
      const fetchOrganizations = async () => {
        setLoadingOrgs(true);
        setError(null);
        try {
          const orgs = await fetchWithAuth<Organization[]>(`${API_BASE_URL}/api/v1/organizations/orgs`);
          console.log('orgs', orgs);
          setOrganizations(orgs);

          if (orgs.length === 1) {
            // If only one org, auto-select and redirect
            handleSelectOrganization(orgs[0].id);
          } else if (orgs.length === 0) {
            setError('You are not a member of any organization.');
            // Optionally, redirect to a "create organization" page or show relevant UI
            // For now, just shows an error.
          }
        } catch (err: any) {
          console.error('Failed to fetch organizations:', err);
          setError(err.message || 'Failed to load organizations.');
        } finally {
          setLoadingOrgs(false);
        }
      };
      fetchOrganizations();
    } else if (user && selectedOrganizationId) {
      // If an org is already selected (e.g. from localStorage in AuthContext), redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, setSelectedOrganizationId, router, selectedOrganizationId]);

  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrganizationId(orgId); // This will also save to localStorage via AuthContext
    router.push('/dashboard'); // Navigate to the main dashboard
  };
  
  const handleCreateOrganization = () => {
    // router.push('/create-organization'); // TODO: Implement create organization page
    alert("Redirecting to create organization page (not yet implemented)");
  }

  if (authLoading || loadingOrgs) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your information...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
     // This case should ideally be handled by the redirect in the first useEffect, 
     // but as a fallback or if redirects are slow.
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <p className="text-lg font-medium text-gray-700">Redirecting to sign-in...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Select Your Organization
          </h2>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.293-8.707a1 1 0 00-1.414-1.414L10 10.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L10 13.414l1.293 1.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {organizations.length > 0 ? (
          <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {organizations.map((org) => (
              <li key={org.id}>
                <button
                  onClick={() => handleSelectOrganization(org.id)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-6 py-4 text-left text-lg font-medium text-gray-800 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>{org.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !error && !loadingOrgs && ( // Show only if not loading and no explicit error message (which implies no orgs)
            <p className="text-center text-gray-600">You are not yet part of any organization.</p>
          )
        )}
        
        {/* Placeholder for Create Organization button/link */}
        {organizations.length === 0 && !loadingOrgs && (
             <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                <p className="text-gray-600 mb-4">Don't see your organization or want to start a new one?</p>
                <button
                    onClick={handleCreateOrganization}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Create New Organization
                </button>
            </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              await signOut();
              // AuthContext signOut should handle redirect to /signin
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}