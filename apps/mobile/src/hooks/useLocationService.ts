import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationPermission } from './useLocationPermission';
import { PermissionStatus } from '../types';
import { useLocationStore } from '../store/useLocationStore';
import { calculateDistance } from '../utils/geoUtils';
import { useNavigationStore } from '../features/navigation/store/useNavigationStore';
import { telemetryService } from '../services/telemetryService';

const SIGNIFICANT_MOVEMENT_THRESHOLD = 10; // meters

export interface LocationState {
  coords: number[] | null;
  status: PermissionStatus;
  requestPermission: () => Promise<boolean>;
}

/**
 * Hook to handle location tracking and permissions.
 * Provides a reliable coordinate stream even when MapLibre's native tracking fails.
 * Updates the global useLocationStore.
 */
export const useLocationService = (): LocationState => {
  const { status, requestPermission } = useLocationPermission();
  const setLocation = useLocationStore((s) => s.setLocation);
  const setLogicalLocation = useLocationStore((s) => s.setLogicalLocation);
  const setStoreStatus = useLocationStore((s) => s.setStatus);
  const userCoords = useLocationStore((s) => s.coords);
  const { isNavigating, isPlanning } = useNavigationStore();
  const lastLogicalCoords = useRef<number[] | null>(null);

  const updateLocation = (lng: number, lat: number) => {
    const newCoords = [lng, lat];
    setLocation(newCoords);

    // Check for significant movement to update logical location
    if (!lastLogicalCoords.current) {
      lastLogicalCoords.current = newCoords;
      setLogicalLocation(newCoords);
    } else {
      const distance = calculateDistance(
        lastLogicalCoords.current[1],
        lastLogicalCoords.current[0],
        lat,
        lng
      );

      if (distance >= SIGNIFICANT_MOVEMENT_THRESHOLD) {
        lastLogicalCoords.current = newCoords;
        setLogicalLocation(newCoords);
      }
    }
  };

  useEffect(() => {
    setStoreStatus(status);

    // Proactively request permission if we are in 'idle' state (first load)
    if (status === 'idle') {
      requestPermission();
    }
  }, [status, setStoreStatus, requestPermission]);

  useEffect(() => {
    let positionSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    if (status === 'granted') {
      (async () => {
        try {
          console.log('[LocationService] Starting tracking...');

          // 1. Try to get last known position first (fastest)
          try {
            const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);
            if (lastKnown) {
              console.log(
                '[LocationService] Last known position:',
                lastKnown.coords.longitude,
                lastKnown.coords.latitude
              );
              updateLocation(lastKnown.coords.longitude, lastKnown.coords.latitude);
            }
          } catch {
            // Silently handle if last location is unavailable
          }

          // 2. Try to get current position (forces a refresh)
          const initial = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }).catch(() => null);

          if (initial) {
            console.log(
              '[LocationService] Initial position:',
              initial.coords.longitude,
              initial.coords.latitude
            );
            updateLocation(initial.coords.longitude, initial.coords.latitude);
          }

          // 3. Start watching for changes with dynamic accuracy
          const isActiveMode = isNavigating || isPlanning;

          positionSubscription = await Location.watchPositionAsync(
            {
              accuracy: isActiveMode ? Location.Accuracy.BestForNavigation : Location.Accuracy.High,
              timeInterval: isActiveMode ? 1000 : 3000,
              distanceInterval: isActiveMode ? 1 : 5,
            },
            (location) => {
              // console.log('[LocationService] Update:', location.coords.longitude, location.coords.latitude);
              updateLocation(location.coords.longitude, location.coords.latitude);
            }
          );

          // 4. Start watching for heading (compass)
          headingSubscription = await Location.watchHeadingAsync((heading) => {
            useLocationStore.getState().setHeading(heading.trueHeading);
          });

          console.log('[LocationService] Subscriptions active');
        } catch (err) {
          console.warn('[LocationService] Tracking failed to start:', err);
        }
      })();
    }

    return () => {
      console.log('[LocationService] Cleaning up subscriptions');
      positionSubscription?.remove();
      headingSubscription?.remove();
    };
  }, [status, isNavigating || isPlanning]); // Stabilize: Only restart tracking when the broad mode (Active vs Idle) changes

  // 4. Background Telemetry (Crowd Radar)
  useEffect(() => {
    if (status !== 'granted') return;

    // Send initial ping
    telemetryService.ping();

    // Start periodic pings (every 30 seconds)
    const cleanup = telemetryService.startPinging(30000);

    return cleanup;
  }, [status]);

  return {
    coords: userCoords,
    status,
    requestPermission,
  };
};
