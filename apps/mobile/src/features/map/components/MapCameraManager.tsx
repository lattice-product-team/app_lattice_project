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
    lastProcessedTarget,
    setLastProcessedTarget,
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

  const prevUiState = React.useRef<MapUIState | null>(uiState);
  const lastProcessedForceCenterRef = React.useRef(forceCenterCount);
  const lastProcessedRecenterRef = React.useRef(recenterCount);
  const prevRouteRef = React.useRef(currentRoute);
  const userCoordsRef = React.useRef(userCoords);
  const userHeadingRef = React.useRef(userHeading);
  const localLastTargetRef = React.useRef<string | null>(lastProcessedTarget);

  useEffect(() => {
    userCoordsRef.current = userCoords;
    userHeadingRef.current = userHeading;
  }, [userCoords, userHeading]);

  // Sync local memory with persistent store on mount/change
  useEffect(() => {
    if (lastProcessedTarget !== localLastTargetRef.current) {
      localLastTargetRef.current = lastProcessedTarget;
    }
  }, [lastProcessedTarget]);

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
    const isNewTarget = targetKey !== localLastTargetRef.current;

    const isEnteringDetail = (uiState === MapUIState.POI_DETAIL || uiState === MapUIState.PLANNING || uiState === MapUIState.NAVIGATING) && isNewMode;

    const canStealCamera =
      cameraMode !== MapCameraMode.FREE ||
      isForcedCenter ||
      isForcedRecenter ||
      (isEnteringDetail && isNewTarget) ||
      (isNewTarget && targetKey !== null);

    // CRITICAL: Always sync the "seen" state to prevent late-stealing
    const syncState = () => {
      prevUiState.current = uiState;
      lastProcessedRecenterRef.current = recenterCount;
      lastProcessedForceCenterRef.current = forceCenterCount;
      prevRouteRef.current = currentRoute;
      if (isNewTarget) {
        localLastTargetRef.current = targetKey;
        setLastProcessedTarget(targetKey);
      }
    };

    if (!canStealCamera) {
      syncState();
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

    // 1. NAVIGATION MODE (Highest Priority Centering)
    if (uiState === MapUIState.NAVIGATING) {
      if (isNewMode || isForcedRecenter || isForcedCenter) {
        console.log(`[Camera] Navigation: Centering on user (Mode: ${cameraMode})`);
        if (userCoordsRef.current) {
          setIsProgrammaticMove(true);
          cameraRef.current.setCamera({
            centerCoordinate: userCoordsRef.current,
            zoomLevel: 18,
            animationDuration: 1000,
            animationMode: 'flyTo',
            heading: (cameraMode === MapCameraMode.FOLLOW_WITH_HEADING || cameraMode === MapCameraMode.FOLLOW_WITH_COURSE) 
              ? (userHeadingRef.current || 0) 
              : 0,
            pitch: 45,
          });
          // Clear lock after animation
          setTimeout(() => setIsProgrammaticMove(false), 1100);
        }
      }
      // No need to fall through in navigation mode
      syncState();
      return;
    }

    // 2. PLANNING MODE
    else if (uiState === MapUIState.PLANNING) {
      const isFinishFetching = !isFetching && prevIsFetching.current;
      if (isNewMode || isForcedCenter || isNewTarget || isFinishFetching || isNewRoute) {
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
              setIsProgrammaticMove(true);
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
              setTimeout(() => setIsProgrammaticMove(false), 1300);
            }
            return () => {
              clearTransitionTimer();
            };
          }
        } else if (destinationCoords) {
          console.log('[Camera] Planning: Flying to destination fallback');
          cameraRef.current.setCamera({
            centerCoordinate: destinationCoords,
            zoomLevel: 14,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 45 : 0,
          });
          return () => clearTransitionTimer();
        }
      }
      syncState();
      return;
    }

    // 3. POI / EVENT SELECTION (Target focus)
    // This handles both explicit POI_DETAIL mode and selections made while EXPLORING
    else if (uiState === MapUIState.POI_DETAIL || (uiState === MapUIState.EXPLORING && isNewTarget && targetCoords)) {
      if (isNewMode || isForcedCenter || isForcedRecenter || isNewTarget) {
        setCameraMode(MapCameraMode.FREE);

        if (targetCoords) {
          // ONLY move camera if not already in FREE mode or if explicitly requested
          const shouldMove = cameraMode !== MapCameraMode.FREE || isForcedCenter || isNewMode || isForcedRecenter;
          
          if (shouldMove) {
            console.log('[Camera] POI/Event: Flying to target');
            setIsProgrammaticMove(true);
            cameraRef.current.setCamera({
              centerCoordinate: targetCoords,
              zoomLevel: selectedEvent ? 13.0 : 18.0,
              animationDuration: 1000,
              animationMode: 'flyTo',
              pitch: is3DActive ? 60 : 0,
            });
            setTimeout(() => setIsProgrammaticMove(false), 1100);
          }
          
          return () => {
            clearTransitionTimer();
          };
        }
      }
      syncState();
      return;
    }

    // 4. EXPLORING / BASE MODE
    else if (uiState === MapUIState.EXPLORING) {
      lastTargetRef.current = null; // Always clear target in exploring

      if (isForcedRecenter) {
        lastProcessedRecenterRef.current = recenterCount;
        setCameraMode(MapCameraMode.FREE);

        if (userCoordsRef.current) {
          console.log('[Camera] Exploring: flying to user');
          cameraRef.current.setCamera({
            centerCoordinate: userCoordsRef.current,
            zoomLevel: DEFAULT_ZOOM,
            animationDuration: 1000,
            animationMode: 'flyTo',
            pitch: is3DActive ? 60 : 0,
          });
          return () => clearTransitionTimer();
        }
      }
    }

    syncState();
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
