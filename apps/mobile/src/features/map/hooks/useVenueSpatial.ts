import { useState, useEffect } from 'react';
import { geoService } from '../../../services/geoService';

export const useVenueSpatial = (venueId?: number | null) => {
  const [spatialData, setSpatialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!venueId) {
      setSpatialData(null);
      return;
    }

    const fetchSpatial = async () => {
      setLoading(true);
      try {
        const data = await geoService.getVenueSpatial(venueId);
        setSpatialData(data);
      } catch (error) {
        console.error('Failed to fetch venue spatial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpatial();
  }, [venueId]);

  return { spatialData, loading };
};
