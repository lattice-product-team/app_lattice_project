import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

/***
 * MapContent: Orchestrator for the main Map experience.
 */
//... (rest of imports)

import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore, MapCameraMode, MapUIState } from '../store/useMapUIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { normalizePOI, normalizeEventList } from '../../poi/adapters/poiAdapter';
import { useRoutingLogic } from '../../navigation/hooks/useRoutingLogic';
import { usePathNetwork } from '../../navigation/hooks/usePathNetwork';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

import { MapLayers } from './MapLayers';
import { MapImageManager } from './MapImageManager';

const DEFAULT_CAMERA_SETTINGS = {
  centerCoordinate: MAP_CENTER,
  zoomLevel: 14,
};

const FLY_TO_PADDING = { paddingBottom: 250, paddingTop: 0, paddingLeft: 0, paddingRight: 0 };
const ROUTE_OVERVIEW_PADDING = {
  ne: [0, 0], //Placeholder, calculated dynamically
  sw: [0, 0],
  paddingLeft: 60,
  paddingRight: 60,
  paddingTop: 140,
  paddingBottom: 400,
};

import { useLocationStore } from '../../../store/useLocationStore';
import { useStartupStore } from '../../../store/useStartupStore';
import styleLight from '../../../../assets/map/style-light.json';
import styleDark from '../../../../assets/map/style-dark.json';
import { MAPTILER_KEY, EMPTY_GEOJSON, MAP_CENTER } from '../../../constants/mapConstants';
import { startupMetrics } from '../../../utils/startupMetrics';

//--- Global Performance Cache: Pre-Filter Style Layers Outside Render Cycle ---
const filterMapStyle = (baseStyle: any) => {
  const filteredLayers = (baseStyle.layers || []).map((layer: any) => {
    const lid = (layer.id || '').toLowerCase();
    const isSymbolLayer = layer.type === 'symbol';
    const isEssentialLabel =
      lid.includes('place') ||
      lid.includes('city') ||
      lid.includes('town') ||
      lid.includes('village') ||
      lid.includes('country') ||
      lid.includes('state') ||
      lid.includes('continent') ||
      lid.includes('road') ||
      lid.includes('water');

    //Android Optimization: Disable building extrusion and complex terrain shaders if they exist
    if (
      Platform.OS === 'android' &&
      (lid.includes('building') || layer.type === 'fill-extrusion')
    ) {
      return {
        ...layer,
        layout: { ...(layer.layout || {}), visibility: 'none' },
      };
    }

    if (isSymbolLayer && !isEssentialLabel) {
      return {
        ...layer,
        layout: {
          ...(layer.layout || {}),
          visibility: 'none',
        },
      };
    }
    return layer;
  });

  return {
    ...baseStyle,
    layers: filteredLayers,
    sources: {
      ...(baseStyle.sources || {}),
      maptiler_planet: {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
      },
    },
  };
};

let cachedLightStyle: any = null;
let cachedDarkStyle: any = null;

const getOptimizedStyle = (isDark: boolean) => {
  if (isDark) {
    if (!cachedDarkStyle) {
      cachedDarkStyle = filterMapStyle(JSON.parse(JSON.stringify(styleDark)));
    }
    return cachedDarkStyle;
  } else {
    if (!cachedLightStyle) {
      cachedLightStyle = filterMapStyle(JSON.parse(JSON.stringify(styleLight)));
    }
    return cachedLightStyle;
  }
};

