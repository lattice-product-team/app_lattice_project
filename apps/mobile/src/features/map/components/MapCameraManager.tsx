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
  selectedPoiId: string | number | null;
  selectedEventId: string | number | null;
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
    selectedPoiId,
    selectedEventId,
  } = props;

  const cameraRef = React.useRef<any>(null);
  const insets = useSafeAreaInsets();
  const lastTargetRef = React.useRef<string | null>(null);
  const lastActionTimestamp = React.useRef<number>(0);
  const transitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);
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

  const isProgrammaticMoveRef = React.useRef(isProgrammaticMove);
  const prevIsFetching = React.useRef(isFetching);

  useEffect(() => {
    isProgrammaticMoveRef.current = isProgrammaticMove;
  }, [isProgrammaticMove]);

  const prevUiState = React.useRef<MapUIState>(uiState);
  const lastProcessedForceCenterRef = React.useRef(forceCenterCount);
  const lastProcessedRecenterRef = React.useRef(recenterCount);
  const prevRouteRef = React.useRef(currentRoute);

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

  // Centralized "Safety Reset" protocol - Increased duration for Android reliability
  const safetyReset = React.useCallback(() => {
    if (!cameraRef.current) return;
    
    const config: any = {
      animationDuration: 400, // Use a small duration to ensure Android processes the update
      padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
      pitch: is3DActive ? 60 : 0,
    };

    // CRITICAL FIX: On Android, we MUST provide a centerCoordinate during padding resets
    // otherwise the native map engine snaps back to the last programmatic target (the POI).
    if (Platform.OS === 'android' && lastCameraPosition?.center) {
      config.centerCoordinate = lastCameraPosition.center;
    }

    cameraRef.current.setCamera(config);
  }, [is3DActive, lastCameraPosition]);

  // Main Mode Transition Orchestrator
  useEffect(() => {
    const isNewMode = uiState !== prevUiState.current;
    const isForcedRecenter = recenterCount > lastProcessedRecenterRef.current;
    const isForcedCenter = forceCenterCount > lastProcessedForceCenterRef.current;
    const isNewRoute = currentRoute !== prevRouteRef.current;

    // Robust Target Resolution
    let targetCoords =
      selectedCoords ||
      selectedEvent?.coordinates ||
      selectedEvent?.center?.coordinates ||
      selectedEvent?.geometry?.coordinates;

    // Fallback: If we have an ID but no coords, try to find it in the geojson
    if (!targetCoords && (selectedPoiId || selectedEventId)) {
      const id = selectedPoiId || selectedEventId;
      const feature = poisGeoJSON?.features?.find(
        (f: any) => String(f.properties?.id) === String(id)
      );
      if (feature?.geometry?.type === 'Point') {
        targetCoords = feature.geometry.coordinates;
      }
    }

    const targetKey = targetCoords ? `${targetCoords[0]},${targetCoords[1]}` : null;
    const isNewTarget = targetKey !== lastTargetRef.current;

    const canStealCamera =
      cameraMode !== MapCameraMode.FREE ||
      isNewMode ||
      isForcedCenter ||
      isForcedRecenter ||
      (isNewTarget && targetKey !== null);

    if (!canStealCamera) {
      // CRITICAL: We must update these refs even if we don't move the camera.
      // Otherwise, isNewTarget/isNewMode will remain 'true' and trigger 
      // the centering again as soon as any other prop changes.
      prevUiState.current = uiState;
      prevIsFetching.current = isFetching;
      prevRouteRef.current = currentRoute;
      lastTargetRef.current = targetKey;
      lastProcessedRecenterRef.current = recenterCount;
      lastProcessedForceCenterRef.current = forceCenterCount;
      return;
    }

    if (isNewMode || isNewTarget || isForcedCenter || isForcedRecenter || isNewRoute) {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        setIsProgrammaticMove(false);
      }
    }

    if (isNewMode) {
      if (uiState === MapUIState.EXPLORING) {
        safetyReset();
      }
    }

    if (!cameraRef.current) return;

    // 1. NAVIGATION MODE
    if (uiState === MapUIState.NAVIGATING) {
      const isForced = isNewMode || isForcedRecenter || isForcedCenter || isNewTarget;
      
      // CRITICAL: If the user has panned away (FREE mode) and this is just a regular GPS update 
      // (not a button tap/new mode), we MUST NOT move the camera.
      if (cameraMode === MapCameraMode.FREE && !isForcedRecenter && !isNewMode) {
        return;
      }

      if (isForced) {
        lastProcessedRecenterRef.current = recenterCount;
        lastProcessedForceCenterRef.current = forceCenterCount;
        lastTargetRef.current = targetKey;
        
        // Use a much shorter programmatic lock (only for the duration of the initial flyTo)
        setIsProgrammaticMove(true);

        cameraRef.current.setCamera({
          centerCoordinate: userCoords || MAP_CENTER,
          zoomLevel: 18,
          pitch: 45,
          heading: userHeading || 0,
          animationDuration: 1000,
          animationMode: 'flyTo',
        });

        // Release the lock immediately after animation finishes
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = setTimeout(() => {
          setIsProgrammaticMove(false);
          // Only re-engage follow mode if we weren't already in it
          if (cameraMode === MapCameraMode.FREE || isForcedRecenter || isNewMode) {
            setCameraMode(MapCameraMode.FOLLOW_WITH_COURSE);
          }
        }, 1100);

        return () => {
          if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        };
      }
      return;
    }

    // 2. PLANNING MODE
    else if (uiState === MapUIState.PLANNING) {
      const isFinishFetching = !isFetching && prevIsFetching.current;
      if (isNewMode || isForcedCenter || isNewTarget || isFinishFetching || isNewRoute) {
        lastProcessedForceCenterRef.current = forceCenterCount;
        lastTargetRef.current = targetKey;
        setCameraMode(MapCameraMode.FREE);

        const destinationCoords = targetCoords;
        const pointsToFit =
          currentRoute?.geometry?.coordinates ||
          (userCoords && destinationCoords ? [userCoords, destinationCoords] : []);

        const validPoints = pointsToFit.filter(
          (c: any) => c && c.length === 2 && Math.abs(c[0]) > 0.001
        );

        if (!isFetching && validPoints.length >= 2) {
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
            transitionTimerRef.current = setTimeout(() => setIsProgrammaticMove(false), 1300);
            return () => {
              if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            };
          }
        } else if (destinationCoords) {
          setIsProgrammaticMove(true);
          cameraRef.current.setCamera({
            centerCoordinate: destinationCoords,
            zoomLevel: 14,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 45 : 0,
          });
          transitionTimerRef.current = setTimeout(() => setIsProgrammaticMove(false), 1100);
          return () => {
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
          };
        }
      }
    }

    // 3. POI / EVENT DETAIL MODE
    else if (uiState === MapUIState.POI_DETAIL || (isNewTarget && targetCoords)) {
      if (isNewMode || isForcedCenter || isForcedRecenter || isNewTarget) {
        lastProcessedForceCenterRef.current = forceCenterCount;
        lastProcessedRecenterRef.current = recenterCount;
        lastTargetRef.current = targetKey;
        setCameraMode(MapCameraMode.FREE);

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

          transitionTimerRef.current = setTimeout(() => {
            setIsProgrammaticMove(false);
          }, 1100);
          return () => {
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
          };
        }
      }
    }

    // 4. EXPLORING / BASE MODE
    else if (uiState === MapUIState.EXPLORING) {
      lastTargetRef.current = null; // Always clear target in exploring

      if (isForcedRecenter) {
        lastProcessedRecenterRef.current = recenterCount;
        setCameraMode(MapCameraMode.FREE);

        if (userCoords) {
          setIsProgrammaticMove(true);
          cameraRef.current.setCamera({
            centerCoordinate: userCoords,
            zoomLevel: DEFAULT_ZOOM,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 60 : 0,
          });
          transitionTimerRef.current = setTimeout(() => setIsProgrammaticMove(false), 1100);
          return () => {
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
          };
        }
      }
    }

    prevUiState.current = uiState;
    prevIsFetching.current = isFetching;
    prevRouteRef.current = currentRoute;
  }, [
    uiState,
    recenterCount,
    forceCenterCount,
    selectedCoords,
    selectedEvent,
    currentRoute,
    isFetching,
    is3DActive,
    userCoords,
    userHeading,
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

  const defaultSettings = React.useMemo(
    () => ({
      centerCoordinate: userCoords || lastCameraPosition?.center || MAP_CENTER,
      zoomLevel: lastCameraPosition?.zoom || DEFAULT_ZOOM,
      pitch: lastCameraPosition?.pitch || 0,
    }),
    [userCoords, lastCameraPosition]
  );

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      minZoomLevel={2}
      defaultSettings={defaultSettings}
      userTrackingMode={cameraMode}
      followUserLocation={cameraMode !== 0}
      followUserMode={
        cameraMode === 2 ? 'heading' : cameraMode === 3 ? 'course' : 'normal'
      }
      followZoomLevel={uiState === MapUIState.NAVIGATING ? 18 : undefined}
      followPitch={uiState === MapUIState.NAVIGATING ? 45 : undefined}
      onUserTrackingModeChange={(e) => {
        // If the native map stops following (due to user drag), sync our state to FREE
        // BUT ONLY if this wasn't triggered by our own programmatic flyTo
        const isTrackingDisabled = e.nativeEvent.payload.followUserLocation === false;
        
        if (!isProgrammaticMove && isTrackingDisabled && cameraMode !== MapCameraMode.FREE) {
          // console.log('[Camera] User interaction broke native tracking');
          setCameraMode(MapCameraMode.FREE);
        }
      }}
    />
  );
});

MapCameraManager.displayName = 'MapCameraManager';
