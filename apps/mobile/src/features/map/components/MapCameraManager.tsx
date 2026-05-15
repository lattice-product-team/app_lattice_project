import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_ZOOM, MAP_CENTER } from '../../../constants/mapConstants';
import { calculateBBox, calculateCentroid } from '../../../utils/geoUtils';
import { useLocationStore } from '../../../store/useLocationStore';
import { useMapUIStore, MapCameraMode, MapUIState } from '../store/useMapUIStore';

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
  uiState: MapUIState;
  isNavigating: boolean;
  isPlanning: boolean;
  cameraMode: MapCameraMode;
  currentRoute: any | null;
  transportMode: string;
  isFetching: boolean;
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
    uiState,
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
  const { setCameraMode, isProgrammaticMove, setIsProgrammaticMove } = useMapUIStore();

  useImperativeHandle(ref, () => ({
    setCamera: (config: any) => cameraRef.current?.setCamera(config),
    fitBounds: (ne: number[], sw: number[], padding?: number[], duration?: number) =>
      cameraRef.current?.fitBounds(ne, sw, padding, duration),
  }));

  // Initial fix on user location
  const hasFixedOnUser = React.useRef(false);
  const userHeading = useLocationStore((s) => s.heading);

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

  const prevUiState = React.useRef<MapUIState>(uiState);
  const lastProcessedForceCenterRef = React.useRef(forceCenterCount);
  const lastProcessedRecenterRef = React.useRef(recenterCount);

  // 1. WATCHDOG: Ensure isProgrammaticMove is always cleared eventually
  useEffect(() => {
    if (isProgrammaticMove) {
      const timeout = setTimeout(() => {
        if (isProgrammaticMove) {
          console.log('[CameraWatchdog] Force-clearing isProgrammaticMove lock');
          setIsProgrammaticMove(false);
        }
      }, 3000); // 3s safety margin
      return () => clearTimeout(timeout);
    }
  }, [isProgrammaticMove, setIsProgrammaticMove]);

  // Centralized "Safety Reset" protocol
  const safetyReset = React.useCallback(() => {
    if (!cameraRef.current) return;
    cameraRef.current.setCamera({
      animationDuration: 0,
      padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
    });
  }, []);

  // Main Mode Transition Orchestrator
  useEffect(() => {
    const isNewMode = uiState !== prevUiState.current;
    const isForcedRecenter = recenterCount > lastProcessedRecenterRef.current;
    const isForcedCenter = forceCenterCount > lastProcessedForceCenterRef.current;
    
    if (isNewMode) {
      console.log(`[CameraManager] Mode Transition: ${prevUiState.current} -> ${uiState}`);
      safetyReset();
    }

    if (!cameraRef.current) return;

    // 1. NAVIGATION MODE
    if (uiState === MapUIState.NAVIGATING) {
      if (isNewMode || isForcedRecenter || isForcedCenter) {
        lastProcessedRecenterRef.current = recenterCount;
        lastProcessedForceCenterRef.current = forceCenterCount;
        setIsProgrammaticMove(true);
        
        cameraRef.current.setCamera({
          centerCoordinate: userCoordsRef.current || MAP_CENTER,
          zoomLevel: 18,
          pitch: 45,
          heading: userHeading || 0,
          animationDuration: isNewMode ? 1200 : 800,
          animationMode: 'flyTo',
        });

        const timer = setTimeout(() => {
          setCameraMode(MapCameraMode.NAVIGATION);
          setTimeout(() => setIsProgrammaticMove(false), 500);
        }, isNewMode ? 1300 : 900);
        return () => clearTimeout(timer);
      }
    }

    // 2. PLANNING MODE
    else if (uiState === MapUIState.PLANNING) {
      if (isNewMode || isForcedCenter) {
        lastProcessedForceCenterRef.current = forceCenterCount;
        setCameraMode(MapCameraMode.FREE);
        
        if (!isFetching) {
          const destinationCoords = selectedCoords || 
            selectedEvent?.coordinates || 
            selectedEvent?.center?.coordinates || 
            selectedEvent?.geometry?.coordinates;

          const pointsToFit = currentRoute?.geometry?.coordinates || 
            (userCoordsRef.current && destinationCoords ? [userCoordsRef.current, destinationCoords] : []);

          const validPoints = pointsToFit.filter((c: any) => c && c.length === 2 && (Math.abs(c[0]) > 0.001));

          if (validPoints.length >= 2) {
            const bbox = calculateBBox(validPoints);
            if (bbox) {
              setIsProgrammaticMove(true);
              cameraRef.current.setCamera({
                bounds: {
                  ne: [bbox[2], bbox[3]],
                  sw: [bbox[0], bbox[1]],
                  paddingTop: insets.top + 100,
                  paddingRight: 50,
                  paddingBottom: insets.bottom + 340,
                  paddingLeft: 50,
                },
                pitch: is3DActive ? 45 : 0,
                heading: 0,
                animationDuration: 1200,
                animationMode: 'flyTo',
              });
              const timer = setTimeout(() => setIsProgrammaticMove(false), 1300);
              return () => clearTimeout(timer);
            }
          }
        }
      }
    }

    // 3. POI DETAIL MODE
    else if (uiState === MapUIState.POI_DETAIL) {
      if (isNewMode || isForcedCenter || isForcedRecenter) {
        lastProcessedForceCenterRef.current = forceCenterCount;
        lastProcessedRecenterRef.current = recenterCount;
        setCameraMode(MapCameraMode.FREE);

        const targetCoords = selectedCoords || 
          selectedEvent?.coordinates || 
          selectedEvent?.center?.coordinates || 
          selectedEvent?.geometry?.coordinates;

        if (targetCoords) {
          setIsProgrammaticMove(true);
          cameraRef.current.setCamera({
            centerCoordinate: targetCoords,
            zoomLevel: selectedEvent ? 13.0 : 18.0,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 60 : 0,
            padding: {
              paddingBottom: SCREEN_HEIGHT * 0.45,
              paddingTop: insets.top + 40,
              paddingLeft: 20,
              paddingRight: 20,
            },
          });

          const timer = setTimeout(() => {
            if (cameraRef.current) {
              cameraRef.current.setCamera({
                padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
                animationDuration: 0,
              });
            }
            setIsProgrammaticMove(false);
          }, 1100);
          return () => clearTimeout(timer);
        }
      }
    }

    // 4. EXPLORING / BASE MODE
    else if (uiState === MapUIState.EXPLORING) {
      if (isNewMode || isForcedRecenter) {
        lastProcessedRecenterRef.current = recenterCount;
        setCameraMode(MapCameraMode.FREE);
        
        if (userCoordsRef.current) {
          setIsProgrammaticMove(true);
          cameraRef.current.setCamera({
            centerCoordinate: userCoordsRef.current,
            zoomLevel: DEFAULT_ZOOM,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 60 : 0,
          });
          const timer = setTimeout(() => setIsProgrammaticMove(false), 1100);
          return () => clearTimeout(timer);
        }
      }
    }

    prevUiState.current = uiState;
  }, [
    uiState, 
    recenterCount, 
    forceCenterCount, 
    selectedCoords, 
    selectedEvent, 
    currentRoute, 
    isFetching, 
    is3DActive
  ]);

  // Handle 3D Pitch toggle independently for better responsiveness
  useEffect(() => {
    if (cameraRef.current && uiState !== MapUIState.NAVIGATING && uiState !== MapUIState.PLANNING) {
      cameraRef.current.setCamera({
        pitch: is3DActive ? 60 : 0,
        animationDuration: 600,
      });
    }
  }, [is3DActive]);

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
      followUserMode={
        (cameraMode === MapCameraMode.NAVIGATION 
          ? (Platform.OS === 'android' ? 'compass' : 'course') 
          : 'normal') as any
      }
      followZoomLevel={cameraMode === MapCameraMode.NAVIGATION ? 18 : undefined}
      followPitch={cameraMode === MapCameraMode.NAVIGATION ? 45 : undefined}
      onUserTrackingModeChange={(e) => {
        // If the native map stops following (due to user drag), sync our state to FREE
        // BUT ONLY if this wasn't triggered by our own programmatic flyTo
        if (
          !isProgrammaticMove &&
          e.nativeEvent.payload.followUserLocation === false &&
          cameraMode !== MapCameraMode.FREE
        ) {
          console.log('[Camera] Native follow disabled by user interaction');
          setCameraMode(MapCameraMode.FREE);
        }
      }}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
