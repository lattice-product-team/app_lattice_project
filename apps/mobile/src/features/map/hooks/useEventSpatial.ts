import { useState, useEffect } from 'react';
import { geoService } from '../../../services/geoService';

export const useEventSpatial = (eventId?: number | null) => {
  const [spatialData, setSpatialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setSpatialData(null);
      return;
    }

    const fetchSpatial = async () => {
      setLoading(true);
      try {
        const data = await geoService.getEventSpatial(eventId);
        setSpatialData(data);
      } catch (error) {
        console.error('Failed to fetch event spatial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpatial();
  }, [eventId]);

  return { spatialData, loading };
};
