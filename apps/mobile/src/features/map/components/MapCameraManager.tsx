import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_ZOOM, MAP_CENTER } from '../../../constants/mapConstants';
import { calculateBBox, calculateCentroid } from '../../../utils/geoUtils';
import { useLocationStore } from '../../../store/useLocationStore';
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

  const lastFocusedPoiRef = React.useRef<string | null>(null);
  const lastProcessedForceCenterRef = React.useRef(forceCenterCount);
  const lastProcessedRecenterRef = React.useRef(recenterCount);

  // Recenter on user (manual trigger)
  useEffect(() => {
    if (recenterCount > lastProcessedRecenterRef.current && cameraRef.current && userCoords) {
      lastProcessedRecenterRef.current = recenterCount;
      
      // If we are already in navigation mode, don't trigger a separate flyTo 
      // as it will fight with the navigation effect. Instead, just let the navigation 
      // effect handle the "re-snap".
      if (cameraMode === MapCameraMode.NAVIGATION && isNavigating) {
        return;
      }

      cameraRef.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: 1000,
        animationMode: 'flyTo',
        pitch: is3DActive ? 60 : 0,
        padding: { paddingBottom: 150, paddingTop: 60, paddingLeft: 20, paddingRight: 20 },
      });

      // Clear goal after animation to unblock manual interaction
      const timer = setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
            animationDuration: 0,
          });
        }
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [recenterCount, userCoords, is3DActive, cameraMode, isNavigating]);

  useEffect(() => {
    const now = Date.now();
    if (selectedCoords && cameraRef.current && !isNavigating) {
      const targetKey = `poi-${selectedCoords.join(',')}`;
      const isForced = forceCenterCount !== lastProcessedForceCenterRef.current;

      // Skip if we are already focused on this POI and it's not a forced recenter
      if (
        !isForced &&
        lastFocusedPoiRef.current === targetKey &&
        now - lastActionTimestamp.current < CAMERA_ACTION_THROTTLE
      ) {
        return;
      }

      lastFocusedPoiRef.current = targetKey;
      lastActionTimestamp.current = now;
      lastProcessedForceCenterRef.current = forceCenterCount;

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

      // Clear goal after animation to unblock manual interaction
      const timer = setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
            animationDuration: 0,
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (!selectedCoords) {
      // CRITICAL FIX: When deselected, explicitly clear the goal by calling setCamera 
      // with no padding. This "unblocks" the Android camera engine for POIs too.
      if (lastFocusedPoiRef.current && cameraRef.current) {
        cameraRef.current.setCamera({
          padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
          animationDuration: 0,
        });
      }
      lastFocusedPoiRef.current = null;
    }
  }, [selectedCoords, isNavigating, insets.top, forceCenterCount, cameraMode, is3DActive]);


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
  const lastFocusedEventRef = React.useRef<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (selectedEvent && cameraRef.current && !isNavigating) {
      const eventId = selectedEvent.id || selectedEvent.properties?.id;
      const targetKey = `event-${eventId}`;
      const isForced = forceCenterCount !== lastProcessedForceCenterRef.current;

      if (
        !isForced &&
        lastFocusedEventRef.current === targetKey &&
        now - lastActionTimestamp.current < CAMERA_ACTION_THROTTLE
      ) {
        return;
      }

      lastFocusedEventRef.current = targetKey;
      lastActionTimestamp.current = now;
      lastProcessedForceCenterRef.current = forceCenterCount;

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

        // Clear goal after animation to unblock manual interaction
        const timer = setTimeout(() => {
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
              animationDuration: 0,
            });
          }
        }, 1300);
        return () => clearTimeout(timer);
      }
    } else if (!selectedEvent) {
      // CRITICAL FIX: When deselected, explicitly clear the goal by calling setCamera 
      // with current pitch and no padding. This "unblocks" the Android camera engine.
      if (lastFocusedEventRef.current && cameraRef.current) {
        cameraRef.current.setCamera({
          padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
          animationDuration: 0,
        });
      }
      lastFocusedEventRef.current = null;
    }
  }, [selectedEvent, isNavigating, insets.top, forceCenterCount, cameraMode]);


  const userCoordsRef = React.useRef(userCoords);
  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  const prevIsNavigating = React.useRef(isNavigating);

  // Navigation camera behavior
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Only trigger the "jump to navigation" transition when navigation is FIRST enabled
    if (isNavigating && !prevIsNavigating.current && cameraRef.current) {
      setIsProgrammaticMove(true);

      // Transition gracefully to the user's location with 3D pitch and initial alignment
      if (userCoordsRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: userCoordsRef.current,
          zoomLevel: 18,
          pitch: 45,
          heading: userHeading || 0, // Align once at the very start
          animationDuration: 1200,
          animationMode: 'flyTo',
        });
      }

      // Engage native follow mode only after the smooth transition settles
      timer = setTimeout(() => {
        setCameraMode(MapCameraMode.NAVIGATION);
        
        // Keep the lock slightly longer than the mode switch to catch trailing events
        setTimeout(() => {
          setIsProgrammaticMove(false);
        }, 800);
      }, 1300); // Slightly longer than 1200ms animation
    } else if (!isNavigating && prevIsNavigating.current) {
      // EXIT NAVIGATION SEQUENCE - CRITICAL FIX FOR ANDROID LOCKUPS
      // 1. Update state FIRST to stop native tracking via followProps
      setCameraMode(MapCameraMode.FREE);
      setIsProgrammaticMove(false);
      
      // 2. Clear planning ref to allow the planning effect to trigger
      if (isPlanning) {
        lastPlanningRouteRef.current = null;
      }

      // 3. Perform imperative cleanup AFTER a short delay to allow props to propagate
      const timer = setTimeout(() => {
        if (!cameraRef.current || isNavigating) return;

        // Force-reset camera goals IMMEDIATELY with no animation
        cameraRef.current.setCamera({
          animationDuration: 0,
          pitch: 0,
          heading: 0,
          padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
        });

        if (!isPlanning) {
          // Reset to normal exploration view
          const targetCoords = selectedCoords || 
            selectedEvent?.coordinates || 
            selectedEvent?.center?.coordinates ||
            selectedEvent?.geometry?.coordinates;

          cameraRef.current.setCamera({
            centerCoordinate: targetCoords || userCoordsRef.current || MAP_CENTER,
            zoomLevel: targetCoords ? 18 : 17,
            pitch: is3DActive ? 60 : 0,
            heading: 0,
            animationDuration: 1000,
            animationMode: 'flyTo',
          });
        }
      }, 100); // 100ms is enough for several frames/renders
      
      return () => clearTimeout(timer);
    }
    
    prevIsNavigating.current = isNavigating;
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isNavigating, isPlanning, is3DActive]); // REMOVED userHeading to stop jitter loop

  // Robustly handle the transition to NAVIGATION mode (Centering button or re-engagement)
  useEffect(() => {
    // Only handle MANUAL re-centering here (when recenterCount or forceCenterCount changes)
    const isManualTrigger = recenterCount > lastProcessedRecenterRef.current || 
                           forceCenterCount > lastProcessedForceCenterRef.current;

    if (cameraMode === MapCameraMode.NAVIGATION && isNavigating && cameraRef.current && isManualTrigger) {
      lastProcessedRecenterRef.current = recenterCount;
      lastProcessedForceCenterRef.current = forceCenterCount;
      
      setIsProgrammaticMove(true);

      // Reset camera goals
      cameraRef.current.setCamera({
        padding: { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 },
        animationDuration: 0,
      });

      if (userCoordsRef.current && (Math.abs(userCoordsRef.current[0]) > 0.1)) {
        cameraRef.current.setCamera({
          centerCoordinate: userCoordsRef.current,
          zoomLevel: 18,
          pitch: 45,
          heading: userHeading || 0, // Align once on manual trigger
          animationDuration: 800, 
          animationMode: 'flyTo',
        });
      }

      const timer = setTimeout(() => {
        setIsProgrammaticMove(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cameraMode, isNavigating, recenterCount, forceCenterCount]); // REMOVED userHeading to stop jitter loop

  const lastPlanningRouteRef = React.useRef<string | null>(null);

  // Planning fitBounds
  useEffect(() => {
    // Safety check: don't trigger planning fitBounds if we are currently in navigation
    // or if the engine is likely busy with the transition.
    if (isNavigating) return;

    // Only trigger camera transition if we are planning and NOT currently fetching a new route.
    if (isPlanning && cameraRef.current && !isNavigating && !isFetching) {
      const destinationCoords = selectedCoords || 
        selectedEvent?.coordinates || 
        selectedEvent?.center?.coordinates || 
        selectedEvent?.geometry?.coordinates ||
        (selectedEvent?.boundary?.coordinates?.[0] ? calculateCentroid(selectedEvent.boundary.coordinates[0]) : null);

      const routeId = currentRoute 
        ? `${transportMode}-${currentRoute.properties?.durationEstimate}-${currentRoute.properties?.distance}` 
        : (destinationCoords ? `planning-${destinationCoords.join(',')}` : null);
      
      // If this route is already being animated/displayed, don't restart the whole sequence
      if (lastPlanningRouteRef.current === routeId) return;
      lastPlanningRouteRef.current = routeId;

      // STOP any ongoing tracking IMMEDIATELY
      setCameraMode(MapCameraMode.FREE);

      const timer = setTimeout(() => {
        let pointsToFit: number[][] = [];

        if (currentRoute?.geometry?.coordinates) {
          pointsToFit = currentRoute.geometry.coordinates;
        } else if (userCoordsRef.current && destinationCoords) {
          pointsToFit = [userCoordsRef.current, destinationCoords];
        }

        // Safety Filter: Remove [0,0] or invalid coordinates that cause extreme zoom-outs
        // This is a common issue when GPS hasn't fired yet or state is partially initialized.
        const validPoints = pointsToFit.filter(c => 
          c && c.length === 2 && 
          (Math.abs(c[0]) > 0.001 || Math.abs(c[1]) > 0.001) &&
          !isNaN(c[0]) && !isNaN(c[1])
        );

        if (validPoints.length < 2) return;

        const bbox = calculateBBox(validPoints);
        if (!bbox) return;

        // Use a single setCamera call to fit bounds and set pitch simultaneously.
        // This avoids the jerky "animation cut" at the end of the transition
        // that happened when separate fitBounds and pitch timers fought for control.
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
          heading: 0, // Reset heading in planning view
          animationDuration: 1200,
          animationMode: 'flyTo',
        });
      }, 1000); // Increased delay to 1s to ensure engine is idle after navigation exit
      
      return () => clearTimeout(timer);
    } else if (!isPlanning || isNavigating) {
      // Clear the ref so that when we return from navigation to planning, 
      // the camera correctly re-fits the route.
      lastPlanningRouteRef.current = null;
    }
  }, [isPlanning, isNavigating, selectedCoords, currentRoute, insets.top, insets.bottom, is3DActive, transportMode, isFetching]);

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
      followPitch={cameraMode === MapCameraMode.NAVIGATION ? 45 : undefined} // ONLY set followPitch in navigation
      followHeading={cameraMode === MapCameraMode.NAVIGATION ? undefined : 0} // Force North when FREE
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
