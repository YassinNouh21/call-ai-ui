'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase'; // For getAuthToken if needed, or use a shared fetchWithAuth

// Define a type for the organization data (consistent with select-organization/page.tsx)
interface Organization {
  id: string;
  name: string;
}

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Simplified fetchWithAuth - ideally, this should be a shared utility
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  const headers = new Headers(options.headers || {});
  headers.append('Authorization', `Bearer ${token}`);
  if (options.body && typeof options.body === 'string') {
    try {
      JSON.parse(options.body);
      if (!headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
      }
    } catch (e) { /* Not JSON */ }
  }
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: [{ msg: response.statusText }] }));
    const message = errorData.detail?.[0]?.msg || response.statusText || 'API request failed';
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export default function OrganizationSwitcherDropdown() {
  const { selectedOrganizationId, setSelectedOrganizationId, user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgName, setCurrentOrgName] = useState<string>('Select Organization');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrgs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const orgs = await fetchWithAuth<Organization[]>(`${API_BASE_URL}/api/v1/organizations/orgs`);
        setOrganizations(orgs);
        if (orgs.length === 0) {
            setError('No organizations found.');
             setCurrentOrgName('No Orgs');
        }
      } catch (err: any) {
        console.error('Failed to fetch organizations for switcher:', err);
        setError(err.message || 'Failed to load orgs.');
        setCurrentOrgName('Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgs();
  }, [user]);

  useEffect(() => {
    if (selectedOrganizationId && organizations.length > 0) {
      const selectedOrg = organizations.find(org => org.id === selectedOrganizationId);
      setCurrentOrgName(selectedOrg ? selectedOrg.name : 'Select Organization');
    } else if (organizations.length > 0 && !selectedOrganizationId) {
      // If no org is selected but orgs are loaded, prompt to select
      setCurrentOrgName('Select Organization');
    } else if (organizations.length === 0 && !isLoading && !error) {
        setCurrentOrgName('No Orgs');
    }
  }, [selectedOrganizationId, organizations, isLoading, error]);

  const handleSelectOrg = (orgId: string) => {
    setSelectedOrganizationId(orgId);
    setIsOpen(false);
    // The AuthContext change should trigger relevant UI updates/redirects if necessary
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || isLoading && organizations.length === 0) {
    return (
        <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md">
                Loading Orgs...
            </button>
        </div>
    );
  }
  
  if (error && organizations.length === 0) {
     return (
        <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-700 rounded-md" title={error}>
                Error
            </button>
        </div>
    );
  }

  // If no orgs and not loading and no error (e.g. user has no orgs)
  if (organizations.length === 0 && !isLoading) {
    return (
        <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md">
                No Organizations
            </button>
        </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
      >
        <span className="truncate max-w-[150px] lg:max-w-[200px]">{currentOrgName}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1 overflow-y-auto max-h-60" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {organizations.length > 0 ? organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrg(org.id)}
                className={`block w-full text-left px-4 py-2 text-sm ${selectedOrganizationId === org.id ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white`}
                role="menuitem"
              >
                {org.name}
              </button>
            )) : (
                 <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No organizations available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 