import { useEffect, useMemo } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { useEventStore } from '../../event/store/useEventStore';
import { navigationService } from '../services/navigationService';
import { useLocationStore } from '../../../store/useLocationStore';

export const useRoutingLogic = () => {
  const { selectedPoiId, selectedPoi, setRemote } = usePOIStore();
  const { selectedEvent } = useEventStore();
  const { setRoutes, setNextInstruction, transportMode, setFetching } = useNavigationStore();

  const { logicalCoords: userCoords } = useLocationStore();

  const isRemote = useMemo(() => {
    if (!userCoords || !selectedEvent?.center) return false;
    // Basic remote check
    return false;
  }, [userCoords, selectedEvent]);

  useEffect(() => {
    setRemote(isRemote);
  }, [isRemote, setRemote]);

  useEffect(() => {
    const fetchBothRoutes = async () => {
      // Determine destination based on selected POI or Event
      const destinationCoords = selectedPoi?.coordinates || selectedEvent?.center?.coordinates || (selectedEvent as any)?.coordinates;
      const destinationName = selectedPoi?.displayName || selectedEvent?.name || '';

      if (!destinationCoords || !userCoords) return;

      console.log(`[Logic] 🛰 Dual-fetching routes for: ${destinationName}`);
      setFetching(true);

      try {
        const origin = { lat: userCoords[1], lng: userCoords[0] };
        const destination = { lat: destinationCoords[1], lng: destinationCoords[0] };

        // Fetch THREE modes in parallel
        const [driving, walking, bicycle] = await Promise.all([
          navigationService.getRoute({ origin, destination, mode: 'driving', timestamp: Date.now() }),
          navigationService.getRoute({ origin, destination, mode: 'walking', timestamp: Date.now() }),
          navigationService.getRoute({ origin, destination, mode: 'bicycle', timestamp: Date.now() }),
        ]);

        console.log('[Logic] ✅ Triple routes received successfully');

        const routes = { driving, walking, bicycle };
        const metadata = {
          driving: {
            distance: driving.properties.distance,
            duration: driving.properties.durationEstimate,
            destinationName,
          },
          walking: {
            distance: walking.properties.distance,
            duration: walking.properties.durationEstimate,
            destinationName,
          },
          bicycle: {
            distance: bicycle.properties.distance,
            duration: bicycle.properties.durationEstimate,
            destinationName,
          },
        };

        // Update store with all routes
        setRoutes(routes, metadata);
        
        // Update instruction for current mode
        const currentRoute = routes[transportMode];
        if (currentRoute?.maneuvers && currentRoute.maneuvers.length > 0) {
          setNextInstruction(currentRoute.maneuvers[0]);
        }
      } catch (error) {
        console.error('[Logic] ❌ Dual-fetch failed:', error);
        setFetching(false);
      }
    };

    fetchBothRoutes();
  }, [selectedPoiId, selectedEvent?.id, userCoords, setRoutes, setFetching]);

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
