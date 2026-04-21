import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationPermission } from './useLocationPermission';
import { PermissionStatus } from '../types';
import { useLocationStore } from '../store/useLocationStore';
import { getDistance } from '../utils/geoUtils';

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
  const lastLogicalCoords = useRef<number[] | null>(null);

  const updateLocation = (lng: number, lat: number) => {
    const newCoords = [lng, lat];
    setLocation(newCoords);

    // Check for significant movement to update logical location
    if (!lastLogicalCoords.current) {
      lastLogicalCoords.current = newCoords;
      setLogicalLocation(newCoords);
    } else {
      const distance = getDistance(
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
  }, [status, setStoreStatus]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (status === 'granted') {
      (async () => {
        try {
          // 1. Try to get last known position first (fastest)
          try {
            const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);
            if (lastKnown) {
              updateLocation(lastKnown.coords.longitude, lastKnown.coords.latitude);
            }
          } catch {
            // Silently handle if last location is unavailable
          }

          // 2. Try to get current position (forces a refresh)
          const initial = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }).catch(() => null);

          if (initial) {
            updateLocation(initial.coords.longitude, initial.coords.latitude);
          }

          // 3. Start watching for changes
          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 5,
            },
            (location) => {
              updateLocation(location.coords.longitude, location.coords.latitude);
            }
          );
        } catch (err) {
          console.warn('Location tracking failed to start:', err);
        }
      })();
    }

    return () => {
      subscription?.remove();
    };
  }, [status, setLocation]);

  return {
    coords: userCoords,
    status,
    requestPermission,
  };
};