const getNativeIconName = (categoryIcon: any) => {
  const icon = String(categoryIcon || '').toLowerCase();

  //Food & Drink
  if (
    icon.includes('restaurant') ||
    icon.includes('food') ||
    icon.includes('utensils') ||
    icon.includes('coffee')
  )
    return 'restaurant';
  if (icon.includes('bar') || icon.includes('drink') || icon.includes('beer')) return 'beer';

  //Infrastructure
  if (icon.includes('parking')) return 'parking';
  if (icon.includes('wc') || icon.includes('toilet') || icon.includes('restroom')) return 'toilet';
  if (
    icon.includes('gate') ||
    icon.includes('login') ||
    icon.includes('entrance') ||
    icon.includes('log-out')
  )
    return 'log-out';

  //Health & Safety
  if (icon.includes('medical') || icon.includes('plus') || icon.includes('hospital'))
    return 'hospital';
  if (icon.includes('security') || icon.includes('shield')) return 'shield';

  //Info & Points
  if (icon.includes('info') || icon.includes('library')) return 'library-big';
  if (icon.includes('meetup') || icon.includes('users')) return 'users';

  //Venues & Shopping
  if (icon.includes('shop') || icon.includes('store') || icon.includes('shopping')) return 'store';
  if (
    icon.includes('stage') ||
    icon.includes('theater') ||
    icon.includes('grandstand') ||
    icon.includes('music')
  )
    return 'theater';
  if (icon.includes('vip') || icon.includes('crown') || icon.includes('exclusive')) return 'crown';

  return 'library-big'; //Fallback to info-style
};

interface MapContentProps {
  poisGeoJSON: any;
  allEvents?: any[];
  savedLocations?: any;
  onDeselect?: () => void;
  onSelectEvent?: (event: any) => void;
  sheetPosition: any;
  islandState: any;
  is3DActive?: boolean;
}

