import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';
import { PermissionStatus } from '../types';

export { PermissionStatus };

export interface LocationPermissionState {
  status: PermissionStatus;
  requestPermission: () => Promise<boolean>;
}

export const useLocationPermission = () => {
  const [permissionResponse, requestPermissionInternal] = Location.useForegroundPermissions();
  const [status, setStatus] = useState<PermissionStatus>('idle');

  // Sync internal status with expo-location hook
  useEffect(() => {
    if (!permissionResponse) return;

    if (permissionResponse.status === Location.PermissionStatus.GRANTED) {
      setStatus('granted');
    } else if (permissionResponse.status === Location.PermissionStatus.DENIED) {
      setStatus(permissionResponse.canAskAgain ? 'denied' : 'blocked');
    }
  }, [permissionResponse]);

  const requestPermission = useCallback(async () => {
    console.log('[Permission] A. Starting requestPermission');
    setStatus('loading');

    try {
      console.log('[Permission] B. Calling requestPermissionInternal from hook');
      const response = await requestPermissionInternal();
      console.log('[Permission] C. Response received:', response.status);

      if (response.status === Location.PermissionStatus.GRANTED) {
        setStatus('granted');
        return true;
      }

      if (!response.canAskAgain) {
        console.log('[Permission] D. Blocked permanently');
        setStatus('blocked');
        Alert.alert(
          'Location Permissions',
          'You have permanently denied location permissions. Please enable them in the application settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      setStatus('denied');
      return false;
    } catch (error) {
      console.error('[Permission] FATAL ERROR:', error);
      setStatus('denied');
      return false;
    }
  }, [requestPermissionInternal]);

  return { status, requestPermission };
};
