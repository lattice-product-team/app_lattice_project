import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Hooks & State
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore, MapCameraMode, MapUIState } from '../store/useMapUIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { normalizePOI, normalizeEventList, normalizePOIList } from '../../poi/adapters/poiAdapter';
import { useRoutingLogic } from '../../navigation/hooks/useRoutingLogic';
import { usePathNetwork } from '../../navigation/hooks/usePathNetwork';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

// Components
import { MapCameraManager, MapCameraHandle } from './MapCameraManager';
import { MapLayers } from './MapLayers';
import { MapImageManager } from './MapImageManager';

// Constants & Utilities
import { useLocationStore } from '../../../store/useLocationStore';
import { useStartupStore } from '../../../store/useStartupStore';
import styleLight from '../../../../assets/map/style-light.json';
import styleDark from '../../../../assets/map/style-dark.json';
import { MAPTILER_KEY, EMPTY_GEOJSON, DEFAULT_ZOOM, MAP_CENTER } from '../../../constants/mapConstants';
import { startupMetrics } from '../../../utils/startupMetrics';

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
  const cameraRef = useRef<MapCameraHandle>(null);
  const mapRef = useRef<any>(null);
  const theme = useLatticeTheme();
  const hasInitialRendered = React.useRef(false);
  const [userHeading, setUserHeading] = React.useState(0);

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
    isProgrammaticMove,
  } = useMapUIStore();
  const { currentEventId, selectedEvent, setCurrentEvent: setGlobalCurrentEvent } = useEventStore();
  const isProgrammaticMoveRef = React.useRef(isProgrammaticMove);
  useEffect(() => {
    isProgrammaticMoveRef.current = isProgrammaticMove;
  }, [isProgrammaticMove]);

  const userCoords = useLocationStore((s) => s.coords);

  const initialZoom = 14;
  const [discreteZoom, setDiscreteZoom] = React.useState(Math.round(initialZoom));
  const { getFilteredPOIs } = usePOIStore();

  const zoomSharedValue = useSharedValue(initialZoom);
  const lastZoomUpdateRef = useRef(0);
  const ZOOM_THROTTLE_MS = 100;

  // --- Logic Extraction ---
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

      // Discrete Zoom Management
      if (properties?.zoomLevel) {
        zoomSharedValue.value = properties.zoomLevel;

        // CRITICAL FIX: Only update discrete zoom when the camera STOPS moving.
        // Changing it during an active gesture causes PointAnnotations to unmount
        // while MapLibre's C++ layout engine is busy, causing hard crashes.
        // On Android, we are even stricter to prevent re-renders during active tracking.
        const isStationary = !isChanging;
        const canUpdateZoom = Platform.OS === 'android'
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

      // Update global store for other components ONLY when the camera STOPS moving.
      // This prevents the huge index.tsx from re-rendering 10 times per second during a pan,
      // which is the primary cause of "jerkiness" on Android.
      const center = geometry?.coordinates as [number, number];
      const zoom = properties?.zoomLevel;
      const pitch = properties?.pitch;

      if (center && zoom && !isChanging) {
        setLastCameraPosition({ center, zoom, pitch });
      }

      // If camera is changing due to user interaction (drag, pinch, etc), stop following
      // On Android, isUserInteraction can be unreliable during fast gestures,
      // so we also check if region is actively changing and we're NOT in a programmatic state.
      // If camera is changing due to user interaction (drag, pinch, etc), stop following.
      // CRITICAL: isUserInteraction should ALWAYS break any lock to prevent "vibrations".
      // On Android, we are even more aggressive: if the region is changing and we're NOT
      // in a programmatic move, we FORCE free mode immediately.
      const shouldSwitchToFree =
        (isUserInteraction || (isChanging && !isProgrammaticMoveRef.current)) &&
        cameraMode !== MapCameraMode.FREE;
      
      if (shouldSwitchToFree) {
        // console.log('[MapContent] Breaking lock -> FREE');
        setCameraMode(MapCameraMode.FREE);
      }
    },
    [
      discreteZoom,
      setDiscreteZoom,
      zoomSharedValue,
      setLastCameraPosition,
      cameraMode,
      setCameraMode,
    ]
  );

  // Combined POIs logic
  const allUIPois = useMemo(() => {
    const eventPois = normalizeEventList(allEvents || []);
    const spatialPois = poisGeoJSON?.features?.map((f: any) => normalizePOI(f)) || [];
    return [...spatialPois, ...eventPois];
  }, [poisGeoJSON, allEvents]);

  // Hierarchical visibility logic for POIs
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
          icon: poi.categoryIcon,
          category: poi.category,
          color: poi.mainColor,
          parentId: poi.parentId,
          rating: poi.rating,
          raw: JSON.stringify(poi), // Store as string
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

        // 1. Add the Point Marker
        features.push({
          type: 'Feature',
          id: `ev-f-${poi.id}`,
          geometry: { type: 'Point', coordinates: poi.coordinates },
          properties: {
            id: poi.id,
            name: poi.displayName,
            category: poi.category,
            color: poi.mainColor,
            imageKey: poi.imageKey,
            imageUrl: poi.images?.[0],
            raw: JSON.stringify(poi.raw), // Store as string so queryRenderedFeatures handles it safely
          },
        });

        // 2. Add the Boundary Polygon if it exists
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

      // Parse raw string if it came from queryRenderedFeatures
      let rawData = properties.raw;
      if (typeof rawData === 'string') {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {}
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCameraMode(MapCameraMode.FREE);
      triggerForceCenter();

      const isEvent =
        properties.category === 'event' || properties.type === 'event' || !!properties.imageKey;

      if (isEvent) {
        // Handle event selection
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
        // Normal POI selection
        setSelectedEvent(null);
        setGlobalCurrentEvent(null);
        selectPoi(normalizePOI(feature));
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
      // selectPoi(poi); // Removed to prevent conflict with Level 3 drawer and camera selection logic
      islandState.value = withSpring(0, theme.motion.physics.snappy); // Use the same spring config as index.tsx
    },
    [setSelectedEvent, setGlobalCurrentEvent, islandState, triggerForceCenter]
  );

  const glPoisGeoJSON = useMemo(() => {
    if (!poisGeoJSON?.features) return poisGeoJSON;

    // Filter out the currently selected POI from the GL layer to avoid duplication with MarkerView
    return {
      ...poisGeoJSON,
      features: poisGeoJSON.features.filter((f: any) => f.properties.id !== selectedPoiId),
    };
  }, [poisGeoJSON, selectedPoiId]);

  const setMapReady = useStartupStore((s) => s.setMapReady);

  // Safety timeout to ensure overlay is hidden even if map event fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInitialRendered.current) {
        console.log('⚠️ [MapContent] Safety timeout triggered: forcing map ready');
        hasInitialRendered.current = true;
        setInitialLoadComplete(true);
        setMapReady(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [setInitialLoadComplete, setMapReady]);

  const mapStyle = useMemo(() => {
    const baseStyle = theme.dark ? styleDark : styleLight;

    // Filter out native POI layers to ensure ONLY our custom POIMarkers are visible
    // This prevents the 'ghost icons' in white/blue that MapLibre shows by default
    const filteredLayers = (baseStyle.layers || []).map((layer: any) => {
      // Robust approach: Hide most symbol/label layers except essential geographical names
      const isSymbolLayer = layer.type === 'symbol';
      const isEssentialLabel =
        layer.id.includes('place_label') ||
        layer.id.includes('road_label') ||
        layer.id.includes('water_label') ||
        layer.id.includes('country_label');

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
            null, // filter
            ['eventLabels', 'backgroundPoiDots', 'poiLabelLayer'] // Layer IDs to check
          );

          if (features?.features && features.features.length > 0) {
            // FEATURE TAP: We are more lenient here.
            // If we hit a specific label or pin, we assume it was an intentional click.
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

      // EMPTY MAP TAP: Apply stricter lockout to avoid accidental deselection while panning.
      if (isRecentlyMoved) {
        console.log('[MapContent] Ignored background tap due to recent camera movement.');
        return;
      }

      if (onDeselect) onDeselect();
    },
    [onDeselect, handlePoiPress]
  );

  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={[
          styles.map,
          uiState === MapUIState.AR_EXPLORE && { opacity: 0, height: 0 }
        ]}
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
        onRegionIsChanging={(e) => handleCameraChange(e, true)}
        onRegionDidChange={(e) => handleCameraChange(e, false)}
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
          showsUserHeadingIndicator={true}
          androidRenderMode="compass"
          renderMode="native"
        />

        <MapImageManager events={events} />

        <MapCameraManager
          ref={cameraRef}
          userCoords={userCoords}
          selectedCoords={selectedCoords}
          selectedEvent={selectedEvent}
          poisGeoJSON={poisGeoJSON}
          is3DActive={is3DActive}
          recenterCount={recenterCount}
          forceCenterCount={forceCenterCount}
          lastCameraPosition={lastCameraPosition}
          uiState={uiState}
          isNavigating={isNavigating}
          isPlanning={isPlanning}
          cameraMode={cameraMode}
          currentRoute={currentRoute}
          transportMode={transportMode}
          isFetching={isFetching}
          selectedPoiId={selectedPoiId}
          selectedEventId={selectedEventId}
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
        />
      </MapLibreGL.MapView>
    </View>
  );
};

MapContent.displayName = 'MapContent';

const styles = StyleSheet.create({
  map: { flex: 1 },
});
