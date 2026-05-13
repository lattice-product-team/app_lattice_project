import { useState, useEffect, useMemo } from 'react';
import { useARStore, ARFilterMode } from '../store/useARStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useSearchEvents } from './useSearchEvents';
import { geoService } from '../../../services/geoService';
import { calculateDistance } from '../../../utils/geoUtils';

/**
 * Hook to manage data fetching and filtering for the AR view.
 * Handles three modes: Nearest Event, Selected Event, and Specific Pin.
 */
export const useARData = () => {
  const { isVisible, filterMode, targetId } = useARStore();
  const userCoords = useLocationStore((s) => s.coords);
  const { allEvents } = useSearchEvents('');
  
  const [activePois, setActivePois] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!isVisible || !userCoords) {
      if (activePois.length > 0) setActivePois([]);
      return;
    }

    const [userLon, userLat] = userCoords;

    const loadData = async () => {
      setLoading(true);
      try {
        if (filterMode === ARFilterMode.CLOSEST_EVENT) {
          // 1. Find the nearest event
          if (!allEvents || allEvents.length === 0) {
            setStatusMessage('NO EVENTS FOUND');
            if (activePois.length > 0) setActivePois([]);
            return;
          }

          let nearestEvent = allEvents[0];
          let minDistance = Infinity;

          allEvents.forEach((event) => {
            if (event.center?.coordinates) {
              const [eLon, eLat] = event.center.coordinates;
              const dist = calculateDistance(userLat, userLon, eLat, eLon);
              if (dist < minDistance) {
                minDistance = dist;
                nearestEvent = event;
              }
            }
          });

          setStatusMessage(`VIEWING ${nearestEvent.name.toUpperCase()}`);
          const spatial = await geoService.getEventSpatial(nearestEvent.id);
          const newPois = spatial?.features || [];
          
          // Only update if data changed (simple length check for now, could be deeper)
          if (newPois.length !== activePois.length) {
            setActivePois(newPois);
          }

        } else if (filterMode === ARFilterMode.SELECTED_EVENT) {
          // 2. Load pins for a specific event
          const eventId = Number(targetId);
          const event = allEvents.find(e => e.id === eventId);
          
          setStatusMessage(`VIEWING ${event?.name.toUpperCase() || 'EVENT'}`);
          const spatial = await geoService.getEventSpatial(eventId);
          const newPois = spatial?.features || [];
          if (newPois.length !== activePois.length) {
            setActivePois(newPois);
          }

        } else if (filterMode === ARFilterMode.SPECIFIC_PIN) {
          // 3. Load a single pin
          const poiId = Number(targetId);
          const poi = await geoService.getPOI(poiId);
          
          setStatusMessage(`TRACKING ${poi?.name?.toUpperCase() || 'POI'}`);
          const newPois = poi ? [poi] : [];
          if (newPois.length !== activePois.length) {
            setActivePois(newPois);
          }
        }
      } catch (error) {
        console.error('AR Data Load Error:', error);
        setStatusMessage('ERROR LOADING DATA');
      } finally {
        setLoading(false);
      }
    };

    if (!isVisible || !userCoords) {
      if (activePois.length > 0) setActivePois([]);
      return;
    }

    loadData();
  }, [isVisible, filterMode, targetId, userCoords?.join(','), allEvents?.length]);

  return {
    activePois,
    loading,
    statusMessage,
  };
};
