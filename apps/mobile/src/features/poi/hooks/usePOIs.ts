import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../../services/geoService';
import { offlineService } from '../../../services/offlineService';

export const usePOIs = (category?: string, eventId?: number) => {
  return useQuery({
    queryKey: ['pois', category, eventId],
    queryFn: async () => {
      try {
        return await geoService.getPOIs(category, eventId);
      } catch (error) {
        if (eventId) {
          const offlineData = offlineService.getOfflinePOIs(eventId);
          if (offlineData) return offlineData;
        }
        throw error;
      }
    },
    placeholderData: (previousData) => previousData,
  });
};
