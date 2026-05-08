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
      if (!selectedPoiId || !userCoords || !selectedPoi) return;

      console.log(`[Logic] 🛰 Dual-fetching routes for POI: ${selectedPoi.displayName}`);
      setFetching(true);

      try {
        const origin = { lat: userCoords[1], lng: userCoords[0] };
        const destination = { lat: selectedPoi.coordinates[1], lng: selectedPoi.coordinates[0] };

        // Fetch BOTH modes in parallel
        const [driving, walking] = await Promise.all([
          navigationService.getRoute({ origin, destination, mode: 'driving', timestamp: Date.now() }),
          navigationService.getRoute({ origin, destination, mode: 'walking', timestamp: Date.now() }),
        ]);

        console.log('[Logic] ✅ Dual routes received successfully');

        const routes = { driving, walking };
        const metadata = {
          driving: {
            distance: driving.properties.distance,
            duration: driving.properties.durationEstimate,
            destinationName: selectedPoi.displayName || '',
          },
          walking: {
            distance: walking.properties.distance,
            duration: walking.properties.durationEstimate,
            destinationName: selectedPoi.displayName || '',
          },
        };

        // Update store with both routes
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
  }, [selectedPoiId, userCoords, selectedPoi, setRoutes, setFetching]);

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
