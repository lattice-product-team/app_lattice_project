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
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useRoutingLogic = () => {
  const { selectedPoiId, selectedPoi, setRemote } = usePOIStore();
  const { selectedEvent } = useEventStore();
  const { setRoutes, setNextInstruction, transportMode, setFetching, isPlanning } =
    useNavigationStore();

  // Use stable selectors for location to avoid unnecessary re-renders
  const userCoords = useLocationStore((s) => s.coords);
  const logicalCoords = useLocationStore((s) => s.logicalCoords);

  const isRemote = useMemo(() => {
    if (!logicalCoords || (!selectedEvent?.center && !selectedPoi?.coordinates)) return false;
    const dest =
      selectedPoi?.coordinates ||
      selectedEvent?.center?.coordinates ||
      (selectedEvent as any)?.coordinates;
    if (!dest) return false;

    const dist = calculateDistance(logicalCoords as [number, number], dest as [number, number]);
    return dist > 50000; // More than 50km is considered remote
  }, [logicalCoords?.[0], logicalCoords?.[1], selectedEvent, selectedPoi]);

  useEffect(() => {
    setRemote(isRemote);
  }, [isRemote, setRemote]);

  const lastFetchCoords = useRef<[number, number] | null>(null);
  const isFetchingRef = useRef(false);
  const lockedOrigin = useRef<[number, number] | null>(null);
  const lastDestinationId = useRef<string | null>(null);
  const REFETCH_THRESHOLD_METERS = 100; // Increased to be less aggressive
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL_MS = 5000; // Throttle to 5 seconds between fetches

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
  }, [selectedPoiId, selectedEvent?.id, isPlanning]);

  useEffect(() => {
    const fetchBothRoutes = async () => {
      const destId = selectedPoiId || selectedEvent?.id;
      const destinationCoords =
        selectedPoi?.coordinates ||
        selectedEvent?.center?.coordinates ||
        (selectedEvent as any)?.coordinates;
      const destinationName = selectedPoi?.displayName || selectedEvent?.name || '';
      const discoveryLocation = useMapUIStore.getState().discoveryLocation;
      const currentUserCoords = userCoordsRef.current;

      // Only calculate routes when the user explicitly requested it (planning) or is navigating.
      const { isNavigating } = useNavigationStore.getState();

      if (!destinationCoords || !currentUserCoords || !destId || isFetchingRef.current) return;

      const isInitialFetch = !lastFetchCoords.current || lastDestinationId.current !== destId;
      const justStartedNavigating = lastIsPlanning.current && !isPlanning && isNavigating;

      // Lock the origin if this is the first fetch for this destination
      if (isInitialFetch || !lockedOrigin.current) {
        lockedOrigin.current = discoveryLocation || (currentUserCoords as [number, number]);
      }

      const distanceMoved = lastFetchCoords.current
        ? calculateDistance(currentUserCoords as [number, number], lastFetchCoords.current)
        : 0;

      lastIsPlanning.current = isPlanning;

      // If we're planning, we ONLY fetch if it's the initial fetch for this destination.
      if (isPlanning && !isInitialFetch) {
        return;
      }

      // If we're navigating, we only re-fetch if we moved significantly (re-routing)
      // AND we haven't fetched too recently (throttle)
      const timeSinceLastFetch = Date.now() - lastFetchTime.current;
      if (!isInitialFetch && !isPlanning && !justStartedNavigating) {
        if (
          distanceMoved < REFETCH_THRESHOLD_METERS ||
          timeSinceLastFetch < MIN_FETCH_INTERVAL_MS
        ) {
          return;
        }
      }

      console.log(
        `[Logic] 🛰 Fetching routes for: ${destinationName} (Remote: ${isRemote}, Mode: ${isPlanning ? 'Planning' : 'Navigating'})`
      );
      const currentStore = useNavigationStore.getState();
      const hasAnyRoute = !!(
        currentStore.metadata.driving ||
        currentStore.metadata.walking ||
        currentStore.metadata.bicycle
      );

      if (isPlanning && !hasAnyRoute) setFetching(true);
      isFetchingRef.current = true;
      lastFetchTime.current = Date.now();
      lastDestinationId.current = destId as string;

      try {
        const effectiveOrigin =
          isPlanning && lockedOrigin.current ? lockedOrigin.current : currentUserCoords;
        if (!effectiveOrigin) return;

        const origin = { lat: effectiveOrigin[1], lng: effectiveOrigin[0] };
        const destination = { lat: destinationCoords[1], lng: destinationCoords[0] };

        // INITIAL PLANNING: Fetch all modes for comparison
        // ACTIVE NAVIGATION: ONLY fetch the current transport mode to save API quota (429 errors)

        let driving = null;
        let walking = null;
        let bicycle = null;

        if (isPlanning || isInitialFetch) {
          // CONCURRENT FETCHING: Request all modes in parallel for maximum speed
          console.log('[Logic] ⚡️ Initial Planning: Fetching all modes concurrently');

          const requests = [
            navigationService.getRoute({ origin, destination, mode: 'driving' }).catch((err) => {
              console.warn('[Logic] Driving route failed:', err);
              return null;
            }),
          ];

          if (!isRemote) {
            requests.push(
              navigationService.getRoute({ origin, destination, mode: 'walking' }).catch((err) => {
                console.warn('[Logic] Walking route failed:', err);
                return null;
              }),
              navigationService.getRoute({ origin, destination, mode: 'bicycle' }).catch((err) => {
                console.warn('[Logic] Bicycle route failed:', err);
                return null;
              })
            );
          }

          const results = await Promise.all(requests);
          driving = results[0];
          if (!isRemote) {
            walking = results[1];
            bicycle = results[2];
          }
        } else {
          // Re-routing during navigation: ONLY fetch the active mode
          if (transportMode === 'driving') {
            driving = await navigationService
              .getRoute({ origin, destination, mode: 'driving' })
              .catch(() => null);
          } else if (transportMode === 'walking' && !isRemote) {
            walking = await navigationService
              .getRoute({ origin, destination, mode: 'walking' })
              .catch(() => null);
          } else if (transportMode === 'bicycle' && !isRemote) {
            bicycle = await navigationService
              .getRoute({ origin, destination, mode: 'bicycle' })
              .catch(() => null);
          }
        }

        const routes = {
          driving: driving || (isPlanning ? null : currentStore.routes.driving),
          walking: walking || (isPlanning ? null : currentStore.routes.walking),
          bicycle: bicycle || (isPlanning ? null : currentStore.routes.bicycle),
        };

        if (driving || walking || bicycle) {
          const metadata = {
            driving: driving
              ? {
                  distance: driving.properties.distance,
                  duration: driving.properties.durationEstimate,
                  destinationName,
                }
              : currentStore.metadata.driving,
            walking: walking
              ? {
                  distance: walking.properties.distance,
                  duration: walking.properties.durationEstimate,
                  destinationName,
                }
              : currentStore.metadata.walking,
            bicycle: bicycle
              ? {
                  distance: bicycle.properties.distance,
                  duration: bicycle.properties.durationEstimate,
                  destinationName,
                }
              : currentStore.metadata.bicycle,
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

    const timer = setTimeout(fetchBothRoutes, 300);
    return () => clearTimeout(timer);
  }, [
    selectedPoiId,
    selectedEvent?.id,
    isPlanning,
    transportMode,
    isRemote,
    userCoords?.[0],
    userCoords?.[1],
  ]);

  // Navigation Progress Tracking Effect
  useEffect(() => {
    const { isNavigating, currentRoute, setNextInstruction } = useNavigationStore.getState();
    if (!isNavigating || !currentRoute || !userCoords) return;

    // 1. Find the next relevant maneuver
    const maneuvers = currentRoute.maneuvers || [];
    if (maneuvers.length === 0) return;

    // We look for the first maneuver that we haven't reached yet
    // A maneuver is "reached" if we are very close to it (< 15m) or if we've passed it
    // For simplicity, we'll find the maneuver with the smallest distance to us
    let closestManeuverIndex = 0;
    let minDistance = Infinity;

    maneuvers.forEach((m, i) => {
      if (!m.coordinate) return;
      const dist = calculateDistance(
        userCoords as [number, number],
        m.coordinate as [number, number]
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestManeuverIndex = i;
      }
    });

    // The "Next" maneuver is either the closest one (if we haven't reached it)
    // or the one immediately after the closest one (if we are AT the closest one)
    let nextIndex = closestManeuverIndex;
    if (minDistance < 20 && closestManeuverIndex < maneuvers.length - 1) {
      nextIndex = closestManeuverIndex + 1;
    }

    const nextM = maneuvers[nextIndex];
    if (nextM) {
      const distToNext = calculateDistance(
        userCoords as [number, number],
        nextM.coordinate as [number, number]
      );
      setNextInstruction({
        ...nextM,
        distance: distToNext,
      });
    }
  }, [userCoords?.[0], userCoords?.[1], transportMode]);

  return { isRemote };
};
