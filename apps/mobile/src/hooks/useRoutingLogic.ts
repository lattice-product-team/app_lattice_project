import { useMemo, useEffect } from 'react';
import { useMapStore } from '../store/useMapStore';
import { useLocationStore } from '../store/useLocationStore';
import { useRoute } from './queries/useRoute';
import { calculateDistance } from '../utils/geoUtils';

export const useRoutingLogic = () => {
  const selectedPoiId = useMapStore((s) => s.selectedPoiId);
  const selectedPoi = useMapStore((s) => s.selectedPoi);
  const selectedEvent = useMapStore((s) => s.selectedEvent);
  const setRoute = useMapStore((s) => s.setRoute);
  const setRemote = useMapStore((s) => s.setRemote);
  
  const { 
    logicalCoords: userCoords, 
    avoidStairs, 
    wheelchairAccess 
  } = useLocationStore();

  const routeRequest = useMemo(() => {
    // We calculate route IF we have user coords AND a selected POI
    if (selectedPoiId && userCoords) {
      const isSaved = selectedPoiId.toString().startsWith('saved_');
      const poiId = isSaved ? null : Number(selectedPoiId);

      const destination =
        isSaved && selectedPoi?.geometry?.coordinates
          ? { lng: selectedPoi.geometry.coordinates[0], lat: selectedPoi.geometry.coordinates[1] }
          : { poiId: poiId! };

      if (isSaved && !selectedPoi?.geometry?.coordinates) return null;
      if (!isSaved && isNaN(poiId!)) return null;

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
        destinationName: selectedPoi?.name || 'your destination',
      });
    }
  }, [routeData, selectedPoi, setRoute]);

  return { routeData, isRemote };
};
