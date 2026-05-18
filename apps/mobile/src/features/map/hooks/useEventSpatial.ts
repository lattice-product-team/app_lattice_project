import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../../services/geoService';

export const useEventSpatial = (eventId?: number | null) => {
  const {
    data: spatialData,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['eventSpatial', eventId],
    queryFn: () => (eventId ? geoService.getEventSpatial(eventId) : null),
    enabled: !!eventId,
  });

  return { spatialData, loading, refetch };
};
