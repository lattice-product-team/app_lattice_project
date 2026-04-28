import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../../services/geoService';
import { offlineService } from '../../../services/offlineService';

export const usePathNetwork = (eventId?: number | null) => {
  return useQuery({
    queryKey: ['pathNetwork', eventId],
    queryFn: async () => {
      try {
        return await geoService.getPathNetwork();
      } catch (error) {
        if (eventId) {
          const offlineData = offlineService.getOfflineNetwork(eventId);
          if (offlineData) return offlineData;
        }
        throw error;
      }
    },
  });
};
