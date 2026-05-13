import { useQuery } from '@tanstack/react-query';
import { geoService } from '../services/geoService';
import { DiscoveryFeed } from '../types';
import { useLocationStore } from '../store/useLocationStore';

export function useDiscovery() {
  const { coords } = useLocationStore();
  const lng = coords?.[0];
  const lat = coords?.[1];

  return useQuery({
    queryKey: ['discovery-feed', lat, lng],
    queryFn: async () => {
      const response = await geoService.getDiscoveryFeed(lat, lng);
      return response as DiscoveryFeed;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
