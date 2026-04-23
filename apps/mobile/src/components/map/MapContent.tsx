import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Hooks & State
import { useMapStore } from '../../store/useMapStore';
import { useRoutingLogic } from '../../hooks/useRoutingLogic';
import { usePathNetwork } from '../../hooks/queries/usePathNetwork';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

// Constants & Utilities
import { EMPTY_GEOJSON, MAP_CENTER, DEFAULT_ZOOM } from '../../constants/mapConstants';
import { mapLayerStyles } from '../../styles/mapLayerStyles';
import { primitives } from '../../styles/colors';

import { useLocationStore } from '../../store/useLocationStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAP_STYLES = {
  light: "https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
} as const;

interface MapContentProps {
  poisGeoJSON: any;
  savedLocations?: any;
  onDeselect?: () => void;
  sheetPosition: SharedValue<number>;
}

export const MapContent = React.memo(function MapContent({
  poisGeoJSON,
  savedLocations,
  onDeselect,
}: MapContentProps) {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const insets = useSafeAreaInsets();
  const theme = useLatticeTheme();

  const selectedPoiId = useMapStore((s) => s.selectedPoiId);
  const selectedCoords = useMapStore((s) => s.selectedCoords);
  const recenterCount = useMapStore((s) => s.recenterCount);
  const currentRoute = useMapStore((s) => s.currentRoute);
  const isNavigating = useMapStore((s) => s.isNavigating);
  const selectPoi = useMapStore((s) => s.selectPoi);
  const storeDeselect = useMapStore((s) => s.deselect);

  const userCoords = useLocationStore((s) => s.logicalCoords);

  // --- Logic Extraction ---
  useRoutingLogic();

  const { data: pathNetwork } = usePathNetwork();

  useEffect(() => {
    if (recenterCount > 0 && camera.current && userCoords) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: 800,
        animationMode: 'flyTo',
        pitch: 0,
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
        pitch: 0,
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
    if (!isNavigating && camera.current) {
      camera.current.setCamera({
        pitch: 0,
        animationDuration: 600,
      });
    }
  }, [isNavigating]);

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
      selectPoi({
        id: feature.properties.id,
        name: feature.properties.name,
        category: feature.properties.category,
        geometry: feature.geometry,
      });
    },
    [selectPoi]
  );

  const poisAndSaved = useMemo(() => {
    const pois = poisGeoJSON?.features || [];
    const saved =
      savedLocations?.features?.map((f: any) => ({
        ...f,
        properties: { ...f.properties, id: `saved_${f.properties.id}`, name: f.properties.label },
      })) || [];
    return { type: 'FeatureCollection', features: [...pois, ...saved] };
  }, [poisGeoJSON, savedLocations]);

  return (
    <View className="flex-1">
      <MapLibreGL.MapView
        style={[styles.map, { backgroundColor: theme.colors.bg.main }]}
        mapStyle={theme.dark ? MAP_STYLES.dark : MAP_STYLES.light}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        onPress={onDeselect || storeDeselect}
      >
        <MapLibreGL.UserLocation visible={true} animated={true} showsUserHeadingIndicator={true} />
        <MapLibreGL.Camera
          ref={camera}
          minZoomLevel={11}
          defaultSettings={{ centerCoordinate: MAP_CENTER, zoomLevel: DEFAULT_ZOOM }}
          followUserLocation={isNavigating}
          followUserMode={isNavigating ? 'compass' : 'normal'}
          followZoomLevel={18}
          followPitch={45}
        />

        {/* 1. PATH NETWORK */}
        <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork || EMPTY_GEOJSON}>
          <MapLibreGL.LineLayer
            id="networkLines"
            style={{ 
              ...mapLayerStyles.networkLines, 
              lineOpacity: 0.15,
              lineColor: theme.dark ? primitives.solar[400] : primitives.midnight.base 
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* 2. VISUAL POIS */}
        <MapLibreGL.ShapeSource 
          id="poisSource" 
          shape={poisGeoJSON || EMPTY_GEOJSON}
          cluster={true}
          clusterRadius={50}
          clusterMaxZoom={14}
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
            minZoomLevel={14}
            filter={['!', ['has', 'point_count']]}
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
            minZoomLevel={15.8}
            filter={['!', ['has', 'point_count']]}
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
        {isNavigating && currentRoute && (
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

