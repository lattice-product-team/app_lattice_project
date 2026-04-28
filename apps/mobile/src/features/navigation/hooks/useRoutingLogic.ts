import { useMemo, useEffect } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useRoute } from './useRoute';
import { calculateDistance } from '../../../utils/geoUtils';

export const useRoutingLogic = () => {
  const { selectedPoiId, selectedPoi, setRemote } = usePOIStore();
  const { selectedEvent } = useEventStore();
  const { setRoute } = useNavigationStore();
  
  const { 
    logicalCoords: userCoords, 
    avoidStairs, 
    wheelchairAccess 
  } = useLocationStore();

  const routeRequest = useMemo(() => {
    // We calculate route IF we have user coords AND a selected POI
    if (selectedPoiId && userCoords) {
      const isSaved = selectedPoiId.toString().startsWith('saved_');
      const destination =
        isSaved && selectedPoi?.coordinates
          ? { lng: selectedPoi.coordinates[0], lat: selectedPoi.coordinates[1] }
          : { poiId: Number(selectedPoiId.replace('saved_', '')) };

      if (isSaved && !selectedPoi?.coordinates) return null;

      // Precision control
      const lat = Math.round(userCoords[1] * 10000) / 10000;
      const lng = Math.round(userCoords[0] * 10000) / 10000;

      return { 
        origin: { lat, lng }, 
        destination,
        avoidStairs,
        wheelchairAccess
      };
    }
    return null;
  }, [selectedPoiId, selectedPoi, userCoords, avoidStairs, wheelchairAccess]);

  const isRemote = useMemo(() => {
    if (!userCoords || !selectedEvent?.center) return false;
    const dist = calculateDistance(
      userCoords[1], userCoords[0],
      selectedEvent.center.coordinates[1], selectedEvent.center.coordinates[0]
    );
    return dist > 2000; // 2km boundary
  }, [userCoords, selectedEvent]);

  useEffect(() => {
    setRemote(isRemote);
  }, [isRemote, setRemote]);

  const { data: routeData } = useRoute(routeRequest);

  useEffect(() => {
    if (routeData) {
      setRoute(routeData, {
        distance: routeData.properties.distance,
        duration: routeData.properties.durationEstimate,
        destinationName: selectedPoi?.displayName || 'tu destino',
      });
    }
  }, [routeData, selectedPoi, setRoute]);

  return { routeData, isRemote };
};
