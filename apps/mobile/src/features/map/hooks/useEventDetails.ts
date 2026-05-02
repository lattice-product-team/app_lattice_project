import { useState, useEffect } from 'react';
import { LatticeEvent } from '../../../types';
import { geoService } from '../../../services/geoService';

export interface EventDetails extends LatticeEvent {
  description?: string;
  rating?: number;
  reviewsCount?: number;
  openingHours?: string;
  distance?: string;
  website?: string;
  phone?: string;
}

export const useEventDetails = (eventId: string | null) => {
  const [details, setDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await geoService.getEvent(Number(eventId));
        
        // Parse metadata if it exists and is a string
        let metadataObj = {};
        if (data.metadata) {
          if (typeof data.metadata === 'string') {
            try {
              metadataObj = JSON.parse(data.metadata);
            } catch (e) {
              console.warn('Failed to parse metadata JSON', e);
            }
          } else {
            metadataObj = data.metadata;
          }
        }

        setDetails({
          ...data,
          ...metadataObj,
          openingHours: 'Open', // Mocking for now as it's not in DB yet
          distance: '900m',    // Mocking for now
        });
        setError(null);
      } catch (e) {
        console.error('Failed to fetch event details', e);
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId]);

  return { details, loading, error };
};
