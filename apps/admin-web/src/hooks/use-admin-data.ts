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
export function useAdminFetch<T>(endpoint: string, interval = 5000) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      
      if (endpoint.endsWith('s') && !Array.isArray(jsonData) && !endpoint.includes('/') && !endpoint.includes('?')) {
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
    
    // Polling for real-time updates
    const timer = setInterval(() => fetchData(true), interval);
    return () => clearInterval(timer);
  }, [fetchData, interval]);

  return { ...state, refetch: () => fetchData() };
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
  return { stats: data || { activeEvents: 0, liveUsers: 0, activeAlerts: 0, totalCapacity: 0 }, loading, error, refetch };
}

export function useEventStats(eventId?: string) {
  const { data, loading, error, refetch } = useAdminFetch<any>(eventId ? `/events/${eventId}/stats` : '/stats');
  return { stats: data, loading, error, refetch };
}

export function usePOIs(eventId?: string) {
  const endpoint = eventId ? `/pois?eventId=${eventId}` : '/pois';
  const { data, loading, error, refetch } = useAdminFetch<any>(endpoint);
  return { 
    pois: data?.features?.map((f: any) => ({
      id: f.properties.id,
      ...f.properties,
      geometry: f.geometry
    })) || [], 
    loading, 
    error, 
    refetch 
  };
}
