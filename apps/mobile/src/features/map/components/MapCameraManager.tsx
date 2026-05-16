import React, { forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MapCameraMode, useMapUIStore, MapCameraTriggerSource } from '../store/useMapUIStore';
import { MAP_CENTER, DEFAULT_ZOOM } from '../../../constants/mapConstants';

export interface MapCameraHandle {
  snapToLocation: (coords: [number, number], zoom?: number, pitch?: number) => void;
  flyTo: (coords: [number, number], zoom?: number, pitch?: number, duration?: number) => void;
  handleRegionChangeComplete: (center: number[], zoom: number) => void;
  setCamera: (config: any) => void;
}

/**
 * MapCameraManager: Professional-grade orchestrator for the MapLibre Camera.
 * Isolates native camera behavior and provides deterministic control over transitions.
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
  } = props;

  const cameraRef = useRef<MapLibreGL.Camera>(null);
  const setIsProgrammaticMove = useMapUIStore((s) => s.setIsProgrammaticMove);
  const lastIsNavigating = useRef(isNavigating);
  const hasInitialized = useRef(false);

  // INITIAL POSITIONING: Snap to user location on startup or fallback to Barcelona
  useEffect(() => {
    if (!hasInitialized.current && cameraRef.current) {
      if (userCoords) {
        console.log('[MapCameraManager] 📍 Initializing at User Location:', userCoords);
        snapToLocation([userCoords[0], userCoords[1]], 14);
        hasInitialized.current = true;
      } else {
        // If no user location yet, we wait a bit or just rely on defaultSettings.
        // But let's force a snap to Barcelona just in case defaultSettings didn't catch it.
        console.log('[MapCameraManager] 🏰 No User Location, defaulting to Barcelona');
        snapToLocation(MAP_CENTER, 14);
        // We DON'T set hasInitialized to true here because we might still want to snap 
        // to user location if it arrives shortly after.
      }
    }
  }, [userCoords, snapToLocation]);

  // Second effect to catch user location if it arrives later (within first 5 seconds)
  useEffect(() => {
    if (!hasInitialized.current && userCoords) {
      console.log('[MapCameraManager] 📍 User Location arrived late, snapping now:', userCoords);
      snapToLocation([userCoords[0], userCoords[1]], 14);
      hasInitialized.current = true;
    }
  }, [userCoords, snapToLocation]);

  // Safety timeout: if after 5 seconds we don't have user location, 
  // stop trying to auto-snap to it so we don't jar the user later.
  useEffect(() => {
    const timer = setTimeout(() => {
      hasInitialized.current = true;
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // SNAP LOGIC: Instantly move the camera without animation to neutralize native interpolation
  const snapToLocation = useCallback((coords: [number, number], zoom?: number, pitch?: number) => {
    if (!cameraRef.current) return;
    
    // console.log('[MapCameraManager] Snapping camera to:', coords);
    cameraRef.current.setCamera({
      centerCoordinate: coords,
      // No longer forcing default zoom or pitch values here. 
      // Respects current camera state if not explicitly provided.
      ...(zoom !== undefined && { zoomLevel: zoom }),
      ...(pitch !== undefined && { pitch: pitch }),
      animationDuration: 0,
      padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
    });
  }, []);

  // FLYTO LOGIC: Smooth cinematic transition for exploration and list selections
  const flyTo = useCallback((coords: [number, number], zoom?: number, pitch?: number, duration: number = 2000) => {
    if (!cameraRef.current) return;

    console.log('[MapCameraManager] ✈️ Flying to:', coords, 'duration:', duration);
    cameraRef.current.setCamera({
      centerCoordinate: coords,
      ...(zoom !== undefined && { zoomLevel: zoom }),
      ...(pitch !== undefined && { pitch: pitch }),
      animationDuration: duration,
      animationMode: 'flyTo',
      // Offset the center upwards by adding padding to the bottom
      padding: { paddingBottom: 250, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
    });
  }, []);

  // EXPOSE INTERFACE to parent components
  useImperativeHandle(ref, () => ({
    snapToLocation,
    flyTo,
    handleRegionChangeComplete: (_center: number[], _zoom: number) => {
      // Satisfies callsite in MapContent
    },
    setCamera: (config: any) => cameraRef.current?.setCamera(config),
  }));

  const lastProcessedRecenter = useRef(recenterCount);
  const lastProcessedForceCenter = useRef(forceCenterCount);

  // IMPERATIVE CENTER TRIGGER: Listen to explicit recenter requests from UI buttons.
  useEffect(() => {
    if (recenterCount > lastProcessedRecenter.current && userCoords) {
      console.log('[MapCameraManager] ✈️ EXPLICIT RECENTER FLYTO triggered by button click');
      lastProcessedRecenter.current = recenterCount;
      flyTo([userCoords[0], userCoords[1]], 16); // Fly to user at a comfortable zoom level
    }
  }, [recenterCount, userCoords, snapToLocation]);

  // IMPERATIVE POI FOCUS TRIGGER: Listen to explicit POI selection events.
  useEffect(() => {
    const targetCoords = selectedCoords || props.selectedEvent?.center?.coordinates;

    // Trigger animation if the counter increased OR if we just received coordinates and the source requires it
    if (forceCenterCount > lastProcessedForceCenter.current) {
      if (!targetCoords) {
        console.log('[MapCameraManager] ⏳ Waiting for coordinates for trigger:', forceCenterCount);
        return;
      }

      lastProcessedForceCenter.current = forceCenterCount;
      
      const shouldAnimate = triggerSource === 'exploration' || triggerSource === 'list_click';
      
      if (shouldAnimate) {
        console.log('[MapCameraManager] 🎬 Cinematic FLYTO triggered by:', triggerSource, 'Target:', targetCoords);
        flyTo(targetCoords as [number, number]);
      } else {
        console.log('[MapCameraManager] ⚡ POI selected via SNAP/Static (Source:', triggerSource, ')');
      }
    }
  }, [forceCenterCount, selectedCoords, props.selectedEvent, triggerSource, flyTo]);

  // ROUTE PLANNING FOCUS: Auto-fit bounds when a route is generated or changed
  useEffect(() => {
    if (props.isPlanning && props.currentRoute?.geometry?.coordinates) {
      const coords = props.currentRoute.geometry.coordinates;
      if (coords.length < 2) return;

      console.log('[MapCameraManager] 🗺️ Fitting camera to route bounds (Planning Mode)');
      
      // Calculate Bounding Box
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [x, y] of coords) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }

      setIsProgrammaticMove(true);
      cameraRef.current?.setCamera({
        bounds: {
          ne: [maxX, maxY],
          sw: [minX, minY],
          paddingLeft: 50,
          paddingRight: 50,
          paddingTop: 120,
          paddingBottom: 380, // Leave significant space for the RoutePlanningSheet
        },
        animationDuration: 1500,
        animationMode: 'flyTo',
      });

      const timer = setTimeout(() => setIsProgrammaticMove(false), 1600);
      return () => clearTimeout(timer);
    }
  }, [props.isPlanning, props.currentRoute, setIsProgrammaticMove]);

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      followUserLocation={false}
      followUserMode={MapLibreGL.UserTrackingMode.None}
      defaultSettings={{
        centerCoordinate: MAP_CENTER,
        zoomLevel: 14,
      }}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
