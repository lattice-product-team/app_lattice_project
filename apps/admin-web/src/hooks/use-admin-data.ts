"use client";

import { useState, useEffect, useCallback } from 'react';

const API_BASE = "http://localhost:3000/api/v1";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * A centralized hook for fetching administrative data with 
 * built-in validation and error handling.
 */
export function useAdminFetch<T>(endpoint: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      
      // Defensive check: ensure lists are actually arrays
      if (endpoint.endsWith('s') && !Array.isArray(jsonData) && !endpoint.includes('/')) {
         // This is a heuristic for list endpoints like /venues or /events
         // If it's a list but not an array, it's an error state
         throw new Error("Invalid data format received from server.");
      }

      setState({ data: jsonData, loading: false, error: null });
    } catch (err: any) {
      console.error(`[useAdminFetch] Error fetching ${endpoint}:`, err);
      setState({ 
        data: null, 
        loading: false, 
        error: err.message || "An unexpected error occurred" 
      });
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useVenues() {
  const { data, loading, error, refetch } = useAdminFetch<any[]>('/venues');
  return { venues: data || [], loading, error, refetch };
}

export function useEvents() {
  const { data, loading, error, refetch } = useAdminFetch<any[]>('/events');
  return { events: data || [], loading, error, refetch };
}

export function useStats() {
  const { data, loading, error, refetch } = useAdminFetch<any>('/stats');
  return { stats: data || { activeEvents: 0, liveUsers: 0, activeAlerts: 0, totalVenues: 0 }, loading, error, refetch };
}
