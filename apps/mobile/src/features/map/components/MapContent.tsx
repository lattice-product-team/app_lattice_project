import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Hooks & State
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore } from '../store/useMapUIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { normalizePOI, normalizePOIList } from '../../poi/adapters/poiAdapter';
import { useRoutingLogic } from '../../navigation/hooks/useRoutingLogic';
import { usePathNetwork } from '../../navigation/hooks/usePathNetwork';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { useMapStyle } from '../hooks/useMapStyle';
import { EventPin } from './EventPin';
import { POIPin } from './POIPin';

// Constants & Utilities
import { EMPTY_GEOJSON, MAP_CENTER, DEFAULT_ZOOM, MAPTILER_KEY, MAP_STYLES } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';

import { useLocationStore } from '../../../store/useLocationStore';
import { calculateBBox } from '../../../utils/geoUtils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapContentProps {
  poisGeoJSON: any;
  savedLocations?: any;
  onDeselect?: () => void;
  sheetPosition: SharedValue<number>;
  is3DActive?: boolean;
}

export const MapContent = React.memo(function MapContent({
  poisGeoJSON,
  savedLocations,
  onDeselect,
  sheetPosition,
  is3DActive = false,
}: MapContentProps) {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const mapRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const theme = useLatticeTheme();
  const hasInitialRendered = React.useRef(false);
  const setInitialLoadComplete = useMapUIStore((s) => s.setInitialLoadComplete);
  const { style: patchedMapStyle, isLoading: isStyleLoading } = useMapStyle(theme.dark ? MAP_STYLES.dark : MAP_STYLES.light);

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

  // --- Logic Extraction ---
  useRoutingLogic();

  const selectionGeoJSON = useMemo(() => {
    if (!selectedCoords) return EMPTY_GEOJSON;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: selectedCoords },
          properties: { id: selectedPoiId },
        },
      ],
    };
  }, [selectedCoords, selectedPoiId]);

  const { data: pathNetwork } = usePathNetwork(currentEventId);

  useEffect(() => {
    if (recenterCount > 0 && camera.current && userCoords) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: 800,
        animationMode: 'flyTo',
        pitch: is3DActive ? 60 : 0,
        padding: { paddingBottom: 150, paddingTop: 60, paddingLeft: 20, paddingRight: 20 },
      });
    }
  }, [recenterCount, userCoords]);

  useEffect(() => {
    if (selectedCoords && camera.current && !isNavigating) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 17.2,
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
    }
  }, [selectedCoords, isNavigating, insets.top]);

  useEffect(() => {
    if (selectedEvent && poisGeoJSON?.features && camera.current && !isNavigating) {
      // Find all POIs that belong to this event (parentId === eventId)
      const childPoiCoords = poisGeoJSON.features
        .filter((f: any) => f.properties.parentId === selectedEvent.id || f.properties.event_id === selectedEvent.id)
        .map((f: any) => f.geometry.coordinates);

      if (childPoiCoords.length > 0) {
        const bbox = calculateBBox(childPoiCoords);
        if (bbox) {
          camera.current.fitBounds(
            [bbox[2], bbox[3]], // maxLng, maxLat
            [bbox[0], bbox[1]], // minLng, minLat
            [
              SCREEN_HEIGHT * 0.48, // bottom padding for sheet
              60, // top
              40, // left
              40, // right
            ],
            800 // duration
          );
          return;
        }
      }

      // Fallback to center if no children found
      if (selectedEvent.center) {
        camera.current.setCamera({
          centerCoordinate: selectedEvent.center.coordinates,
          zoomLevel: 16.5,
          animationDuration: 1200,
          animationMode: 'flyTo',
          pitch: is3DActive ? 60 : 0,
          padding: {
            paddingBottom: SCREEN_HEIGHT * 0.4,
            paddingTop: insets.top + 60,
            paddingLeft: 40,
            paddingRight: 40,
          },
        });
      }
    }
  }, [selectedEvent, poisGeoJSON, isNavigating, insets.top]);

  useEffect(() => {
    if (camera.current) {
      camera.current.setCamera({
        pitch: is3DActive ? 60 : 0,
        animationDuration: 1000,
        animationMode: 'flyTo',
      });
    }
  }, [is3DActive]);

  const handlePoiPress = useCallback(
    (data: any) => {
      const feature = data.features ? data.features[0] : data;
      if (!feature?.properties) return;

      if (feature.properties.cluster && feature.properties.cluster_id) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        camera.current?.setCamera({
          centerCoordinate: feature.geometry.coordinates,
          zoomLevel: (camera.current as any).getZoom() + 2,
          animationDuration: 400,
        });
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const handleRegionChange = useCallback(async (feature: any) => {
    const { geometry, properties } = feature;
    const center = geometry.coordinates as [number, number];
    const zoom = properties.zoomLevel;
    const pitch = properties.pitch;

    // Guardar posición para persistencia
    setLastCameraPosition({ center, zoom, pitch });

    // Si el movimiento fue manual (isUserInteraction), desactivamos el seguimiento
    if (properties.isUserInteraction && isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser, setIsFollowingUser, setLastCameraPosition]);

  const poisAndSaved = useMemo(() => {
    const pois = poisGeoJSON?.features || [];
    const saved =
      savedLocations?.features?.map((f: any) => ({
        ...f,
        properties: { ...f.properties, id: `saved_${f.properties.id}`, name: f.properties.label },
      })) || [];
    return { type: 'FeatureCollection' as const, features: [...pois, ...saved] };
  }, [poisGeoJSON, savedLocations]);

  // Hierarchical Pin Logic
  const allUIPois = useMemo(() => normalizePOIList(poisGeoJSON?.features || []), [poisGeoJSON]);
  const visiblePois = useMemo(() => getFilteredPOIs(allUIPois), [allUIPois, selectedEventId, userInsideEventId]);
  
  const events = useMemo(() => 
    allUIPois.filter(p => p.category === 'event'), 
  [allUIPois]);

  const handleEventPress = useCallback((event: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event.id);
    setCurrentEvent(event.raw); // Sync with event store
    selectPoi(event);
  }, [setSelectedEvent, setCurrentEvent, selectPoi]);
  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={[styles.map, { backgroundColor: theme.colors.bg.main }]}
        mapStyle={patchedMapStyle || undefined}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        onPress={onDeselect || storeDeselect}
        onRegionDidChange={handleRegionChange}
        onMapIdle={() => {
          const locationStatus = useLocationStore.getState().status;
          const hasCoords = !!useLocationStore.getState().logicalCoords;
          
          if (!hasInitialRendered.current) {
            if (locationStatus !== 'granted' || hasCoords) {
              hasInitialRendered.current = true;
              setInitialLoadComplete(true);
            }
          }
        }}
      >
        <MapLibreGL.UserLocation visible={true} animated={true} showsUserHeadingIndicator={true} />
        <MapLibreGL.Camera
          ref={camera}
          minZoomLevel={11}
          defaultSettings={{ 
            centerCoordinate: userCoords || lastCameraPosition?.center || MAP_CENTER, 
            zoomLevel: lastCameraPosition?.zoom || DEFAULT_ZOOM, 
            pitch: lastCameraPosition?.pitch || 0 
          }}
          followUserLocation={isFollowingUser || isNavigating}
          followUserMode={(isNavigating ? 'compass' : 'normal') as any}
          followZoomLevel={18}
        />
        {/* 0. VENUE BOUNDARY */}
        <MapLibreGL.ShapeSource 
          id="boundarySource" 
          shape={poisGeoJSON || EMPTY_GEOJSON}
        >
          <MapLibreGL.FillLayer
            id="boundaryFill"
            filter={['==', ['get', 'type'], 'boundary']}
            style={{
              fillColor: theme.colors.brand.primary,
              fillOpacity: 0.1,
            }}
          />
          <MapLibreGL.LineLayer
            id="boundaryOutline"
            filter={['==', ['get', 'type'], 'boundary']}
            style={{
              lineColor: theme.colors.brand.primary,
              lineWidth: 2,
              lineDasharray: [2, 1],
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* 1. PATH NETWORK */}
        <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork || EMPTY_GEOJSON}>
          <MapLibreGL.LineLayer
            id="networkLines"
            style={{ 
              ...mapLayerStyles.networkLines, 
              lineOpacity: 0.15,
              lineColor: theme.colors.brand.primary
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* 2. VISUAL POIS */}
        <MapLibreGL.ShapeSource 
          id="poisSource" 
          shape={poisGeoJSON || EMPTY_GEOJSON}
          cluster={true}
          clusterRadius={50}
        >
          <MapLibreGL.CircleLayer
            id="poiCircles"
            style={mapLayerStyles.poiCircles}
            minZoomLevel={12.8}
            filter={['!', ['has', 'point_count']]}
          />
          <MapLibreGL.SymbolLayer
            id="poiIcons"
            style={mapLayerStyles.poiIcons}
            minZoomLevel={12}
            filter={[
              'all',
              ['!', ['has', 'point_count']],
              [
                'any',
                ['==', ['get', 'category'], 'event'], // Always show events
                ['>', ['zoom'], 15], // Show others when zoomed in
                ['==', ['get', 'id'], selectedPoiId || ''], // Always show selected
                ['==', ['get', 'parentId'], currentEventId || ''], // Show children of active event
                ['==', ['get', 'event_id'], currentEventId || ''] // Handle both ID formats
              ]
            ]}
          />
          <MapLibreGL.SymbolLayer
            id="poiLabels"
            style={{
              ...mapLayerStyles.poiLabels,
              textField: ['get', 'name'],
              textColor: theme.colors.text.primary,
              textHaloColor: theme.colors.bg.main,
              textHaloWidth: 1.5,
            }}
            minZoomLevel={16.5}
            filter={[
              'all',
              ['!', ['has', 'point_count']],
              ['!', ['has', 'parentId']] // Hide labels for children in SymbolLayer
            ]}
          />
          
          <MapLibreGL.CircleLayer
            id="clusterCircles"
            style={mapLayerStyles.clusterCircles}
            filter={['has', 'point_count']}
          />
          <MapLibreGL.SymbolLayer
            id="clusterLabels"
            style={mapLayerStyles.clusterLabels}
            filter={['has', 'point_count']}
          />

          {/* Selected POI Highlight */}
          <MapLibreGL.CircleLayer
            id="selectedPoiHighlight"
            filter={['==', ['get', 'id'], selectedPoiId || '']}
            style={{
              circleRadius: 22,
              circleColor: theme.colors.text.primary,
              circleOpacity: 0.2,
              circleStrokeWidth: 2,
              circleStrokeColor: theme.colors.text.primary,
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* --- PREMIUM INTERACTION LAYER (MarkerViews) --- */}
        
        {/* 1. Main Events */}
        {events.map((event) => (
          <EventPin
            key={event.id}
            id={event.id}
            name={event.displayName}
            imageUrl={event.images?.[0]}
            coordinates={event.coordinates}
            isSelected={String(selectedEventId) === String(event.id)}
            onPress={() => handleEventPress(event)}
          />
        ))}

        {/* 2. Sub-POIs (Revealed Hierarchically) */}
        {visiblePois.filter(p => p.category !== 'event').map((poi) => (
          <POIPin
            key={poi.id}
            id={poi.id}
            category={poi.category}
            icon={poi.categoryIcon}
            color={poi.mainColor}
            coordinates={poi.coordinates}
            isSelected={selectedPoiId === poi.id}
            onPress={() => handlePoiPress(poi)}
          />
        ))}

        {/* 3. VISUAL POIS (Handled in previous blocks) */}


        <MapLibreGL.ShapeSource 
          id="savedSource" 
          shape={savedLocations || EMPTY_GEOJSON}
          cluster={true}
          clusterRadius={40}
        >
          <MapLibreGL.CircleLayer
            id="savedCircles"
            style={mapLayerStyles.savedPoiCircles}
            minZoomLevel={12.8}
            filter={['!', ['has', 'point_count']]}
          />
          <MapLibreGL.SymbolLayer
            id="savedLabels"
            style={{
              ...mapLayerStyles.poiLabels,
              textColor: theme.colors.text.primary,
              textHaloColor: theme.colors.bg.main,
            }}
            minZoomLevel={15.8}
            filter={['!', ['has', 'point_count']]}
          />
        </MapLibreGL.ShapeSource>

        {/* 3. ROUTE & SELECTION VISUALS */}
        {!!(isNavigating && currentRoute) && (
          <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute}>
            <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
            <MapLibreGL.LineLayer
              id="routeGlow"
              style={{ ...mapLayerStyles.routeGlow, lineBlur: 4 }}
            />
          </MapLibreGL.ShapeSource>
        )}

        {/* 4. UNIFIED INTERACTION LAYER */}
        <MapLibreGL.ShapeSource
          id="interactionSource"
          shape={poisAndSaved}
          onPress={handlePoiPress}
          hitbox={{ width: 44, height: 44 }}
        >
          <MapLibreGL.CircleLayer
            id="interactionLayer"
            style={{ circleRadius: 24, circleOpacity: 0 }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </View>
  );
});

MapContent.displayName = 'MapContent';

const styles = StyleSheet.create({
  map: { flex: 1 },
});

