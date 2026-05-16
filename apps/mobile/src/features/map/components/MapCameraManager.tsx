import React, { forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MapCameraMode, useMapUIStore } from '../store/useMapUIStore';

export interface MapCameraHandle {
  snapToLocation: (coords: [number, number], zoom?: number, pitch?: number) => void;
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
  } = props;

  const cameraRef = useRef<MapLibreGL.Camera>(null);
  const setIsProgrammaticMove = useMapUIStore((s) => s.setIsProgrammaticMove);
  const lastIsNavigating = useRef(isNavigating);

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
    });
  }, []);

  // EXPOSE INTERFACE to parent components
  useImperativeHandle(ref, () => ({
    snapToLocation,
    handleRegionChangeComplete: (_center: number[], _zoom: number) => {
      // Satisfies callsite in MapContent
    },
    setCamera: (config: any) => cameraRef.current?.setCamera(config),
  }));

  const lastProcessedRecenter = useRef(recenterCount);
  const lastProcessedForceCenter = useRef(forceCenterCount);

  // IMPERATIVE CENTER TRIGGER: Disabled for debugging
  useEffect(() => {
    if (recenterCount > lastProcessedRecenter.current && userCoords) {
      console.log('[MapCameraManager] ⚡ RECENTER clicked but SNAP logic is DISABLED');
      lastProcessedRecenter.current = recenterCount;
    }
  }, [recenterCount, userCoords]);

  // IMPERATIVE POI FOCUS TRIGGER: Disabled for debugging
  useEffect(() => {
    if (forceCenterCount > lastProcessedForceCenter.current && props.selectedCoords) {
      console.log('[MapCameraManager] ⚡ POI clicked but SNAP logic is DISABLED');
      lastProcessedForceCenter.current = forceCenterCount;
    }
  }, [forceCenterCount, props.selectedCoords]);

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      animationDuration={0}
      followUserLocation={false}
      followUserMode={MapLibreGL.UserTrackingMode.None}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
