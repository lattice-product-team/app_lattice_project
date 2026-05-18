import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../../hooks/useSocket';
import * as Haptics from 'expo-haptics';

/**
 * Hook to synchronize events and POIs in real-time via WebSockets.
 * Listens for global sync events and invalidates the corresponding React Query caches.
 */
export const useEventSync = () => {
  const { subscribe, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isConnected) return;

    // 1. Sync Global Events (Creation/Update/Deletion)
    const unsubscribeEvents = subscribe('sync:events', (payload: any) => {
      console.log('[Sync] Event update received:', payload);
      queryClient.invalidateQueries({ queryKey: ['events-search'] });

      // Optional: Visual/Haptic feedback if it's a new event
      if (payload.action === 'created') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });

    // 2. Sync Global POIs
    const unsubscribePois = subscribe('sync:pois', (payload: any) => {
      console.log('[Sync] POI update received:', payload);
      queryClient.invalidateQueries({ queryKey: ['pois'] });
    });

    // 3. Sync Specific Event Spatial Data (Boundaries/Internal POIs)
    const unsubscribeSpatial = subscribe('sync:event:spatial', (payload: any) => {
      console.log('[Sync] Spatial update received for event:', payload.id);
      queryClient.invalidateQueries({ queryKey: ['event-spatial', parseInt(payload.id, 10)] });
      queryClient.invalidateQueries({ queryKey: ['pois'] }); // POIs might have changed too
    });

    return () => {
      if (unsubscribeEvents) unsubscribeEvents();
      if (unsubscribePois) unsubscribePois();
      if (unsubscribeSpatial) unsubscribeSpatial();
    };
  }, [isConnected, subscribe, queryClient]);

  return { isConnected };
};
