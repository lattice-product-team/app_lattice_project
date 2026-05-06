import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_ZOOM, MAP_CENTER } from '../../../constants/mapConstants';
import { calculateBBox } from '../../../utils/geoUtils';

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

export const MapCameraManager = forwardRef<MapCameraHandle, MapCameraManagerProps>(({
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
}, ref) => {
  const cameraRef = React.useRef<any>(null);
  const insets = useSafeAreaInsets();

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
        animationDuration: 0, // Salto instantáneo
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
  }, [recenterCount, userCoords]);

  // Focus on selected POI
  useEffect(() => {
    if (selectedCoords && cameraRef.current && !isNavigating) {
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
  }, [selectedCoords, isNavigating, insets.top, forceCenterCount]);

  // Focus on selected event or its children
  useEffect(() => {
    if (selectedEvent && cameraRef.current && !isNavigating) {
      if (poisGeoJSON?.features) {
        const childPoiCoords = poisGeoJSON.features
          .filter((f: any) => f.properties.parentId === selectedEvent.id || f.properties.event_id === selectedEvent.id)
          .map((f: any) => f.geometry.coordinates);

        if (childPoiCoords.length > 0) {
          const bbox = calculateBBox(childPoiCoords);
          if (bbox) {
            cameraRef.current.fitBounds(
              [bbox[2], bbox[3]], 
              [bbox[0], bbox[1]], 
              [SCREEN_HEIGHT * 0.48, 60, 40, 40],
              800
            );
            return;
          }
        }
      }

      if (selectedEvent.center) {
        cameraRef.current.setCamera({
          centerCoordinate: selectedEvent.center.coordinates,
          zoomLevel: 16.5,
          animationDuration: 1200,
          animationMode: 'flyTo',
          pitch: is3DActive ? 60 : 0,
          padding: {
            paddingBottom: SCREEN_HEIGHT * 0.4,
            paddingTop: insets.top + 60,
            paddingLeft: 40,
            paddingRight: 40,
          },
        });
      }
    }
  }, [selectedEvent, poisGeoJSON, isNavigating, insets.top, forceCenterCount]);

  // Sync pitch
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        pitch: is3DActive ? 60 : 0,
        animationDuration: 1000,
        animationMode: 'flyTo',
      });
    }
  }, [is3DActive]);

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      minZoomLevel={11}
      defaultSettings={{ 
        centerCoordinate: userCoords || lastCameraPosition?.center || MAP_CENTER, 
        zoomLevel: lastCameraPosition?.zoom || DEFAULT_ZOOM, 
        pitch: lastCameraPosition?.pitch || 0 
      }}
      followUserLocation={isNavigating || isFollowingUser}
      followUserMode={(isNavigating ? 'compass' : 'normal') as any}
      followZoomLevel={17}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
