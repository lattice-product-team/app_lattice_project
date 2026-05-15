import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../hooks/useSocket';

const RealtimeSyncContext = createContext<{ isConnected: boolean }>({ isConnected: false });

export const useRealtimeSync = () => useContext(RealtimeSyncContext);

export const RealtimeSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, subscribe } = useSocket();
  const queryClient = useQueryClient();

  const lastInvalidateRef = useRef<Record<string, number>>({});
  const THROTTLE_MS = 5000; // Only invalidate once every 5 seconds per category

  const throttleInvalidate = useCallback((keys: string[]) => {
    const now = Date.now();
    const compositeKey = keys.join(',');
    const lastTime = lastInvalidateRef.current[compositeKey] || 0;

    if (now - lastTime > THROTTLE_MS) {
      console.log(`[RealtimeSync] Throttled Invalidation for: ${compositeKey}`);
      keys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      lastInvalidateRef.current[compositeKey] = now;
    }
  }, [queryClient]);

  useEffect(() => {
    if (!isConnected) return;

    console.log('[RealtimeSync] Subscribing to sync events...');

    // 1. Sync POIs
    const unsubscribePois = subscribe('sync:pois', (data: { action: string; id: number; eventId?: number }) => {
      // console.log(`[RealtimeSync] POI ${data.action}: ${data.id}. Queuing invalidation.`);
      throttleInvalidate(['pois', 'discovery-feed', 'eventSpatial']);
    });

    // 2. Sync Events
    const unsubscribeEvents = subscribe('sync:events', (data: { action: string; id: number }) => {
      // console.log(`[RealtimeSync] Event ${data.action}: ${data.id}. Queuing invalidation.`);
      throttleInvalidate(['events', 'discovery-feed', 'eventSpatial']);
      
      if (data.action === 'created') {
        import('expo-haptics').then(Haptics => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        });
      }
    });

    // 3. Sync Spatial Data (Boundaries & Path Network)
    const unsubscribeSpatial = subscribe('sync:event:spatial', (data: { id: string }) => {
      // console.log(`[RealtimeSync] Spatial Data updated for event ${data.id}. Queuing invalidation.`);
      throttleInvalidate(['pathNetwork', 'pois', 'eventSpatial']);
    });

    return () => {
      unsubscribePois?.();
      unsubscribeEvents?.();
      unsubscribeSpatial?.();
      console.log('[RealtimeSync] Unsubscribed from sync events');
    };
  }, [isConnected, subscribe, throttleInvalidate]);

  return (
    <RealtimeSyncContext.Provider value={{ isConnected }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
};
