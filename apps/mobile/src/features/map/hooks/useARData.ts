import { useState, useEffect } from 'react';
import { useARStore, ARFilterMode } from '../store/useARStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useSearchEvents } from './useSearchEvents';
import { geoService } from '../../../services/geoService';
import { calculateDistance, isPointInPolygon, calculatePolygonArea } from '../../../utils/geoUtils';
import { LatticeEvent } from '../../../types';

/**
 * Hook to manage data fetching and filtering for the AR view.
 * Handles three modes: Nearest Event, Selected Event, and Specific Pin.
 * Now enhanced with Contextual Awareness for boundary-based switching.
 */
export const useARData = () => {
  const { isVisible, filterMode, targetId, setContext } = useARStore();
  const userCoords = useLocationStore((s) => s.coords);
  const { allEvents } = useSearchEvents('');

  const [activePois, setActivePois] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!isVisible || !userCoords || !allEvents) {
      if (activePois.length > 0) setActivePois([]);
      return;
    }

    const [userLon, userLat] = userCoords;
    const userPoint: [number, number] = [userLon, userLat];

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Determine Spatial Context (Are we inside an event boundary?)
        const eventsWithBoundaries = allEvents.filter((e) => e.boundary?.coordinates?.[0]);
        let activeEvent: LatticeEvent | null = null;
        let smallestArea = Infinity;

        eventsWithBoundaries.forEach((event) => {
          const polygon = event.boundary!.coordinates[0];
          if (isPointInPolygon(userPoint, polygon)) {
            const area = calculatePolygonArea(polygon);
            if (area < smallestArea) {
              smallestArea = area;
              activeEvent = event;
            }
          }
        });

        const isInside = !!activeEvent;
        setContext(activeEvent, isInside);

        // 2. Data Filtering based on Context and Mode
        if (filterMode === ARFilterMode.CLOSEST_EVENT) {
          if (isInside && activeEvent) {
            // A. EVENT-SCALE MODE: Show POIs for the current event
            setStatusMessage(`EXPLORING ${(activeEvent.name || 'EVENT').toUpperCase()}`);
            const spatial = await geoService.getEventSpatial(activeEvent.id);
            setActivePois(spatial?.features || []);
          } else {
            // B. CITY-SCALE MODE: Show distant events as Beacons
            setStatusMessage('DISCOVERING EVENTS');
            // We transform events into a POI-like structure for the AR renderer
            const eventBeacons = allEvents
              .map((event) => ({
                type: 'Feature',
                geometry: event.center,
                properties: {
                  id: `event-${event.id}`,
                  name: event.name,
                  category: 'event_beacon', // Special category for custom rendering
                  isBeacon: true,
                },
              }))
              .filter((e) => e.geometry);

            setActivePois(eventBeacons);
          }
        } else if (filterMode === ARFilterMode.SELECTED_EVENT) {
          // 3. Load pins for a specific event (Forced)
          const eventId = Number(targetId);
          const event = allEvents.find((e) => e.id === eventId);

          setStatusMessage(`VIEWING ${(event?.name || 'EVENT').toUpperCase()}`);
          const spatial = await geoService.getEventSpatial(eventId);
          setActivePois(spatial?.features || []);
        } else if (filterMode === ARFilterMode.SPECIFIC_PIN) {
          // 4. Load a single pin (Forced)
          const poiId = Number(targetId);
          const poi = await geoService.getPOI(poiId);

          if (poi && poi.geometry?.coordinates) {
            const [poiLon, poiLat] = poi.geometry.coordinates;
            const distance = calculateDistance(userLat, userLon, poiLat, poiLon);

            if (distance < 15) {
              setStatusMessage(`🎯 ARRIVED AT ${(poi.name || 'POI').toUpperCase()}`);
            } else {
              setStatusMessage(
                `TRACKING ${(poi.name || 'POI').toUpperCase()} (${Math.round(distance)}m)`
              );
            }
          } else {
            setStatusMessage(`TRACKING POI`);
          }

          setActivePois(poi ? [poi] : []);
        }
      } catch (error) {
        console.error('AR Data Load Error:', error);
        setStatusMessage('ERROR LOADING DATA');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isVisible, filterMode, targetId, userCoords?.join(','), allEvents?.length]);

  return {
    activePois,
    loading,
    statusMessage,
  };
};
