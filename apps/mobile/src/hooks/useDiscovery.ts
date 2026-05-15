import { useQuery } from '@tanstack/react-query';
import { geoService } from '../services/geoService';
import { DiscoveryFeed } from '../types';
import { useLocationStore } from '../store/useLocationStore';
import { useMapUIStore } from '../features/map/store/useMapUIStore';

export function useDiscovery() {
  const { logicalCoords } = useLocationStore();
  const { discoveryLocation } = useMapUIStore();
  
  // Prioritize locked discovery location if it exists, fallback to logicalCoords
  const finalCoords = discoveryLocation || logicalCoords;
  const lng = finalCoords?.[0];
  const lat = finalCoords?.[1];

  return useQuery({
    queryKey: ['discovery-feed', lat, lng],
    queryFn: async () => {
      if (!lat || !lng) return { sections: [] } as any;
      const response = await geoService.getDiscoveryFeed(lat, lng);
      return response as DiscoveryFeed;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: !!lat && !!lng,
    placeholderData: (previousData) => previousData,
  });
}
