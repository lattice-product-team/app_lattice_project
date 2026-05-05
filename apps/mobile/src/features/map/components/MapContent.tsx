import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPRING_CONFIG = {
  damping: 30,
  stiffness: 150,
  mass: 1.0,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

// Hooks & State
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore } from '../store/useMapUIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { normalizePOI, normalizeEventList, normalizePOIList } from '../../poi/adapters/poiAdapter';
import { useRoutingLogic } from '../../navigation/hooks/useRoutingLogic';
import { usePathNetwork } from '../../navigation/hooks/usePathNetwork';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

// Components
import { MapCameraManager, MapCameraHandle } from './MapCameraManager';
import { MapLayers } from './MapLayers';
import { MapInteractionLayer } from './MapInteractionLayer';
import { MapVirtualOverlay } from './MapVirtualOverlay';

// Constants & Utilities
import { useLocationStore } from '../../../store/useLocationStore';
import styleLight from '../../../../assets/map/style-light.json';
import styleDark from '../../../../assets/map/style-dark.json';
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

  const {
    selectPoi,
    setSelectedEvent,
    setCurrentEvent,
    selectedPoiId,
    selectedCoords,
    selectedEventId
  } = usePOIStore();
  const { currentRoute, isNavigating } = useNavigationStore();
  const { recenterCount, forceCenterCount, isFollowingUser, setIsFollowingUser, lastCameraPosition, setLastCameraPosition, setInitialLoadComplete } = useMapUIStore();
  const { currentEventId, selectedEvent, setCurrentEvent: setGlobalCurrentEvent } = useEventStore();

  const userCoords = useLocationStore((s) => s.logicalCoords);
  const initialZoom = 14;
  const [currentZoom, setCurrentZoom] = React.useState(initialZoom);
  const { getFilteredPOIs } = usePOIStore();

  const [mapLayout, setMapLayout] = React.useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
  const cameraCenter = useSharedValue([2.1734, 41.3851]);
  const cameraZoom = useSharedValue(initialZoom);
  const zoomSharedValue = useSharedValue(initialZoom);
  const lastZoomUpdateRef = useRef(0);
  const ZOOM_THROTTLE_MS = 100;

  // --- Logic Extraction ---
  useRoutingLogic();
  const { data: pathNetwork } = usePathNetwork(currentEventId);

  const handleCameraChange = useCallback((e: any) => {
    const { geometry, properties } = e;
    if (geometry?.coordinates) {
      cameraCenter.value = geometry.coordinates;
    }
    if (properties?.zoomLevel) {
      cameraZoom.value = properties.zoomLevel;
      zoomSharedValue.value = properties.zoomLevel;
      if (Math.abs(currentZoom - properties.zoomLevel) > 0.1) {
        setCurrentZoom(properties.zoomLevel);
      }
    }

    // Update global store for other components (throttled)
    const center = geometry?.coordinates as [number, number];
    const zoom = properties?.zoomLevel;
    const pitch = properties?.pitch;
    if (center && zoom) {
      setLastCameraPosition({ center, zoom, pitch });
    }
  }, [currentZoom, setCurrentZoom, cameraCenter, cameraZoom, zoomSharedValue, setLastCameraPosition]);

  const onMapLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setMapLayout({ width, height });
  }, []);

  // Combined POIs logic
  const allUIPois = useMemo(() => {
    const eventPois = normalizeEventList(allEvents || []);
    const venuePois = poisGeoJSON?.features?.map((f: any) => normalizePOI(f)) || [];
    return [...venuePois, ...eventPois];
  }, [poisGeoJSON, allEvents]);

  // Hierarchical visibility logic for POIs
  const filteredPoisGeoJSON = useMemo(() => {
    const filteredList = getFilteredPOIs(allUIPois, currentZoom);
    return {
      type: 'FeatureCollection',
      features: filteredList
        .filter(poi => poi.category !== 'event')
        .map(poi => ({
          type: 'Feature',
          id: poi.id,
          geometry: { type: 'Point', coordinates: poi.coordinates },
          properties: {
            id: poi.id,
            name: poi.displayName,
            icon: poi.categoryIcon,
            category: poi.category,
            color: poi.mainColor,
            parentId: poi.parentId
          }
        }))
    };
  }, [allUIPois, currentZoom, getFilteredPOIs]);

  const events = useMemo(() => normalizeEventList(allEvents || []), [allEvents]);

  const triggerForceCenter = useMapUIStore((s) => s.triggerForceCenter);

  const handlePoiPress = useCallback(
    (data: any) => {
      const feature = data.features ? data.features[0] : data;
      if (!feature?.properties) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      triggerForceCenter();
      
      // Select the POI
      selectPoi(normalizePOI({
        ...feature.properties,
        coordinates: feature.geometry.coordinates,
        raw: feature
      }));
    },
    [selectPoi]
  );

  const handleEventPress = useCallback((poi: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    triggerForceCenter();
    setSelectedEvent(poi.id);
    setCurrentEvent(poi.raw);
    // selectPoi(poi); // Removed to prevent conflict with Level 3 drawer and camera selection logic
    islandState.value = withSpring(0, SPRING_CONFIG); // Use the same spring config as index.tsx
  }, [setSelectedEvent, setCurrentEvent, islandState, triggerForceCenter]);

  const glPoisGeoJSON = useMemo(() => {
    if (!poisGeoJSON?.features) return poisGeoJSON;
    
    // Filter out the currently selected POI from the GL layer to avoid duplication with MarkerView
    return {
      ...poisGeoJSON,
      features: poisGeoJSON.features.filter((f: any) => f.properties.id !== selectedPoiId)
    };
  }, [poisGeoJSON, selectedPoiId]);

  // Safety timeout to ensure overlay is hidden even if map event fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInitialRendered.current) {
        console.log('⚠️ [MapContent] Safety timeout triggered: forcing map ready');
        hasInitialRendered.current = true;
        setInitialLoadComplete(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [setInitialLoadComplete]);

  const mapStyle = useMemo(() => {
    const baseStyle = theme.dark ? styleDark : styleLight;
    
    // Merge sources to keep essential layers while ensuring the main planet source is correct
    return {
      ...baseStyle,
      sources: {
        ...(baseStyle.sources || {}),
        maptiler_planet: {
          type: "vector",
          url: "https://api.maptiler.com/tiles/v3/tiles.json?key=iqk4irD5FCOr6M6VHVWZ"
        }
      }
    };
  }, [theme.dark]);

  return (
    <View style={{ flex: 1 }} onLayout={onMapLayout}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={[styles.map, { backgroundColor: theme.colors.bg.main }]}
        mapStyle={mapStyle as any}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        onPress={onDeselect || storeDeselect}
        onRegionIsChanging={handleCameraChange}
        onCameraChanged={handleCameraChange}
        onDidFinishLoadingStyle={() => {
          if (!hasInitialRendered.current) {
            hasInitialRendered.current = true;
            setInitialLoadComplete(true);
            startupMetrics.markInteractive('Map');
          }
        }}
      >
        <MapLibreGL.UserLocation visible={true} animated={true} showsUserHeadingIndicator={true} />
        
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
        />

        <MapLayers 
          theme={theme}
          poisGeoJSON={filteredPoisGeoJSON}
          pathNetwork={pathNetwork}
          currentRoute={currentRoute}
          isNavigating={isNavigating}
          onPoiPress={handlePoiPress}
        />

        <MapInteractionLayer 
          selectedEventId={selectedEventId}
          selectedPoiId={selectedPoiId}
          onEventPress={handleEventPress}
          onPoiPress={handlePoiPress}
          zoomSharedValue={zoomSharedValue}
        />

      </MapLibreGL.MapView>

      <MapVirtualOverlay
        events={events}
        selectedEventId={selectedEventId}
        onEventPress={handleEventPress}
        cameraCenter={cameraCenter}
        cameraZoom={cameraZoom}
        mapDimensions={mapLayout}
      />
    </View>
  );
};

MapContent.displayName = 'MapContent';

const styles = StyleSheet.create({
  map: { flex: 1 },
});
