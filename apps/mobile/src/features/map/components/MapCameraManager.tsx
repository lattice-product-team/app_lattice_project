import React, { forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MapCameraMode, useMapUIStore, MapCameraTriggerSource } from '../store/useMapUIStore';
import { MAP_CENTER } from '../../../constants/mapConstants';

export interface MapCameraHandle {
  snapToLocation: (coords: [number, number], zoom?: number, pitch?: number) => void;
  flyTo: (coords: [number, number], zoom?: number, pitch?: number, duration?: number) => void;
  handleRegionChangeComplete: (center: number[], zoom: number) => void;
  setCamera: (config: any) => void;
}

/**
 * MapCameraManager: Professional-grade orchestrator for the MapLibre Camera.
 */
export const MapCameraManager = forwardRef((props: any, ref) => {
  const {
    userCoords,
    selectedCoords,
    isNavigating,
    cameraMode,
    recenterCount,
    forceCenterCount,
    triggerSource,
    isPlanning,
    currentRoute
  } = props;

  const cameraRef = useRef<MapLibreGL.Camera>(null);
  const isProgrammaticMove = useMapUIStore((s) => s.isProgrammaticMove);
  const setIsProgrammaticMove = useMapUIStore((s) => s.setIsProgrammaticMove);
  const setCameraMode = useMapUIStore((s) => s.setCameraMode);
  
  const hasInitialized = useRef(false);
  const lastIsNavigating = useRef(isNavigating);
  const lastProcessedRouteId = useRef<string | null>(null);

  // SNAP LOGIC: Instantly move the camera without animation
  const snapToLocation = useCallback((coords: [number, number], zoom?: number, pitch?: number) => {
    if (!cameraRef.current) return;
    cameraRef.current.setCamera({
      centerCoordinate: coords,
      ...(zoom !== undefined && { zoomLevel: zoom }),
      ...(pitch !== undefined && { pitch: pitch }),
      animationDuration: 0,
      padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
    });
  }, []);

  // FLYTO LOGIC: Smooth cinematic transition
  const flyTo = useCallback((coords: [number, number], zoom?: number, pitch?: number, duration: number = 1500) => {
    if (!cameraRef.current) return;

    console.log('[MapCameraManager] ✈️ Flying to:', coords);
    setIsProgrammaticMove(true);
    cameraRef.current.setCamera({
      centerCoordinate: coords,
      ...(zoom !== undefined && { zoomLevel: zoom }),
      ...(pitch !== undefined && { pitch: pitch }),
      animationDuration: duration,
      animationMode: 'flyTo',
      padding: { paddingBottom: 250, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
    });
    
    // Safety release of programmatic lock
    setTimeout(() => setIsProgrammaticMove(false), duration + 50);
  }, [setIsProgrammaticMove]);

  // EXPOSE INTERFACE
  useImperativeHandle(ref, () => ({
    snapToLocation,
    flyTo,
    handleRegionChangeComplete: (_center: number[], _zoom: number) => {},
    setCamera: (config: any) => cameraRef.current?.setCamera(config),
  }));

  const lastProcessedRecenter = useRef(recenterCount);
  const lastProcessedForceCenter = useRef(forceCenterCount);

  // INITIAL POSITIONING: Snap to user location on startup
  useEffect(() => {
    if (!hasInitialized.current && userCoords && cameraRef.current) {
      snapToLocation([userCoords[0], userCoords[1]], 14);
      hasInitialized.current = true;
    }
  }, [userCoords]);

  // NAVIGATION ENGAGEMENT: When navigation actually starts, fly close to user
  useEffect(() => {
    if (isNavigating && !lastIsNavigating.current && userCoords) {
      console.log('[MapCameraManager] 🧭 Navigation START: Close-up FlyTo');
      flyTo([userCoords[0], userCoords[1]], 18.5, 45, 1200);
      setCameraMode(MapCameraMode.FOLLOW_WITH_HEADING);
    }
    lastIsNavigating.current = isNavigating;
  }, [isNavigating, userCoords, flyTo, setCameraMode]);

  // IMPERATIVE CENTER TRIGGER (Recenter Button)
  useEffect(() => {
    if (recenterCount > lastProcessedRecenter.current && userCoords) {
      lastProcessedRecenter.current = recenterCount;
      if (isNavigating || isPlanning) {
        setCameraMode(MapCameraMode.FOLLOW_WITH_HEADING);
      } else {
        flyTo([userCoords[0], userCoords[1]], 16);
      }
    }
  }, [recenterCount, userCoords, isNavigating, isPlanning, setCameraMode, flyTo]);

  // IMPERATIVE POI FOCUS TRIGGER
  useEffect(() => {
    const targetCoords = selectedCoords || props.selectedEvent?.center?.coordinates;
    if (forceCenterCount > lastProcessedForceCenter.current) {
      if (!targetCoords) return;
      lastProcessedForceCenter.current = forceCenterCount;
      const shouldAnimate = triggerSource === 'exploration' || triggerSource === 'list_click';
      if (shouldAnimate) {
        flyTo(targetCoords as [number, number]);
      }
    }
  }, [forceCenterCount, selectedCoords, props.selectedEvent, triggerSource, flyTo]);

  // ROUTE OVERVIEW: Fit bounds only when route ID changes OR when navigation ends
  useEffect(() => {
    const routeId = currentRoute?.properties?.id || currentRoute?.geometry?.coordinates?.length;
    
    // We trigger the overview if:
    // 1. We are in planning mode but NOT navigating
    // 2. AND (the route is new OR we just stopped navigating)
    const justStoppedNavigating = lastIsNavigating.current && !isNavigating;
    const isNewRoute = routeId && routeId !== lastProcessedRouteId.current;

    if (isPlanning && !isNavigating && (isNewRoute || justStoppedNavigating)) {
      const coords = currentRoute?.geometry?.coordinates;
      if (!coords || coords.length < 2) return;

      console.log('[MapCameraManager] 🗺️ Route Overview: Fitting bounds (StopNav or NewRoute)');
      lastProcessedRouteId.current = String(routeId);
      
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [x, y] of coords) {
        if (x < minX) minX = x; if (y < minY) minY = y;
        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
      }

      setIsProgrammaticMove(true);
      cameraRef.current?.setCamera({
        bounds: {
          ne: [maxX, maxY], sw: [minX, minY],
          paddingLeft: 60, paddingRight: 60, 
          paddingTop: 140, paddingBottom: 400, 
        },
        pitch: 0, // Reset tilt for route overview
        animationDuration: 1200,
        animationMode: 'flyTo',
      });
      setTimeout(() => setIsProgrammaticMove(false), 1300);
    }
    
    // Cleanup when stopping all planning
    if (!isPlanning) {
      lastProcessedRouteId.current = null;
    }
    
    // Keep track of navigation state to detect when it ends
    lastIsNavigating.current = isNavigating;
  }, [isPlanning, isNavigating, currentRoute, setIsProgrammaticMove]);

  // DYNAMIC FOLLOW MODE
  const getFollowMode = () => {
    switch (cameraMode) {
      case MapCameraMode.FOLLOW: return MapLibreGL.UserTrackingMode.Follow;
      case MapCameraMode.FOLLOW_WITH_HEADING: return MapLibreGL.UserTrackingMode.FollowWithHeading;
      case MapCameraMode.FOLLOW_WITH_COURSE: return MapLibreGL.UserTrackingMode.FollowWithCourse;
      default: return MapLibreGL.UserTrackingMode.None;
    }
  };

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      followUserLocation={cameraMode !== MapCameraMode.FREE}
      followUserMode={getFollowMode()}
      followPitch={45} 
      animationDuration={0} 
      defaultSettings={{
        centerCoordinate: MAP_CENTER,
        zoomLevel: 14,
      }}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
