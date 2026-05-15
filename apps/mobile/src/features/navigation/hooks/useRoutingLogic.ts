import { useEffect, useMemo, useRef } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { useEventStore } from '../../event/store/useEventStore';
import { navigationService } from '../services/navigationService';
import { useLocationStore } from '../../../store/useLocationStore';
import { useMapUIStore } from '../../map/store/useMapUIStore';

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

export const useRoutingLogic = () => {
  const { selectedPoiId, selectedPoi, setRemote } = usePOIStore();
  const { selectedEvent } = useEventStore();
  const { setRoutes, setNextInstruction, transportMode, setFetching, isPlanning } = useNavigationStore();

  const { logicalCoords: userCoords } = useLocationStore();

  const isRemote = useMemo(() => {
    if (!userCoords || (!selectedEvent?.center && !selectedPoi?.coordinates)) return false;
    const dest = selectedPoi?.coordinates || selectedEvent?.center?.coordinates || (selectedEvent as any)?.coordinates;
    if (!dest) return false;
    
    const dist = calculateDistance(userCoords as [number, number], dest as [number, number]);
    return dist > 50000; // More than 50km is considered remote
  }, [userCoords, selectedEvent, selectedPoi]);

  useEffect(() => {
    setRemote(isRemote);
  }, [isRemote, setRemote]);

  const lastFetchCoords = useRef<[number, number] | null>(null);
  const isFetchingRef = useRef(false);
  const lockedOrigin = useRef<[number, number] | null>(null);
  const lastDestinationId = useRef<string | null>(null);
  const REFETCH_THRESHOLD_METERS = 30; // Only re-route if moved significantly

  const lastIsPlanning = useRef(isPlanning);

  const userCoordsRef = useRef(userCoords);
  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  // When the destination changes and we're not in planning/navigating mode,
  // clear any stale route so the old polyline doesn't linger on the map.
  useEffect(() => {
    const { isNavigating } = useNavigationStore.getState();
    if (!isPlanning && !isNavigating) {
      setRoutes(
        { driving: null, walking: null, bicycle: null },
        { driving: null, walking: null, bicycle: null }
      );
      lastFetchCoords.current = null;
      lastDestinationId.current = null;
    }
  }, [selectedPoiId, selectedEvent?.id]);

  useEffect(() => {
    const fetchBothRoutes = async () => {
      const destId = selectedPoiId || selectedEvent?.id;
      const destinationCoords = selectedPoi?.coordinates || selectedEvent?.center?.coordinates || (selectedEvent as any)?.coordinates;
      const destinationName = selectedPoi?.displayName || selectedEvent?.name || '';
      const discoveryLocation = useMapUIStore.getState().discoveryLocation;
      const currentUserCoords = userCoordsRef.current;

      // Only calculate routes when the user explicitly requested it (planning) or is navigating.
      // Tapping a pin on the map should NOT trigger a route fetch.
      // Fetch routes when a target is selected to provide accurate data to the detail sheet
      const { isNavigating } = useNavigationStore.getState();

      if (!destinationCoords || !currentUserCoords || !destId || isFetchingRef.current) return;

      // Professional Throttling: Only re-fetch if:
      // 1. Initial fetch for this destination
      // 2. We moved significantly
      // 3. We are in planning mode (always update)
      // 4. We JUST transitioned from planning to navigating (force fresh route for start)
      
      const isInitialFetch = !lastFetchCoords.current || lastDestinationId.current !== destId;
      const justStartedNavigating = lastIsPlanning.current && !isPlanning;
      
      // Lock the origin if this is the first fetch for this destination
      // We prioritize discoveryLocation if available (locked map center)
      if (isInitialFetch || !lockedOrigin.current) {
        lockedOrigin.current = discoveryLocation || currentUserCoords as [number, number];
      }

      const distanceMoved = lastFetchCoords.current ? calculateDistance(currentUserCoords as [number, number], lastFetchCoords.current) : 0;
      
      lastIsPlanning.current = isPlanning;

      // If we're planning, we ONLY fetch if it's the initial fetch for this destination.
      // We don't want to keep refetching just because the user is moving while looking at the sheet.
      if (isPlanning && !isInitialFetch) {
        return;
      }

      if (!isInitialFetch && distanceMoved < REFETCH_THRESHOLD_METERS && !isPlanning && !justStartedNavigating) {
        return;
      }

      console.log(`[Logic] 🛰 Fetching routes for: ${destinationName} (Remote: ${isRemote}, Mode: ${isPlanning ? 'Planning' : 'Navigating'})`);
      const currentStore = useNavigationStore.getState();
      const hasAnyRoute = !!(currentStore.metadata.driving || currentStore.metadata.walking || currentStore.metadata.bicycle);

      if (isPlanning && !hasAnyRoute) setFetching(true);
      isFetchingRef.current = true;
      lastDestinationId.current = destId as string;

      try {
        // Use lockedOrigin for Planning, or live currentUserCoords for active Navigation
        const effectiveOrigin = (isPlanning && lockedOrigin.current) ? lockedOrigin.current : currentUserCoords;
        if (!effectiveOrigin) return;

        const origin = { lat: effectiveOrigin[1], lng: effectiveOrigin[0] };
        const destination = { lat: destinationCoords[1], lng: destinationCoords[0] };

        // 1. Driving is always attempted
        const driving = await navigationService.getRoute({ origin, destination, mode: 'driving', timestamp: Date.now() }).catch(e => {
          console.warn('[Logic] Driving route failed:', e);
          return null;
        });

        // 2. Walking/Bicycle only if NOT remote
        let walking = null;
        let bicycle = null;

        if (!isRemote) {
          [walking, bicycle] = await Promise.all([
            navigationService.getRoute({ origin, destination, mode: 'walking', timestamp: Date.now() }).catch(() => null),
            navigationService.getRoute({ origin, destination, mode: 'bicycle', timestamp: Date.now() }).catch(() => null),
          ]);
        }

        const routes = { driving, walking, bicycle };
        
        // Only update if we have at least one successful route
        if (driving || walking || bicycle) {
          const metadata = {
            driving: driving ? { distance: driving.properties.distance, duration: driving.properties.durationEstimate, destinationName } : null,
            walking: walking ? { distance: walking.properties.distance, duration: walking.properties.durationEstimate, destinationName } : null,
            bicycle: bicycle ? { distance: bicycle.properties.distance, duration: bicycle.properties.durationEstimate, destinationName } : null,
          };

          setRoutes(routes, metadata);
          lastFetchCoords.current = currentUserCoords as [number, number];
          
          const currentRoute = routes[transportMode] || driving || walking || bicycle;
          if (currentRoute?.maneuvers?.length > 0) {
            setNextInstruction(currentRoute.maneuvers[0]);
          }
        }
      } catch (error) {
        console.error('[Logic] ❌ Route fetch failed:', error);
      } finally {
        if (isPlanning) setFetching(false);
        isFetchingRef.current = false;
      }
    };

    const timer = setTimeout(fetchBothRoutes, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [selectedPoiId, selectedEvent?.id, isPlanning, transportMode, isRemote, userCoords === null]); // Only re-run if target changes, mode changes, or location becomes available/unavailable


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
