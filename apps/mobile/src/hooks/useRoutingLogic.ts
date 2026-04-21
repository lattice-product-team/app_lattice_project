import { useMemo, useEffect } from 'react';
import { useMapStore } from '../store/useMapStore';
import { useLocationStore } from '../store/useLocationStore';
import { useRoute } from './queries/useRoute';

export const useRoutingLogic = () => {
  const selectedPoiId = useMapStore((s) => s.selectedPoiId);
  const selectedPoi = useMapStore((s) => s.selectedPoi);
  const setRoute = useMapStore((s) => s.setRoute);
  const userCoords = useLocationStore((s) => s.logicalCoords);

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

      return { origin: { lat, lng }, destination };
    }
    return null;
  }, [selectedPoiId, selectedPoi, userCoords]);

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

  return { routeData };
};