export const MapContent = function MapContent({
  poisGeoJSON,
  allEvents = [],
  onDeselect,
  onSelectEvent,
  islandState,
  is3DActive = false,
}: MapContentProps) {
  const cameraRef = useRef<MapLibreGL.Camera>(null);
  const mapRef = useRef<any>(null);
  const theme = useLatticeTheme();
  const hasInitialRendered = React.useRef(false);

  const { selectPoi, setSelectedEvent, selectedPoiId, selectedCoords, selectedEventId } =
    usePOIStore();
  const { currentRoute, isNavigating, isPlanning, transportMode, isFetching } =
    useNavigationStore();
  const {
    uiState,
    recenterCount,
    forceCenterCount,
    cameraMode,
    setCameraMode,
    lastCameraPosition,
    setLastCameraPosition,
    setInitialLoadComplete,
    isInitialLoadComplete,
    isProgrammaticMove,
    setIsProgrammaticMove,
    lastProcessedTarget,
    setLastProcessedTarget,
    visibleBounds,
    triggerSource,
  } = useMapUIStore();
  const { currentEventId, selectedEvent, setCurrentEvent: setGlobalCurrentEvent } = useEventStore();
  const userCoords = useLocationStore((s) => s.coords);

  const initialZoom = 14;
  const [discreteZoom, setDiscreteZoom] = React.useState(Math.round(initialZoom));
  const { getFilteredPOIs } = usePOIStore();

  const realtimeCameraRef = useRef<{ center: number[]; zoom: number }>({
    center: lastCameraPosition?.center || MAP_CENTER,
    zoom: lastCameraPosition?.zoom || initialZoom,
  });

  const zoomSharedValue = useSharedValue(initialZoom);
  const lastZoomUpdateRef = useRef(0);
  const ZOOM_THROTTLE_MS = 100;

  //--- Camera Orchestration ---
  const hasInitialized = useRef(false);
  const lastIsNavigating = useRef(isNavigating);
  const lastProcessedRouteId = useRef<string | null>(null);
  const lastProcessedRecenter = useRef(recenterCount);
  const lastProcessedForceCenter = useRef(forceCenterCount);
  const programmaticMoveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (programmaticMoveTimeoutRef.current) {
        clearTimeout(programmaticMoveTimeoutRef.current);
      }
    };
  }, []);

  //SNAP LOGIC: Instantly move the camera without animation
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

  //FLYTO LOGIC: Smooth cinematic transition
  const flyTo = useCallback(
    (coords: [number, number], zoom?: number, pitch?: number, duration: number = 1500) => {
      if (!cameraRef.current) return;

      console.log('[MapContent] ✈️ Flying to:', coords);
      if (programmaticMoveTimeoutRef.current) {
        clearTimeout(programmaticMoveTimeoutRef.current);
      }
      setIsProgrammaticMove(true);
      cameraRef.current.setCamera({
        centerCoordinate: coords,
        ...(zoom !== undefined && { zoomLevel: zoom }),
        ...(pitch !== undefined && { pitch: pitch }),
        animationDuration: duration,
        animationMode: 'flyTo',
        padding: FLY_TO_PADDING,
      });

      //Safety release of programmatic lock
      programmaticMoveTimeoutRef.current = setTimeout(() => {
        setIsProgrammaticMove(false);
      }, duration + 50);
    },
    [setIsProgrammaticMove]
  );

  //NATIVE TRACKING SYNC: Listen to when the native engine breaks follow mode
  const handleUserTrackingModeChange = useCallback(
    (e: any) => {
      const { followUserLocation } = e.nativeEvent.payload;
      if (!followUserLocation && cameraMode !== MapCameraMode.FREE && !isProgrammaticMove) {
        console.log('[MapContent] 🚨 Native tracking broken by gesture, syncing state');
        setCameraMode(MapCameraMode.FREE);
      }
    },
    [cameraMode, isProgrammaticMove, setCameraMode]
  );

  const getFollowMode = () => {
    switch (cameraMode) {
      case MapCameraMode.FOLLOW:
        return MapLibreGL.UserTrackingMode.Follow;
      case MapCameraMode.FOLLOW_WITH_HEADING:
        return MapLibreGL.UserTrackingMode.FollowWithHeading;
      case MapCameraMode.FOLLOW_WITH_COURSE:
        return MapLibreGL.UserTrackingMode.FollowWithCourse;
      default:
        return MapLibreGL.UserTrackingMode.None;
    }
  };

  //DEBUG EFFECT: Log camera state in real-time
  useEffect(() => {
    console.log(
      '[MapContent] 🔍 STATE DEBUG:',
      'Mode:',
      cameraMode,
      'HasInit:',
      hasInitialized.current,
      'isProgrammatic:',
      isProgrammaticMove,
      'userCoords:',
      userCoords
    );
  }, [cameraMode, isProgrammaticMove, userCoords]);

  //EFFECT 1: INITIAL POSITIONING: Snap to user location on startup
  useEffect(() => {
    if (!hasInitialized.current && userCoords && cameraRef.current && isInitialLoadComplete) {
      console.log('[MapContent] 🚀 Initial Startup Snap to user:', userCoords);
      snapToLocation([userCoords[0], userCoords[1]], 14);
      setCameraMode(MapCameraMode.FREE); //Ensure we start in FREE mode
      hasInitialized.current = true;
    }
  }, [userCoords, snapToLocation, setCameraMode, isInitialLoadComplete]);

  //EFFECT 2: NAVIGATION ENGAGEMENT: When navigation actually starts, fly close to user
  useEffect(() => {
    if (isNavigating && !lastIsNavigating.current) {
      const latestCoords = useLocationStore.getState().coords;
      if (latestCoords) {
        console.log('[MapContent] 🧭 Navigation START: Close-up FlyTo');
        flyTo([latestCoords[0], latestCoords[1]], 19.5, 45, 1200);
        setCameraMode(MapCameraMode.FOLLOW_WITH_HEADING);
      }
    }
    lastIsNavigating.current = isNavigating;
  }, [isNavigating, flyTo, setCameraMode]);

  //EFFECT 3: IMPERATIVE CENTER TRIGGER (Recenter Button)
  useEffect(() => {
    if (recenterCount > lastProcessedRecenter.current) {
      lastProcessedRecenter.current = recenterCount;
      const latestCoords = useLocationStore.getState().coords;
      if (latestCoords) {
        if (isNavigating) {
          console.log('[MapContent] 🎯 Recentering: Entering FOLLOW_WITH_HEADING (Nav Active)');
          setCameraMode(MapCameraMode.FOLLOW_WITH_HEADING);
        } else {
          console.log('[MapContent] 🎯 Recentering: FlyTo with FREE mode');
          setCameraMode(MapCameraMode.FREE); //KILL ANY PREVIOUS LOCK
          flyTo([latestCoords[0], latestCoords[1]], 20.0);
        }
      }
    }
  }, [recenterCount, isNavigating, setCameraMode, flyTo]);

  //EFFECT 4: IMPERATIVE POI FOCUS TRIGGER
  useEffect(() => {
    if (forceCenterCount > lastProcessedForceCenter.current) {
      lastProcessedForceCenter.current = forceCenterCount;
      const targetCoords = selectedCoords || selectedEvent?.center?.coordinates;
      if (targetCoords) {
        const shouldAnimate = triggerSource === 'exploration' || triggerSource === 'list_click';
        if (shouldAnimate) {
          flyTo(targetCoords as [number, number]);
        }
      }
    }
  }, [forceCenterCount, selectedCoords, selectedEvent, triggerSource, flyTo]);

  //EFFECT 5: ROUTE OVERVIEW: Fit bounds only when route ID changes OR when navigation ends
  useEffect(() => {
    const routeId = currentRoute?.properties?.id || currentRoute?.geometry?.coordinates?.length;

    //We trigger the overview if:
    //1. We are in planning mode but NOT navigating
    //2. AND (the route is new OR we just stopped navigating)
    const justStoppedNavigating = lastIsNavigating.current && !isNavigating;
    const isNewRoute = routeId && routeId !== lastProcessedRouteId.current;

    if (isPlanning && !isNavigating && (isNewRoute || justStoppedNavigating)) {
      const coords = currentRoute?.geometry?.coordinates;
      if (!coords || coords.length < 2) return;

      console.log('[MapContent] 🗺️ Route Overview: Fitting bounds (StopNav or NewRoute)');
      lastProcessedRouteId.current = String(routeId);

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const [x, y] of coords) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }

      if (programmaticMoveTimeoutRef.current) {
        clearTimeout(programmaticMoveTimeoutRef.current);
      }
      setIsProgrammaticMove(true);
      cameraRef.current?.setCamera({
        bounds: {
          ne: [maxX, maxY],
          sw: [minX, minY],
          paddingLeft: ROUTE_OVERVIEW_PADDING.paddingLeft,
          paddingRight: ROUTE_OVERVIEW_PADDING.paddingRight,
          paddingTop: ROUTE_OVERVIEW_PADDING.paddingTop,
          paddingBottom: ROUTE_OVERVIEW_PADDING.paddingBottom,
        },
        pitch: 0, //Reset tilt for route overview
        animationDuration: 1200,
        animationMode: 'flyTo',
      });
      programmaticMoveTimeoutRef.current = setTimeout(() => {
        setIsProgrammaticMove(false);
      }, 1300);
    }

    if (!isPlanning) {
      lastProcessedRouteId.current = null;
    }

    //Keep track of navigation state to detect when it ends
    lastIsNavigating.current = isNavigating;
  }, [isPlanning, isNavigating, currentRoute, setIsProgrammaticMove]);

  //EFFECT 6: MANUAL FOLLOWER FOR ANDROID:
  //Instead of relying on native 'followUserLocation' (which is buggy),
  //we manually move the camera when in a tracking mode.
  useEffect(() => {
    if (Platform.OS !== 'android' || cameraMode === MapCameraMode.FREE || !userCoords) return;

    //We only follow if we are not in a programmatic flyTo
    if (isProgrammaticMove) return;

    //Use moveTo for smooth tracking without altitude changes
    cameraRef.current?.moveTo([userCoords[0], userCoords[1]], 800);
  }, [userCoords, cameraMode, isProgrammaticMove]);

  //--- Logic Extraction ---
  useRoutingLogic();
  const { data: pathNetwork } = usePathNetwork(currentEventId);

  const isPanningRef = useRef(false);
  const panDebounceRef = useRef<NodeJS.Timeout>();
  const lastPanUpdateRef = useRef(0);

  const handleCameraChange = useCallback(
    (e: any, isChanging: boolean = false) => {
      const { geometry, properties } = e;
      const now = Date.now();
      const isUserInteraction = e.properties?.isUserInteraction;

      //Update real-time ref ALWAYS, even during animations
      if (geometry?.coordinates) {
        realtimeCameraRef.current = {
          center: geometry.coordinates,
          zoom: properties?.zoomLevel || realtimeCameraRef.current.zoom,
        };
      }

      if (isChanging) {
        isPanningRef.current = true;
        lastPanUpdateRef.current = now;
        if (panDebounceRef.current) clearTimeout(panDebounceRef.current);
      } else {
        lastPanUpdateRef.current = now;
        if (panDebounceRef.current) clearTimeout(panDebounceRef.current);
        panDebounceRef.current = setTimeout(() => {
          isPanningRef.current = false;
        }, 150);
      }

      //Discrete Zoom Management
      if (properties?.zoomLevel) {
        zoomSharedValue.value = properties.zoomLevel;

        //CRITICAL FIX: Only update discrete zoom when the camera STOPS moving.
        //Changing it during an active gesture causes PointAnnotations to unmount
        //while MapLibre's C++ layout engine is busy, causing hard crashes.
        //On Android, we are even stricter to prevent re-renders during active tracking.
        const isStationary = !isChanging;
        const canUpdateZoom =
          Platform.OS === 'android'
            ? !isChanging && cameraMode === MapCameraMode.FREE
            : isStationary || now - lastZoomUpdateRef.current > 250;

        if (canUpdateZoom) {
          lastZoomUpdateRef.current = now;
          const newDiscreteZoom = Math.floor(properties.zoomLevel * 2) / 2;
          if (newDiscreteZoom !== discreteZoom) {
            setDiscreteZoom(newDiscreteZoom);
          }
        }
      }

      //Update global store for other components ONLY when the camera STOPS moving.
      //This prevents the huge index.tsx from re-rendering 10 times per second during a pan,
      //which is the primary cause of "jerkiness" on Android.
      const center = geometry?.coordinates as [number, number];
      const zoom = properties?.zoomLevel;
      const pitch = properties?.pitch;

      if (center && zoom && !isChanging) {
        setLastCameraPosition({ center, zoom, pitch });
      }

      //IF USER TOUCHES THE MAP:
      //We break tracking ONLY if the user is actually interacting with the map surface.
      //If we are in a programmatic move, physical user interaction aborts it instantly.
      if (isUserInteraction) {
        if (cameraMode !== MapCameraMode.FREE) {
          console.log('[MapContent] 🚨 User interaction detected: Breaking camera locks');
          setCameraMode(MapCameraMode.FREE);
        }
        const currentIsProgrammatic = useMapUIStore.getState().isProgrammaticMove;
        if (currentIsProgrammatic) {
          console.log(
            '[MapContent] 🚨 User interaction detected during active flight: Aborting programmatic lock'
          );
          //Android/Fabric Fix: Abort native active flight animation by overriding with 1ms timing
          cameraRef.current?.setCamera({
            animationDuration: 1,
          });
          setIsProgrammaticMove(false);
          if (programmaticMoveTimeoutRef.current) {
            clearTimeout(programmaticMoveTimeoutRef.current);
            programmaticMoveTimeoutRef.current = undefined;
          }
        }
      }
    },
    [
      discreteZoom,
      setDiscreteZoom,
      zoomSharedValue,
      setLastCameraPosition,
      cameraMode,
      setCameraMode,
      setIsProgrammaticMove,
    ]
  );

  //Combined POIs logic
  const allUIPois = useMemo(() => {
    const eventPois = normalizeEventList(allEvents || []);
    const spatialPois = poisGeoJSON?.features?.map((f: any) => normalizePOI(f)) || [];
    return [...spatialPois, ...eventPois];
  }, [poisGeoJSON, allEvents]);

  //Hierarchical visibility logic for POIs
  const filteredPoisGeoJSON = useMemo(() => {
    const filteredList = getFilteredPOIs(allUIPois, discreteZoom);
    return {
      type: 'FeatureCollection',
      features: Array.from(
        new Map(
          filteredList
            .filter(
              (poi) =>
                poi.category !== 'event' &&
                poi.coordinates &&
                poi.coordinates.length === 2 &&
                typeof poi.coordinates[0] === 'number' &&
                typeof poi.coordinates[1] === 'number' &&
                !isNaN(poi.coordinates[0]) &&
                !isNaN(poi.coordinates[1])
            )
            .map((poi) => [poi.id, poi])
        ).values()
      ).map((poi) => ({
        type: 'Feature',
        id: `poi-f-${poi.id}`,
        geometry: { type: 'Point', coordinates: poi.coordinates },
        properties: {
          id: poi.id,
          name: poi.displayName,
          display_name: poi.displayName,
          icon: poi.categoryIcon,
          icon_name: getNativeIconName(poi.category), //USE CATEGORY (String) INSTEAD OF ICON (Component)
          category: poi.category,
          color: poi.mainColor,
          color_hex: poi.mainColor,
          parentId: poi.parentId,
          rating: poi.rating,
          raw: JSON.stringify(poi),
        },
      })),
    };
  }, [allUIPois, discreteZoom, getFilteredPOIs]);

  const events = useMemo(() => normalizeEventList(allEvents || []), [allEvents]);

  const eventsGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: Array.from(
        new Map(
          events
            .filter(
              (poi) =>
                poi.coordinates &&
                poi.coordinates.length === 2 &&
                typeof poi.coordinates[0] === 'number' &&
                typeof poi.coordinates[1] === 'number' &&
                !isNaN(poi.coordinates[0]) &&
                !isNaN(poi.coordinates[1])
            )
            .map((poi) => [poi.id, poi])
        ).values()
      ).flatMap((poi) => {
        const features = [];

        //1. Add the Point Marker
        features.push({
          type: 'Feature',
          id: `ev-f-${poi.id}`,
          geometry: { type: 'Point', coordinates: poi.coordinates },
          properties: {
            id: poi.id,
            name: poi.displayName,
            display_name: poi.displayName, //PROPERTY FOR NATIVE
            category: poi.category,
            color: poi.mainColor,
            color_hex: poi.mainColor, //PROPERTY FOR NATIVE
            icon_name: 'event', //PROPERTY FOR NATIVE
            imageKey: poi.imageKey,
            imageUrl: poi.images?.[0],
            raw: JSON.stringify(poi.raw), //Store as string so queryRenderedFeatures handles it safely
          },
        });

        //2. Add the Boundary Polygon if it exists
        if (poi.raw?.boundary) {
          features.push({
            type: 'Feature',
            id: `ev-b-${poi.id}`,
            geometry: poi.raw.boundary,
            properties: {
              id: poi.id,
              type: 'boundary',
              color: poi.mainColor,
              name: poi.displayName,
            },
          });
        }

        return features;
      }),
    }),
    [events]
  );

  const triggerForceCenter = useMapUIStore((s) => s.triggerForceCenter);

  const handlePoiPress = useCallback(
    (data: any) => {
      if (isPanningRef.current) return;
      const feature = data.features ? data.features[0] : data;
      if (!feature?.properties) return;

      const { properties, geometry } = feature;

      //Parse raw string if it came from queryRenderedFeatures
      let rawData = properties.raw;
      if (typeof rawData === 'string') {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {}
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCameraMode(MapCameraMode.FREE);
      triggerForceCenter('map_click');

      const isEvent =
        properties.category === 'event' || properties.type === 'event' || !!properties.imageKey;

      if (isEvent) {
        //Handle event selection
        const eventData = rawData || feature;
        if (onSelectEvent) {
          onSelectEvent(eventData);
        } else {
          setSelectedEvent(properties.id);
          setGlobalCurrentEvent(eventData);
          selectPoi(null);
          islandState.value = withSpring(0, theme.motion.physics.snappy);
        }
      } else {
        //Normal POI selection
        setSelectedEvent(null);
        setGlobalCurrentEvent(null);
        selectPoi(normalizePOI(rawData || feature));
      }
    },
    [
      selectPoi,
      setSelectedEvent,
      setGlobalCurrentEvent,
      islandState,
      triggerForceCenter,
      onSelectEvent,
      theme,
    ]
  );

  const handleEventPress = useCallback(
    (poi: any) => {
      if (isPanningRef.current) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCameraMode(MapCameraMode.FREE);
      triggerForceCenter();
      setSelectedEvent(poi.id);
      setGlobalCurrentEvent(poi.raw);
      //selectPoi(poi); // Removed to prevent conflict with Level 3 drawer and camera selection logic
      islandState.value = withSpring(0, theme.motion.physics.snappy); //Use the same spring config as index.tsx
    },
    [setSelectedEvent, setGlobalCurrentEvent, islandState, triggerForceCenter]
  );

  const glPoisGeoJSON = useMemo(() => {
    if (!poisGeoJSON?.features) return poisGeoJSON;

    //Filter out the currently selected POI from the GL layer to avoid duplication with MarkerView
    return {
      ...poisGeoJSON,
      features: poisGeoJSON.features.filter((f: any) => f.properties.id !== selectedPoiId),
    };
  }, [poisGeoJSON, selectedPoiId]);

  const setMapReady = useStartupStore((s) => s.setMapReady);

  //Safety timeout to ensure overlay is hidden even if map event fails
  useEffect(() => {
    //Be more patient on Android with older hardware
    const timeoutDuration = Platform.OS === 'android' ? 12000 : 8000;
    const timer = setTimeout(() => {
      if (!hasInitialRendered.current) {
        console.log('⚠️ [MapContent] Safety timeout triggered: forcing map ready');
        hasInitialRendered.current = true;
        setInitialLoadComplete(true);
        setMapReady(true);
      }
    }, timeoutDuration);
    return () => clearTimeout(timer);
  }, [setInitialLoadComplete, setMapReady]);

  const mapStyle = useMemo(() => {
    return getOptimizedStyle(theme.dark);
  }, [theme.dark]);

  const handleMapPress = useCallback(
    async (e: any) => {
      const now = Date.now();
      const isRecentlyMoved = isPanningRef.current || now - lastPanUpdateRef.current < 150;

      try {
        const { screenPointX, screenPointY } = e.properties;

        if (mapRef.current) {
          const features = await mapRef.current.queryRenderedFeaturesAtPoint(
            [screenPointX, screenPointY],
            null, //filter
            ['eventLabelsBackground', 'eventLabelSelected', 'backgroundPoiDots', 'poiIconsLayer'] //Layer IDs to check
          );

          if (features?.features && features.features.length > 0) {
            //FEATURE TAP: We are more lenient here.
            //If we hit a specific label or pin, we assume it was an intentional click.
            const feature = features.features.find((f: any) => f?.properties?.id);
            if (feature) {
              handlePoiPress(feature);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('[MapContent] Error querying map features:', err);
      }

      //EMPTY MAP TAP: Apply stricter lockout to avoid accidental deselection while panning.
      if (isRecentlyMoved) {
        console.log('[MapContent] Ignored background tap due to recent camera movement.');
        return;
      }

      if (onDeselect) {
        console.log('[MapContent] Map background pressed: Triggering deselect');
        setCameraMode(MapCameraMode.FREE); //KILL THE MAGNET
        onDeselect();
      }
    },
    [onDeselect, handlePoiPress]
  );

  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={[styles.map, uiState === MapUIState.AR_EXPLORE && { opacity: 0, height: 0 }]}
        mapStyle={mapStyle as any}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        minZoomLevel={2}
        maxZoomLevel={22}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        onPress={handleMapPress}
        //Android Optimization: Use TextureView under Fabric to prevent blank screens/stutters
        androidView={Platform.OS === 'android' ? 'texture' : undefined}
        onRegionWillChange={(e) => {
          //ANDROID FIX: Aggressively break tracking if map moves and it's not programmatic.
          //If we detect a definitive user interaction, abort all locks preemptively.
          const isUser = e.properties?.isUserInteraction;
          if (isUser) {
            console.log(
              '[MapContent] 🚨 User interaction detected in onRegionWillChange: Breaking all locks'
            );
            //Android/Fabric Fix: Stop any active native camera flights instantly
            cameraRef.current?.setCamera({
              animationDuration: 1,
            });
            setCameraMode(MapCameraMode.FREE);
            setIsProgrammaticMove(false);
            if (programmaticMoveTimeoutRef.current) {
              clearTimeout(programmaticMoveTimeoutRef.current);
              programmaticMoveTimeoutRef.current = undefined;
            }
          } else {
            //Fallback for Android where isUserInteraction can be unreliable
            const currentIsProgrammatic = useMapUIStore.getState().isProgrammaticMove;
            if (!currentIsProgrammatic) {
              const currentMode = useMapUIStore.getState().cameraMode;
              if (currentMode !== MapCameraMode.FREE) {
                console.log(
                  '[MapContent] 🚨 Manual gesture fallback (onRegionWillChange), breaking camera lock'
                );
                //Android/Fabric Fix: Stop any active native camera flights instantly
                cameraRef.current?.setCamera({
                  animationDuration: 1,
                });
                setCameraMode(MapCameraMode.FREE);
              }
            }
          }
        }}
        onRegionIsChanging={(e) => handleCameraChange(e, true)}
        onRegionDidChange={async (e) => {
          handleCameraChange(e, false);

          if (mapRef.current) {
            const bounds = await mapRef.current.getVisibleBounds();
            useMapUIStore.getState().setVisibleBounds(bounds);
          }
        }}
        onDidFinishLoadingStyle={() => {
          if (!hasInitialRendered.current) {
            hasInitialRendered.current = true;
            setInitialLoadComplete(true);
            setMapReady(true);
            startupMetrics.markInteractive('Map');
          }
        }}
      >
        <MapLibreGL.UserLocation
          visible={true}
          animated={true}
          showsUserHeadingIndicator={Platform.OS === 'ios'}
          androidRenderMode={cameraMode === MapCameraMode.FREE ? 'normal' : 'gps'}
          renderMode="normal"
        />

        <MapImageManager events={events} />

        <MapLibreGL.Camera
          ref={cameraRef}
          {...(Platform.OS === 'ios'
            ? {
                followUserLocation: cameraMode !== MapCameraMode.FREE,
                followUserMode: getFollowMode(),
                defaultSettings: DEFAULT_CAMERA_SETTINGS,
                followPitch: 45,
                animationDuration: 0,
                onUserTrackingModeChange: handleUserTrackingModeChange,
              }
            : {
                //Android: ZERO declarative props — 100% imperative via cameraRef.setCamera()
                followUserLocation: false,
                onUserTrackingModeChange: handleUserTrackingModeChange,
              })}
        />

        <MapLayers
          theme={theme}
          poisGeoJSON={filteredPoisGeoJSON}
          eventsGeoJSON={eventsGeoJSON}
          selectedEventId={selectedEventId}
          selectedPoiId={selectedPoiId}
          pathNetwork={EMPTY_GEOJSON}
          currentRoute={currentRoute}
          uiState={uiState}
          onPoiPress={handlePoiPress}
          zoomLevel={discreteZoom}
          zoomSharedValue={zoomSharedValue}
          islandState={islandState}
          visibleBounds={visibleBounds}
        />
      </MapLibreGL.MapView>
    </View>
  );
};

MapContent.displayName = 'MapContent';

const styles = StyleSheet.create({
  map: { flex: 1 },
});
