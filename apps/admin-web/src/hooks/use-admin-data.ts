'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

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

  const fetchData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch(`${API_BASE}${endpoint}`);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();

        if (
          endpoint.endsWith('s') &&
          !Array.isArray(jsonData) &&
          !endpoint.includes('/') &&
          !endpoint.includes('?')
        ) {
          throw new Error('Invalid data format received from server.');
        }

        setState({ data: jsonData, loading: false, error: null });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error(`[useAdminFetch] Error fetching ${endpoint}:`, err);
        setState({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    [endpoint]
  );

  useEffect(() => {
    let isMounted = true;

    // Defer initial fetch to avoid synchronous setState in effect
    const timerId = setTimeout(() => {
      if (isMounted) void fetchData();
    }, 0);

    // Polling for real-time updates
    const intervalId = setInterval(() => {
      if (isMounted) void fetchData(true);
    }, interval);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [fetchData, interval]);

  return { ...state, refetch: () => void fetchData() };
}

export function useEvents() {
  const { data, loading, error, refetch } = useAdminFetch<Event[]>('/events');
  const events = useMemo(() => data || [], [data]);
  return { events, loading, error, refetch };
}

export function useStats() {
  const { data, loading, error, refetch } = useAdminFetch<{
    activeEvents: number;
    liveUsers: number;
    activeAlerts: number;
    totalCapacity: number;
  }>('/stats');
  const stats = useMemo(
    () => data || { activeEvents: 0, liveUsers: 0, activeAlerts: 0, totalCapacity: 0 },
    [data]
  );
  return {
    stats,
    loading,
    error,
    refetch,
  };
}

export function useEventStats(eventId?: string) {
  const { data, loading, error, refetch } = useAdminFetch<any>(
    eventId ? `/events/${eventId}/stats` : '/stats'
  );

  // Map global stats to event stats structure if needed
  const stats = useMemo(() => data
    ? {
        estimatedCapacity: data.estimatedCapacity ?? data.totalCapacity ?? 0,
        entryRate: data.entryRate ?? 0,
        staffOnline: data.staffOnline ?? 0,
        activeAlerts: data.activeAlerts ?? 0,
      }
    : null, [data]);

  return { stats, loading, error, refetch };
}

export function usePOIs(eventId?: string) {
  const endpoint = eventId ? `/pois?eventId=${eventId}` : '/pois';
  const { data, loading, error, refetch } = useAdminFetch<any>(endpoint);
  const pois = useMemo(() => 
    data?.features?.map((f: { properties: any; geometry: { coordinates: [number, number] } }) => ({
      id: f.properties.id,
      ...f.properties,
      geometry: f.geometry,
    })) || [],
    [data]
  );
  return {
    pois,
    loading,
    error,
    refetch,
  };
}
