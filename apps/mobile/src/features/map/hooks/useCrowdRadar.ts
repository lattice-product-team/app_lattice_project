import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/apiClient';

/**
 * Hook to fetch crowd density telemetry for an event.
 */
export const useCrowdRadar = (eventId: number | null | undefined) => {
  return useQuery({
    queryKey: ['telemetry', 'heatmap', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const data = await apiClient.get<any>(`/telemetry/heatmap/${eventId}`);
      return data || null;
    },
    enabled: !!eventId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};
