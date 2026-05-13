import { useQuery } from '@tanstack/react-query';
import { geoService } from '../services/geoService';
import { DiscoveryFeed } from '../types';
import { useLocationStore } from '../store/useLocationStore';

export function useDiscovery() {
  const { location } = useLocationStore();

  return useQuery({
    queryKey: ['discovery-feed', location?.coords.latitude, location?.coords.longitude],
    queryFn: async () => {
      const response = await geoService.getDiscoveryFeed(
        location?.coords.latitude,
        location?.coords.longitude
      );
      return response as DiscoveryFeed;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
