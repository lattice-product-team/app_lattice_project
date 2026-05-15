import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Hooks & State
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore, MapCameraMode } from '../store/useMapUIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { normalizePOI, normalizeEventList, normalizePOIList } from '../../poi/adapters/poiAdapter';
import { useRoutingLogic } from '../../navigation/hooks/useRoutingLogic';
import { usePathNetwork } from '../../navigation/hooks/usePathNetwork';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

// Components
import { MapCameraManager, MapCameraHandle } from './MapCameraManager';
import { MapLayers } from './MapLayers';

// Constants & Utilities
import { useLocationStore } from '../../../store/useLocationStore';
import { useStartupStore } from '../../../store/useStartupStore';
import styleLight from '../../../../assets/map/style-light.json';
import styleDark from '../../../../assets/map/style-dark.json';
import { MAPTILER_KEY } from '../../../constants/mapConstants';
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

  const { selectPoi, setSelectedEvent, selectedPoiId, selectedCoords, selectedEventId } =
    usePOIStore();
  const { currentRoute, isNavigating, isPlanning, transportMode, isFetching } =
    useNavigationStore();
  const {
    recenterCount,
    forceCenterCount,
    cameraMode,
    setCameraMode,
    lastCameraPosition,
    setLastCameraPosition,
    setInitialLoadComplete,
  } = useMapUIStore();
  const { currentEventId, selectedEvent, setCurrentEvent: setGlobalCurrentEvent } = useEventStore();

  const userCoords = useLocationStore((s) => s.logicalCoords);
  const initialZoom = 14;
  const initialZoom = 14;
  const [discreteZoom, setDiscreteZoom] = React.useState(Math.round(initialZoom));
  const { getFilteredPOIs } = usePOIStore();

  const zoomSharedValue = useSharedValue(initialZoom);
  const lastZoomUpdateRef = useRef(0);
  const ZOOM_THROTTLE_MS = 100;

  // --- Logic Extraction ---
  useRoutingLogic();
  const { data: pathNetwork } = usePathNetwork(currentEventId);

  const handleCameraChange = useCallback(
    (e: any, isChanging: boolean = false) => {
      const { geometry, properties } = e;
      const now = Date.now();
      const isUserInteraction = e.properties?.isUserInteraction;

      if (properties?.zoomLevel) {
        // Shared value is cheap (running on UI thread via Reanimated), update it every frame
        zoomSharedValue.value = properties.zoomLevel;

        // CRITICAL FIX: Only update discrete zoom when the camera STOPS moving.
        // Changing it during an active gesture causes PointAnnotations to unmount
        // while MapLibre's C++ layout engine is busy, causing hard crashes.
        if (!isChanging) {
          const newDiscreteZoom = Math.floor(properties.zoomLevel * 2) / 2; // 0.5 increments
          if (newDiscreteZoom !== discreteZoom) {
            setDiscreteZoom(newDiscreteZoom);
          }
        }

        // Throttled updates for global state and discrete changes
        if (now - lastZoomUpdateRef.current > ZOOM_THROTTLE_MS) {
          lastZoomUpdateRef.current = now;
          
          const newDiscreteZoom = Math.floor(properties.zoomLevel * 2) / 2; // 0.5 increments
          if (newDiscreteZoom !== discreteZoom && !isChanging) {
            setDiscreteZoom(newDiscreteZoom);
          }
        }
      }

      // Update global store for other components (throttled)
      const center = geometry?.coordinates as [number, number];
      const zoom = properties?.zoomLevel;
      const pitch = properties?.pitch;

      if (center && zoom && now - lastZoomUpdateRef.current > ZOOM_THROTTLE_MS) {
        setLastCameraPosition({ center, zoom, pitch });
        lastZoomUpdateRef.current = now;
      }

      // If camera is changing due to user interaction, stop following/navigation automatic tracking
      if (isUserInteraction && cameraMode !== MapCameraMode.FREE) {
        setCameraMode(MapCameraMode.FREE);
      }
    },
    [
    ],
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
            raw: poi.raw,
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
      const feature = data.features ? data.features[0] : data;
      if (!feature?.properties) return;

      const { properties, geometry } = feature;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCameraMode(MapCameraMode.FREE);
      triggerForceCenter();

      const isEvent =
        properties.category === 'event' || properties.type === 'event' || !!properties.imageKey;

      if (isEvent) {
        // Handle event selection
        const eventData = properties.raw || feature;
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
      const isNativePOI =
        layer.id.includes('poi') ||
        layer.id.includes('place') ||
        layer.id.includes('label') ||
        layer.id.includes('transit') ||
        layer.id.includes('transport') ||
        layer.id.includes('station') ||
        layer.id.includes('rail') ||
        layer.id.includes('building-number') ||
        layer.id.includes('infrastructure');

      if (isNativePOI) {
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

  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={[styles.map, { backgroundColor: theme.colors.bg.main }]}
        mapStyle={mapStyle as any}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        minZoomLevel={2}
        maxZoomLevel={22}
        onPress={onDeselect}
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
          androidRenderMode="gps"
        />

        {/* <MapImageManager events={events} /> */}

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
          isNavigating={isNavigating}
          isPlanning={isPlanning}
          cameraMode={cameraMode}
          currentRoute={currentRoute}
          transportMode={transportMode}
          isFetching={isFetching}
        />

        <MapLayers
          theme={theme}
          allPoisGeoJSON={poisGeoJSON}
          poisGeoJSON={filteredPoisGeoJSON}
          eventsGeoJSON={eventsGeoJSON}
          selectedEventId={selectedEventId}
          selectedPoiId={selectedPoiId}
          pathNetwork={pathNetwork}
          currentRoute={currentRoute}
          isNavigating={isNavigating}
          isPlanning={isPlanning}
          onPoiPress={handlePoiPress}
          zoomLevel={discreteZoom}
          zoomSharedValue={zoomSharedValue}
        />
      </MapLibreGL.MapView>
    </View>
  );
};

MapContent.displayName = 'MapContent';

const styles = StyleSheet.create({
  map: { flex: 1 },
});
