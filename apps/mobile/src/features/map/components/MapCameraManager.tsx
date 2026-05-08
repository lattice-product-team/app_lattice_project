import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_ZOOM, MAP_CENTER } from '../../../constants/mapConstants';
import { calculateBBox, calculateCentroid } from '../../../utils/geoUtils';
import { useMapUIStore } from '../store/useMapUIStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapCameraManagerProps {
  userCoords: number[] | null;
  selectedCoords: number[] | null;
  selectedEvent: any | null;
  poisGeoJSON: any;
  is3DActive: boolean;
  recenterCount: number;
  forceCenterCount: number;
  lastCameraPosition: any;
  isNavigating: boolean;
  isFollowingUser: boolean;
}

export interface MapCameraHandle {
  setCamera: (config: any) => void;
  fitBounds: (ne: number[], sw: number[], padding?: number[], duration?: number) => void;
}

export const MapCameraManager = forwardRef<MapCameraHandle, MapCameraManagerProps>(
  (
    {
      userCoords,
      selectedCoords,
      selectedEvent,
      poisGeoJSON,
      is3DActive,
      recenterCount,
      forceCenterCount,
      lastCameraPosition,
      isNavigating,
      isFollowingUser,
    },
    ref
  ) => {
    const cameraRef = React.useRef<any>(null);
    const insets = useSafeAreaInsets();
    const lastTargetRef = React.useRef<string | null>(null);
    const lastActionTimestamp = React.useRef<number>(0);
    const CAMERA_ACTION_THROTTLE = 500; // ms
    const { setIsFollowingUser } = useMapUIStore();

    useImperativeHandle(ref, () => ({
      setCamera: (config: any) => cameraRef.current?.setCamera(config),
      fitBounds: (ne: number[], sw: number[], padding?: number[], duration?: number) =>
        cameraRef.current?.fitBounds(ne, sw, padding, duration),
    }));

    // Initial fix on user location
    const hasFixedOnUser = React.useRef(false);
    useEffect(() => {
      if (userCoords && !hasFixedOnUser.current && cameraRef.current && !lastCameraPosition) {
        hasFixedOnUser.current = true;
        cameraRef.current.setCamera({
          centerCoordinate: userCoords,
          zoomLevel: DEFAULT_ZOOM,
          animationDuration: 0,
          animationMode: 'none',
        });
      }
    }, [userCoords, lastCameraPosition]);

    // Recenter on user (manual trigger)
    useEffect(() => {
      if (recenterCount > 0 && cameraRef.current && userCoords) {
        cameraRef.current.setCamera({
          centerCoordinate: userCoords,
          zoomLevel: DEFAULT_ZOOM,
          animationDuration: 800,
          animationMode: 'flyTo',
          pitch: is3DActive ? 60 : 0,
          padding: { paddingBottom: 150, paddingTop: 60, paddingLeft: 20, paddingRight: 20 },
        });
      }
    }, [recenterCount, userCoords, is3DActive]);

    // Focus on selected POI
    useEffect(() => {
      const now = Date.now();
      if (selectedCoords && cameraRef.current && !isNavigating) {
        const targetKey = `poi-${selectedCoords.join(',')}`;
        if (
          lastTargetRef.current === targetKey &&
          now - lastActionTimestamp.current < CAMERA_ACTION_THROTTLE
        )
          return;

        lastTargetRef.current = targetKey;
        lastActionTimestamp.current = now;

        cameraRef.current.setCamera({
          centerCoordinate: selectedCoords,
          zoomLevel: 17.2,
          animationDuration: 400,
          animationMode: 'flyTo',
          pitch: is3DActive ? 60 : 0,
          padding: {
            paddingBottom: SCREEN_HEIGHT * 0.45,
            paddingTop: insets.top + 40,
            paddingLeft: 20,
            paddingRight: 20,
          },
        });
      }
    }, [selectedCoords, isNavigating, insets.top, forceCenterCount, is3DActive]);

    // Focus on selected event or its children
    useEffect(() => {
      const now = Date.now();
      if (selectedEvent && cameraRef.current && !isNavigating) {
        const eventId = selectedEvent.id || selectedEvent.properties?.id;
        if (
          lastTargetRef.current === `event-${eventId}` &&
          now - lastActionTimestamp.current < CAMERA_ACTION_THROTTLE
        )
          return;

        lastTargetRef.current = `event-${eventId}`;
        lastActionTimestamp.current = now;

        let targetCenter: [number, number] | null = null;
        if (selectedEvent.boundary?.coordinates?.[0]) {
          targetCenter = calculateCentroid(selectedEvent.boundary.coordinates[0]);
        }

        if (!targetCenter && poisGeoJSON?.features) {
          const childPoiCoords = poisGeoJSON.features
            .filter(
              (f: any) =>
                f.properties.parentId === selectedEvent.id ||
                f.properties.event_id === selectedEvent.id
            )
            .map((f: any) => f.geometry.coordinates);

          if (childPoiCoords.length > 0) {
            targetCenter = calculateCentroid(childPoiCoords);
          }
        }

        if (!targetCenter) {
          targetCenter =
            selectedEvent.center?.coordinates ||
            selectedEvent.geometry?.coordinates ||
            selectedEvent.coordinates;
        }

        if (targetCenter) {
          cameraRef.current.setCamera({
            centerCoordinate: targetCenter,
            zoomLevel: 17.2,
            animationDuration: 1200,
            animationMode: 'flyTo',
            pitch: 0,
            padding: {
              paddingBottom: SCREEN_HEIGHT * 0.45,
              paddingTop: insets.top + 60,
              paddingLeft: 40,
              paddingRight: 40,
            },
          });
        }
      } else if (!selectedEvent) {
        lastTargetRef.current = null;
      }
    }, [selectedEvent, poisGeoJSON, isNavigating, insets.top, forceCenterCount]);

    // Navigation camera behavior
    useEffect(() => {
      if (isNavigating && cameraRef.current) {
        setIsFollowingUser(true);
        cameraRef.current.setCamera({
          zoomLevel: 18,
          pitch: 45,
          animationDuration: 1500,
          animationMode: 'flyTo',
        });
      }
    }, [isNavigating, setIsFollowingUser]);

    return (
      <MapLibreGL.Camera
        ref={cameraRef}
        minZoomLevel={2}
        defaultSettings={{
          centerCoordinate: userCoords || lastCameraPosition?.center || MAP_CENTER,
          zoomLevel: lastCameraPosition?.zoom || DEFAULT_ZOOM,
          pitch: lastCameraPosition?.pitch || 0,
        }}
        followUserLocation={isFollowingUser}
        followUserMode={(isNavigating ? 'course' : 'normal') as any}
        followZoomLevel={isNavigating ? 18 : undefined}
        followPitch={isNavigating ? 45 : undefined}
      />
    );
  }
);

MapCameraManager.displayName = 'MapCameraManager';
