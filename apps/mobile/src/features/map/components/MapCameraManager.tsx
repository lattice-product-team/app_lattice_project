import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_ZOOM, MAP_CENTER } from '../../../constants/mapConstants';
import { calculateBBox, calculateCentroid } from '../../../utils/geoUtils';
import { useMapUIStore, MapCameraMode } from '../store/useMapUIStore';

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
  isPlanning: boolean;
  cameraMode: MapCameraMode;
  currentRoute: any | null;
}

export interface MapCameraHandle {
  setCamera: (config: any) => void;
  fitBounds: (ne: number[], sw: number[], padding?: number[], duration?: number) => void;
}

export const MapCameraManager = forwardRef<MapCameraHandle, MapCameraManagerProps>((props, ref) => {
  const {
    userCoords,
    selectedCoords,
    selectedEvent,
    poisGeoJSON,
    is3DActive,
    recenterCount,
    forceCenterCount,
    lastCameraPosition,
    isNavigating,
    isPlanning,
    cameraMode,
    currentRoute,
    transportMode,
    isFetching,
  } = props;

  const cameraRef = React.useRef<any>(null);
  const insets = useSafeAreaInsets();
  const lastTargetRef = React.useRef<string | null>(null);
  const lastActionTimestamp = React.useRef<number>(0);
  const CAMERA_ACTION_THROTTLE = 500; // ms
  const { setCameraMode } = useMapUIStore();

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
      // We DON'T set cameraMode to FOLLOW here anymore.
      // It stays in FREE (set by triggerRecenter action)
      cameraRef.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: 1000,
        animationMode: 'flyTo',
        pitch: is3DActive ? 60 : 0,
        padding: { paddingBottom: 150, paddingTop: 60, paddingLeft: 20, paddingRight: 20 },
      });
    }
  }, [recenterCount, userCoords]); // Removed is3DActive to prevent re-centering when toggling 3D

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

      // Transition to FREE mode IMMEDIATELY to stop any user tracking
      if (cameraMode !== MapCameraMode.FREE) {
        setCameraMode(MapCameraMode.FREE);
      }

      cameraRef.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 18.0,
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
  }, [selectedCoords, isNavigating, insets.top, forceCenterCount]); // Removed is3DActive

  // Toggle 3D Pitch
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        pitch: is3DActive ? 60 : 0,
        animationDuration: 600,
      });
    }
  }, [is3DActive]);

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

      // Robust center detection across different object formats
      targetCenter =
        selectedEvent.coordinates ||
        selectedEvent.center?.coordinates ||
        selectedEvent.geometry?.coordinates ||
        (selectedEvent.latitude && selectedEvent.longitude ? [selectedEvent.longitude, selectedEvent.latitude] : null);

      if (!targetCenter && selectedEvent.boundary?.coordinates?.[0]) {
        targetCenter = calculateCentroid(selectedEvent.boundary.coordinates[0]);
      }

      if (targetCenter) {
        // Transition to FREE mode IMMEDIATELY to stop any user tracking
        if (cameraMode !== MapCameraMode.FREE) {
          setCameraMode(MapCameraMode.FREE);
        }

        // Use a slight timeout or ensure state has propagated before animating
        cameraRef.current.setCamera({
          centerCoordinate: targetCenter,
          zoomLevel: 13.0,
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
  }, [selectedEvent, isNavigating, insets.top, forceCenterCount]);

  const userCoordsRef = React.useRef(userCoords);
  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  const prevIsNavigating = React.useRef(isNavigating);

  // Navigation camera behavior
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Only trigger the "jump to navigation" transition when navigation is FIRST enabled
    // or if we were explicitly told to re-engage from a different state.
    if (isNavigating && !prevIsNavigating.current && cameraRef.current) {
      // Transition gracefully to the user's location first
      if (userCoordsRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: userCoordsRef.current,
          zoomLevel: 18,
          pitch: 45,
          animationDuration: 1500,
          animationMode: 'flyTo',
        });
      }
      // Engage native follow mode only after the smooth transition completes
      timer = setTimeout(() => {
        setCameraMode(MapCameraMode.NAVIGATION);
      }, 1500);
      } else if (!isNavigating && prevIsNavigating.current && cameraMode === MapCameraMode.NAVIGATION) {
      // Exit navigation camera mode
      setCameraMode(MapCameraMode.FREE);
      
      // ONLY perform a default camera reset if we are NOT entering planning mode
      // If isPlanning is true, the planning effect will handle the camera (fitBounds)
      if (cameraRef.current && !isPlanning) {
        cameraRef.current.setCamera({
          pitch: is3DActive ? 60 : 0,
          animationDuration: 1000,
          animationMode: 'flyTo',
        });
      }
    }
    
    prevIsNavigating.current = isNavigating;
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isNavigating, setCameraMode]); // Removed cameraMode from dependencies to prevent infinite loops/fighting user drag

  const lastPlanningRouteRef = React.useRef<string | null>(null);

  // Planning fitBounds
  useEffect(() => {
    if (isPlanning && cameraRef.current && !isNavigating) {
      const routeId = currentRoute 
        ? `${currentRoute.id}-${currentRoute.duration}-${currentRoute.distance}` 
        : (selectedCoords ? `planning-${selectedCoords.join(',')}` : null);
      
      // If this route is already being animated/displayed, don't restart the whole sequence
      if (lastPlanningRouteRef.current === routeId) return;
      lastPlanningRouteRef.current = routeId;

      // STOP any ongoing tracking IMMEDIATELY
      setCameraMode(MapCameraMode.FREE);

      const timer = setTimeout(() => {
        let pointsToFit: number[][] = [];

        if (currentRoute?.geometry?.coordinates) {
          pointsToFit = currentRoute.geometry.coordinates;
        } else if (userCoordsRef.current && selectedCoords) {
          pointsToFit.push(userCoordsRef.current);
          pointsToFit.push(selectedCoords);
        }

        if (pointsToFit.length < 2) return;

        const bbox = calculateBBox(pointsToFit);
        if (!bbox) return;

        // Fit the bounds with generous padding for the UI elements
        cameraRef.current.fitBounds(
          [bbox[2], bbox[3]], // NE
          [bbox[0], bbox[1]], // SW
          [insets.top + 120, 70, 480, 70], // Top, Right, Bottom, Left
          800
        );

        // Pitch transition
        const pitchTimer = setTimeout(() => {
          if (cameraRef.current && isPlanning) {
            cameraRef.current.setCamera({
              pitch: is3DActive ? 45 : 0,
              animationDuration: 600,
            });
          }
        }, 850);

        return () => clearTimeout(pitchTimer);
      }, 150);
      
      return () => clearTimeout(timer);
    } else if (!isPlanning || isNavigating) {
      // Clear the ref so that when we return from navigation to planning, 
      // the camera correctly re-fits the route.
      lastPlanningRouteRef.current = null;
    }
  }, [isPlanning, isNavigating, selectedCoords, currentRoute, insets.top, is3DActive, transportMode, isFetching]);

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      minZoomLevel={2}
      defaultSettings={{
        centerCoordinate: userCoords || lastCameraPosition?.center || MAP_CENTER,
        zoomLevel: lastCameraPosition?.zoom || DEFAULT_ZOOM,
        pitch: lastCameraPosition?.pitch || 0,
      }}
      followUserLocation={cameraMode === MapCameraMode.NAVIGATION}
      followUserMode={(cameraMode === MapCameraMode.NAVIGATION ? 'compass' : 'normal') as any}
      followZoomLevel={cameraMode === MapCameraMode.NAVIGATION ? 18 : undefined}
      followPitch={cameraMode === MapCameraMode.NAVIGATION ? 45 : undefined}
      onUserTrackingModeChange={(e) => {
        // If the native map stops following (due to user drag), sync our state to FREE
        if (
          e.nativeEvent.payload.followUserLocation === false &&
          cameraMode !== MapCameraMode.FREE
        ) {
          setCameraMode(MapCameraMode.FREE);
        }
      }}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
