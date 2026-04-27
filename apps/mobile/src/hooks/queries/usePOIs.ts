import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../services/geoService';

export const usePOIs = (category?: string, eventId?: number) => {
  return useQuery({
    queryKey: ['pois', category, eventId],
    queryFn: () => geoService.getPOIs(category, eventId),
  });
};
