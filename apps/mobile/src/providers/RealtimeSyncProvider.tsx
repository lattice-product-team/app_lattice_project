import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../hooks/useSocket';

const RealtimeSyncContext = createContext<{ isConnected: boolean }>({ isConnected: false });

export const useRealtimeSync = () => useContext(RealtimeSyncContext);

export const RealtimeSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, subscribe } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isConnected) return;

    console.log('[RealtimeSync] Subscribing to sync events...');

    // 1. Sync POIs
    const unsubscribePois = subscribe('sync:pois', (data: { action: string; id: number; eventId?: number }) => {
      console.log(`[RealtimeSync] POI ${data.action}: ${data.id}. Invalidating cache.`);
      queryClient.invalidateQueries({ queryKey: ['pois'] });
      queryClient.invalidateQueries({ queryKey: ['discovery-feed'] });
      queryClient.invalidateQueries({ queryKey: ['eventSpatial'] });
    });

    // 2. Sync Events
    const unsubscribeEvents = subscribe('sync:events', (data: { action: string; id: number }) => {
      console.log(`[RealtimeSync] Event ${data.action}: ${data.id}. Invalidating cache.`);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['discovery-feed'] });
      queryClient.invalidateQueries({ queryKey: ['eventSpatial'] });
    });

    // 3. Sync Spatial Data (Boundaries & Path Network)
    const unsubscribeSpatial = subscribe('sync:event:spatial', (data: { id: string }) => {
      console.log(`[RealtimeSync] Spatial Data updated for event ${data.id}. Invalidating cache.`);
      queryClient.invalidateQueries({ queryKey: ['pathNetwork'] });
      queryClient.invalidateQueries({ queryKey: ['pois'] });
      queryClient.invalidateQueries({ queryKey: ['eventSpatial'] });
    });

    return () => {
      unsubscribePois?.();
      unsubscribeEvents?.();
      unsubscribeSpatial?.();
      console.log('[RealtimeSync] Unsubscribed from sync events');
    };
  }, [isConnected, subscribe, queryClient]);

  return (
    <RealtimeSyncContext.Provider value={{ isConnected }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
};
