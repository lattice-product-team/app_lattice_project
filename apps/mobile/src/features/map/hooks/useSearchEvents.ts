import { useState, useEffect, useMemo } from 'react';
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
  const [events, setEvents] = useState<SearchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await geoService.getEvents();
        setEvents(data);
        setError(null);
      } catch (e) {
        console.error('Failed to fetch events for search', e);
        setError('Could not load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
