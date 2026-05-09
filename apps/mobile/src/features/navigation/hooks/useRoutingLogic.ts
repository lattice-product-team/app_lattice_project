import { useEffect, useMemo, useRef } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { useEventStore } from '../../event/store/useEventStore';
import { navigationService } from '../services/navigationService';
import { useLocationStore } from '../../../store/useLocationStore';

export const useRoutingLogic = () => {
  const { selectedPoiId, selectedPoi, setRemote } = usePOIStore();
  const { selectedEvent } = useEventStore();
  const { setRoutes, setNextInstruction, transportMode, setFetching, isPlanning } = useNavigationStore();

  const { logicalCoords: userCoords } = useLocationStore();

  const isRemote = useMemo(() => {
    if (!userCoords || !selectedEvent?.center) return false;
    // Basic remote check
    return false;
  }, [userCoords, selectedEvent]);

  useEffect(() => {
    setRemote(isRemote);
  }, [isRemote, setRemote]);

  const lastFetchCoords = useRef<[number, number] | null>(null);
  const REFETCH_THRESHOLD_METERS = 30; // Only re-route if moved significantly

  const calculateDistance = (c1: [number, number], c2: [number, number]) => {
    const R = 6371e3;
    const φ1 = (c1[1] * Math.PI) / 180;
    const φ2 = (c2[1] * Math.PI) / 180;
    const Δφ = ((c2[1] - c1[1]) * Math.PI) / 180;
    const Δλ = ((c2[0] - c1[0]) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchBothRoutes = async () => {
      const destinationCoords = selectedPoi?.coordinates || selectedEvent?.center?.coordinates || (selectedEvent as any)?.coordinates;
      const destinationName = selectedPoi?.displayName || selectedEvent?.name || '';

      if (!destinationCoords || !userCoords) return;

      // Professional Throttling: Only re-fetch if we are in planning or if we moved > threshold
      const isInitialFetch = !lastFetchCoords.current;
      const distanceMoved = lastFetchCoords.current ? calculateDistance(userCoords, lastFetchCoords.current) : 0;
      
      // If we are navigating, be more conservative with API calls
      if (!isPlanning && !isInitialFetch && distanceMoved < REFETCH_THRESHOLD_METERS) {
        return;
      }

      console.log(`[Logic] 🛰 Fetching triple routes for: ${destinationName} (${isPlanning ? 'Planning' : 'Navigating'})`);
      if (isPlanning) setFetching(true);

      try {
        const origin = { lat: userCoords[1], lng: userCoords[0] };
        const destination = { lat: destinationCoords[1], lng: destinationCoords[0] };

        const [driving, walking, bicycle] = await Promise.all([
          navigationService.getRoute({ origin, destination, mode: 'driving', timestamp: Date.now() }),
          navigationService.getRoute({ origin, destination, mode: 'walking', timestamp: Date.now() }),
          navigationService.getRoute({ origin, destination, mode: 'bicycle', timestamp: Date.now() }),
        ]);

        const routes = { driving, walking, bicycle };
        const metadata = {
          driving: { distance: driving.properties.distance, duration: driving.properties.durationEstimate, destinationName },
          walking: { distance: walking.properties.distance, duration: walking.properties.durationEstimate, destinationName },
          bicycle: { distance: bicycle.properties.distance, duration: bicycle.properties.durationEstimate, destinationName },
        };

        setRoutes(routes, metadata);
        lastFetchCoords.current = userCoords;
        
        const currentRoute = routes[transportMode];
        if (currentRoute?.maneuvers?.length > 0) {
          setNextInstruction(currentRoute.maneuvers[0]);
        }
      } catch (error) {
        console.error('[Logic] ❌ Route fetch failed:', error);
        if (isPlanning) setFetching(false);
      }
    };

    fetchBothRoutes();
  }, [selectedPoiId, selectedEvent?.id, userCoords, isPlanning, transportMode]);

  // Handle instruction updates when transportMode changes (instant)
  useEffect(() => {
    const routes = useNavigationStore.getState().routes;
    const currentRoute = routes[transportMode];
    if (currentRoute?.maneuvers && currentRoute.maneuvers.length > 0) {
      setNextInstruction(currentRoute.maneuvers[0]);
    }
  }, [transportMode, setNextInstruction]);

  return { isRemote };
};
