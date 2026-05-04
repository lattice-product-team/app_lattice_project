import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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

// Local Assets
import styleLight from '../../../../assets/map/style-light.json';
import styleDark from '../../../../assets/map/style-dark.json';

// Constants & Utilities
import { MAP_STYLES } from '../../../constants/mapConstants';
import { useLocationStore } from '../../../store/useLocationStore';

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
  const setInitialLoadComplete = useMapUIStore((s) => s.setInitialLoadComplete);

  const { 
    selectedPoiId, 
    selectedCoords, 
    selectPoi, 
    deselect: storeDeselect,
    selectedEventId,
    userInsideEventId,
    getFilteredPOIs,
    setSelectedEvent
  } = usePOIStore();
  const { currentRoute, isNavigating } = useNavigationStore();
  const { recenterCount, isFollowingUser, setIsFollowingUser, lastCameraPosition, setLastCameraPosition } = useMapUIStore();
  const { currentEventId, selectedEvent, setCurrentEvent } = useEventStore();

  const userCoords = useLocationStore((s) => s.logicalCoords);
  const [currentZoom, setCurrentZoom] = React.useState(14);
  const zoomSharedValue = useSharedValue(14);
  const lastZoomUpdateRef = useRef(0);
  const ZOOM_THROTTLE_MS = 100;

  // --- Logic Extraction ---
  useRoutingLogic();
  const { data: pathNetwork } = usePathNetwork(currentEventId);

  const handleRegionChange = useCallback(async (feature: any) => {
    const { geometry, properties } = feature;
    const center = geometry.coordinates as [number, number];
    const zoom = properties.zoomLevel;
    const pitch = properties.pitch;

    setCurrentZoom(zoom);
    setLastCameraPosition({ center, zoom, pitch });

    if (properties.isUserInteraction && isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser, setIsFollowingUser, setLastCameraPosition]);

  const handleRegionIsChanging = useCallback((feature: any) => {
    const zoom = feature.properties.zoomLevel;
    if (zoom) {
      zoomSharedValue.value = zoom;
      const now = Date.now();
      if (now - lastZoomUpdateRef.current > ZOOM_THROTTLE_MS) {
        setCurrentZoom(zoom);
        lastZoomUpdateRef.current = now;
      }
    }
  }, []);

  // Hierarchical Pin Logic using new Adapter
  const allUIPois = useMemo(() => {
    const venuePois = normalizePOIList(poisGeoJSON?.features || []);
    const eventPois = normalizeEventList(allEvents || []);
    
    // Filter out venue pois that overlap with event IDs
    const eventIds = new Set(eventPois.map(e => e.id));
    const uniqueVenuePois = venuePois.filter(p => !eventIds.has(p.id));

    return [...uniqueVenuePois, ...eventPois];
  }, [poisGeoJSON, allEvents]);

  const visiblePois = useMemo(() => {
    return getFilteredPOIs(allUIPois, currentZoom);
  }, [allUIPois, selectedEventId, userInsideEventId, currentZoom]);
  
  const events = useMemo(() => 
    allUIPois.filter(p => p.category === 'event'), 
  [allUIPois]);

  const handlePoiPress = useCallback(
    (data: any) => {
      const feature = data.features ? data.features[0] : data;
      if (!feature?.properties) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // If it's a normalized UI POI (from Interaction Layer)
      if (feature.id && !feature.properties.id) {
         selectPoi(feature);
         return;
      }

      // If it's a raw Feature (from GL Layer)
      selectPoi(normalizePOI({
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          id: feature.properties.id,
          name: feature.properties.name,
          category: feature.properties.category,
          ...feature.properties
        }
      } as any));
    },
    [selectPoi]
  );

  const handleEventPress = useCallback((poi: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(poi.id);
    setCurrentEvent(poi.raw);
    selectPoi(poi);
    islandState.value = 0; // Simplified for now
  }, [setSelectedEvent, setCurrentEvent, selectPoi, islandState]);

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
    }, 5000);
    return () => clearTimeout(timer);
  }, [setInitialLoadComplete]);

  const mapStyle = useMemo(() => {
    const baseStyle = theme.dark ? styleDark : styleLight;
    
    // Deep copy and fix sources to ensure no invalid vector sources exist
    const cleanStyle = {
      ...baseStyle,
      sources: {
        maptiler_planet: {
          type: "vector",
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=iqk4irD5FCOr6M6VHVWZ`
        }
      }
    };

    // Ensure all layers use the working source
    if (cleanStyle.layers) {
      cleanStyle.layers = (cleanStyle.layers as any[]).map(layer => {
        if (layer.source && layer.source !== 'maptiler_planet') {
          return { ...layer, layout: { ...layer.layout, visibility: 'none' } };
        }
        return layer;
      });
    }

    return cleanStyle;
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
        onPress={onDeselect || storeDeselect}
        onRegionIsChanging={handleRegionIsChanging}
        onRegionDidChange={handleRegionChange}
        onMapIdle={() => {
          if (!hasInitialRendered.current) {
            hasInitialRendered.current = true;
            setInitialLoadComplete(true);
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
          lastCameraPosition={lastCameraPosition}
          isNavigating={isNavigating}
        />

        <MapLayers 
          theme={theme}
          poisGeoJSON={glPoisGeoJSON}
          pathNetwork={pathNetwork}
          currentRoute={currentRoute}
          isNavigating={isNavigating}
          onPoiPress={handlePoiPress}
        />

        <MapInteractionLayer 
          events={events}
          visiblePois={visiblePois}
          selectedEventId={selectedEventId}
          selectedPoiId={selectedPoiId}
          onEventPress={handleEventPress}
          onPoiPress={handlePoiPress}
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
