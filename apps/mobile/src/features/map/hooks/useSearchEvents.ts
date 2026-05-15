import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../../services/geoService';

export interface SearchEvent {
  id: number;
  name: string;
  type: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  center?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const useSearchEvents = (query: string) => {
  const {
    data: events = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['events-search', ''], // Static key for pre-fetching
    queryFn: () => geoService.getEvents(),
    placeholderData: (previousData) => previousData,
  });

  const filteredEvents = useMemo(() => {
    if (!query || query.trim() === '') {
      return events;
    }

    const searchLower = query.toLowerCase().trim();
    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchLower) ||
        event.type.toLowerCase().includes(searchLower)
    );
  }, [query, events]);

  return {
    events: filteredEvents,
    allEvents: events,
    loading,
    error,
  };
};
