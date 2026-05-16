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
  realtimeCameraRef?: React.MutableRefObject<{ center: number[]; zoom: number }>;
}

export interface MapCameraHandle {
  setCamera: (config: any) => void;
  fitBounds: (ne: number[], sw: number[], padding?: number[], duration?: number) => void;
  handleRegionChangeComplete: (center?: number[], zoom?: number) => void;
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
    realtimeCameraRef,
  } = props;

  const cameraRef = React.useRef<any>(null);
  const insets = useSafeAreaInsets();
  const lastTargetRef = React.useRef<string | null>(null);
  const lastActionTimestamp = React.useRef<number>(0);
  const transitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const CAMERA_ACTION_THROTTLE = 500; // ms
  const { setCameraMode, isProgrammaticMove, setIsProgrammaticMove } = useMapUIStore();

  const clearTransitionTimer = React.useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    // Always sync store state when clearing timer manually
    if (useMapUIStore.getState().isProgrammaticMove) {
      setIsProgrammaticMove(false);
    }
  }, [setIsProgrammaticMove]);

  // Centralized "Safety Reset" protocol - Improved to prevent rebound on Android
  const safetyReset = React.useCallback((overrideCenter?: number[], overrideZoom?: number) => {
    if (!cameraRef.current) return;
    
    // If the user is already manually controlling the map, we do a SILENT reset.
    // We clear padding with 0 duration and WITHOUT forcing a center coordinate.
    // UPDATE: On Android, we MUST always provide a center to avoid native snap-back.
    const isUserControlled = cameraMode === MapCameraMode.FREE;
    const shouldForceCenter = Platform.OS === 'android';

    // Prioritize: 1. Explicit override, 2. Real-time ref (most accurate), 3. Last stopped pos
    const center = overrideCenter || realtimeCameraRef?.current?.center || lastCameraPosition?.center;
    const zoom = overrideZoom || realtimeCameraRef?.current?.zoom || lastCameraPosition?.zoom;

    const config: any = {
      animationDuration: isUserControlled ? 0 : 300,
      pitch: is3DActive ? 60 : 0,
    };

    if (shouldForceCenter && center) {
      console.log(`[Camera] safetyReset: Forcing center on Android to avoid native snap (duration: ${config.animationDuration})`);
      config.centerCoordinate = center;
      if (zoom) config.zoomLevel = zoom;
    } else {
      console.log(`[Camera] safetyReset: Silent reset (isUserControlled: ${isUserControlled})`);
    }

    cameraRef.current.setCamera(config);
  }, [is3DActive, lastCameraPosition, cameraMode, realtimeCameraRef]);

  useImperativeHandle(ref, () => ({
    setCamera: (config: any) => cameraRef.current?.setCamera(config),
    fitBounds: (ne: number[], sw: number[], padding?: number[], duration?: number) =>
      cameraRef.current?.fitBounds(ne, sw, padding, duration),
    handleRegionChangeComplete: (center?: number[], zoom?: number) => {
      // Deferred reset no longer needed thanks to reactive padding props
    }
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

  const prevUiState = React.useRef<MapUIState | null>(null);
  const lastProcessedForceCenterRef = React.useRef(forceCenterCount);
  const lastProcessedRecenterRef = React.useRef(recenterCount);
  const prevRouteRef = React.useRef(currentRoute);

  const userCoordsRef = React.useRef(userCoords);
  const userHeadingRef = React.useRef(userHeading);

  useEffect(() => {
    userCoordsRef.current = userCoords;
    userHeadingRef.current = userHeading;
  }, [userCoords, userHeading]);

  // 1. WATCHDOG: Ensure isProgrammaticMove is always cleared eventually
  // Now deprecated as we move away from aggressive locking, but kept for safety.
  useEffect(() => {
    if (isProgrammaticMove) {
      const timeout = setTimeout(() => {
        if (useMapUIStore.getState().isProgrammaticMove) {
          setIsProgrammaticMove(false);
        }
      }, 1000); 
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isProgrammaticMove, setIsProgrammaticMove]);

  // 2. UNMOUNT CLEANUP: Ensure we never leave the camera locked
  useEffect(() => {
    return () => {
      clearTransitionTimer();
      if (useMapUIStore.getState().isProgrammaticMove) {
        useMapUIStore.getState().setIsProgrammaticMove(false);
      }
    };
  }, [clearTransitionTimer]);

  // Main Mode Transition Orchestrator
  useEffect(() => {
    const isNewMode = uiState !== prevUiState.current;
    const isForcedRecenter = recenterCount > lastProcessedRecenterRef.current;
    const isForcedCenter = forceCenterCount > lastProcessedForceCenterRef.current;
    const isNewRoute = currentRoute !== prevRouteRef.current;

    // IMMEDIATE REF SYNC: Update these NOW to prevent race conditions during re-renders.
    // If we don't do this, a rapid re-render (e.g. from GPS restart) will see the old
    // values and trigger a 'NewMode' steal again.
    prevUiState.current = uiState;
    lastProcessedRecenterRef.current = recenterCount;
    lastProcessedForceCenterRef.current = forceCenterCount;
    prevRouteRef.current = currentRoute;

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

    const isEnteringDetail = (uiState === MapUIState.POI_DETAIL || uiState === MapUIState.PLANNING) && isNewMode;

    const canStealCamera =
      cameraMode !== MapCameraMode.FREE ||
      isForcedCenter ||
      isForcedRecenter ||
      isEnteringDetail || // Always allow steal when explicitly opening a NEW detail/route
      (isNewTarget && targetKey !== null);

    if (!canStealCamera) {
      // Sync refs and return. No need for safetyReset here anymore
      // as padding is handled reactively via props.
      prevUiState.current = uiState;
      lastProcessedRecenterRef.current = recenterCount;
      lastProcessedForceCenterRef.current = forceCenterCount;
      prevRouteRef.current = currentRoute;
      return;
    }

    console.log(`[Camera] Orchestrator: Stealing camera. Reason: ${isNewMode ? 'NewMode' : isForcedCenter ? 'ForcedCenter' : isForcedRecenter ? 'ForcedRecenter' : isEnteringDetail ? 'EnteringDetail' : 'NewTarget'}`);

    if (isNewMode || isNewTarget || isForcedCenter || isForcedRecenter || isNewRoute) {
      clearTransitionTimer();
    }

    if (isNewMode) {
      if (uiState === MapUIState.EXPLORING) {
        safetyReset();
      }
    }

    if (!cameraRef.current) return;

    // 1. PLANNING MODE
    if (uiState === MapUIState.PLANNING) {
      const isFinishFetching = !isFetching && prevIsFetching.current;
      if (isNewMode || isForcedCenter || isNewTarget || isFinishFetching || isNewRoute) {
        lastProcessedForceCenterRef.current = forceCenterCount;
        lastTargetRef.current = targetKey;
        setCameraMode(MapCameraMode.FREE);

        const destinationCoords = targetCoords;
        const pointsToFit =
          currentRoute?.geometry?.coordinates ||
          (userCoordsRef.current && destinationCoords ? [userCoordsRef.current, destinationCoords] : []);

        const validPoints = pointsToFit.filter(
          (c: any) => c && c.length === 2 && Math.abs(c[0]) > 0.001
        );

        if (!isFetching && validPoints.length >= 2) {
          const bbox = calculateBBox(validPoints);
          if (bbox) {
            // ONLY perform the flyTo if we are not already in FREE mode
            // or if it's a forced centering action.
            const shouldMove = cameraMode !== MapCameraMode.FREE || isForcedCenter || isNewMode;
            if (shouldMove) {
              console.log('[Camera] Planning: Fitting route bounds');
              // REMOVED PROGRAMMATIC LOCK AND PADDING
              cameraRef.current.setCamera({
                bounds: {
                  ne: [bbox[2], bbox[3]],
                  sw: [bbox[0], bbox[1]],
                },
                pitch: is3DActive ? 45 : 0,
                heading: 0,
                animationDuration: 1200,
                animationMode: 'flyTo',
              });
            }
            return () => {
              clearTransitionTimer();
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
          transitionTimerRef.current = setTimeout(() => {
            setIsProgrammaticMove(false);
            transitionTimerRef.current = null;
          }, 1100);
          return () => {
            clearTransitionTimer();
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
          // ONLY move camera if not already in FREE mode or if explicitly requested
          const shouldMove = cameraMode !== MapCameraMode.FREE || isForcedCenter || isNewMode || isForcedRecenter;
          
          if (shouldMove) {
            console.log('[Camera] POI/Event: Flying to target');
            // REMOVED PADDING FROM HERE - It's now handled via Props
            cameraRef.current.setCamera({
              centerCoordinate: targetCoords,
              zoomLevel: selectedEvent ? 13.0 : 18.0,
              animationDuration: 1000,
              animationMode: 'flyTo',
              pitch: is3DActive ? 60 : 0,
            });
          }
          
          return () => {
            clearTransitionTimer();
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

        if (userCoordsRef.current) {
          setIsProgrammaticMove(true);
          cameraRef.current.setCamera({
            centerCoordinate: userCoordsRef.current,
            zoomLevel: DEFAULT_ZOOM,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 60 : 0,
          });
          transitionTimerRef.current = setTimeout(() => {
            setIsProgrammaticMove(false);
            transitionTimerRef.current = null;
          }, 1100);
          return () => {
            clearTransitionTimer();
          };
        }
      }
    }

    lastTargetRef.current = targetKey;
  }, [
    uiState,
    recenterCount,
    forceCenterCount,
    selectedCoords,
    selectedEvent,
    currentRoute,
    isFetching,
    is3DActive,
    clearTransitionTimer,
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

  // Compute reactive padding based on UI state
  const reactivePadding = React.useMemo(() => {
    if (uiState === MapUIState.POI_DETAIL) {
      return {
        paddingBottom: SCREEN_HEIGHT * 0.45,
        paddingTop: insets.top + 40,
        paddingLeft: 20,
        paddingRight: 20,
      };
    }
    if (uiState === MapUIState.PLANNING) {
      return {
        paddingTop: insets.top + 100,
        paddingRight: 50,
        paddingBottom: insets.bottom + 340,
        paddingLeft: 50,
      };
    }
    return { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 };
  }, [uiState, insets]);

  return (
    <MapLibreGL.Camera
      ref={cameraRef}
      minZoomLevel={2}
      defaultSettings={defaultSettings}
      padding={reactivePadding}
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
