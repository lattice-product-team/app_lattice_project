import React, { useMemo, useState } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { SharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { POIMarker } from './POIMarker';
import { MapUIState } from '../store/useMapUIStore';

interface MapLayersProps {
  theme: any;
  poisGeoJSON: any;
  eventsGeoJSON?: any;
  selectedEventId?: string | number | null;
  selectedPoiId?: string | number | null;
  pathNetwork: any;
  currentRoute: any;
  uiState: MapUIState;
  onPoiPress: (data: any) => void;
  zoomLevel: number;
  zoomSharedValue: SharedValue<number>;
  islandState: SharedValue<number>;
  visibleBounds: number[][] | null;
}

/**
 * Sub-component for Route to isolate re-renders.
 */
const RouteLayer = React.memo(({ 
  uiState, 
  currentRoute, 
  isDrawerOpen 
}: { 
  uiState: MapUIState, 
  currentRoute: any, 
  isDrawerOpen: boolean 
}) => {
  const routeGeoJSON = useMemo(() => {
    if (!currentRoute) return EMPTY_GEOJSON;
    if (currentRoute.type === 'FeatureCollection') return currentRoute;
    return { type: 'FeatureCollection', features: [currentRoute] };
  }, [currentRoute]);

  const isVisible = (uiState === MapUIState.NAVIGATING || uiState === MapUIState.PLANNING) && 
                    !!currentRoute;

  if (!isVisible) return null;

  return (
    <MapLibreGL.ShapeSource id="routeSource" shape={routeGeoJSON} tolerance={0.1}>
      <MapLibreGL.LineLayer
        id="routeGlow"
        style={{ ...mapLayerStyles.routeGlow, lineBlur: 6, lineOpacity: 0.3 }}
      />
      <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
    </MapLibreGL.ShapeSource>
  );
});

/**
 * Sub-component for the Selected Feature (POI or Event)
 * This is the ONLY React Native PointAnnotation rendered on the map,
 * allowing for complex animations without killing performance.
 */
const SelectedMarker = React.memo(({ 
  poisGeoJSON,
  eventsGeoJSON,
  selectedPoiId,
  selectedEventId,
  onPoiPress,
  theme,
  zoomSharedValue,
}: { 
  poisGeoJSON: any,
  eventsGeoJSON: any,
  selectedPoiId: any,
  selectedEventId: any,
  onPoiPress: any,
  theme: any,
  zoomSharedValue: any,
}) => {
  const selectedFeature = useMemo(() => {
    if (selectedPoiId) {
      return poisGeoJSON?.features?.find((f: any) => String(f.properties?.id) === String(selectedPoiId));
    }
    if (selectedEventId) {
      return eventsGeoJSON?.features?.find((f: any) => String(f.properties?.id) === String(selectedEventId));
    }
    return null;
  }, [selectedPoiId, selectedEventId, poisGeoJSON, eventsGeoJSON]);

  if (!selectedFeature) return null;

  return (
    <MapLibreGL.PointAnnotation
      key={`selected-${selectedPoiId || selectedEventId}`}
      id="selected-annotation"
      coordinate={selectedFeature.geometry.coordinates}
      style={{ zIndex: 1000 }}
    >
      <View 
        style={[
          mapPinStyles.markerWrapper, 
          { backgroundColor: 'transparent' }
        ]}
        collapsable={false}
      >
        <POIMarker
          poi={selectedFeature}
          theme={theme}
          isSelected={true}
          onPress={onPoiPress}
          zoomSharedValue={zoomSharedValue}
        />
      </View>
    </MapLibreGL.PointAnnotation>
  );
});

export const MapLayers = React.memo(({
  theme,
  poisGeoJSON,
  eventsGeoJSON,
  selectedEventId,
  selectedPoiId,
  currentRoute,
  uiState,
  onPoiPress,
  zoomLevel,
  zoomSharedValue,
  islandState,
  visibleBounds,
}: MapLayersProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // High-performance drawer state sync
  useAnimatedReaction(
    () => {
      'worklet';
      return islandState ? islandState.value > 0.1 : false;
    },
    (isOpen: boolean) => {
      if (isOpen !== isDrawerOpen) {
        runOnJS(setIsDrawerOpen)(isOpen);
      }
    },
    [isDrawerOpen, islandState]
  );

  const eventMarkers = useMemo(() => {
    const markers: any[] = [];
    eventsGeoJSON?.features?.forEach((f: any) => {
      if (f.geometry.type === 'Point') markers.push(f);
    });
    return { type: 'FeatureCollection', features: markers };
  }, [eventsGeoJSON]);

  const selectedFeature = useMemo(() => {
    if (selectedPoiId) {
      return poisGeoJSON?.features?.find((f: any) => String(f.properties?.id) === String(selectedPoiId));
    }
    if (selectedEventId) {
      return eventMarkers.features.find((f: any) => String(f.properties?.id) === String(selectedEventId));
    }
    return null;
  }, [selectedPoiId, selectedEventId, poisGeoJSON, eventMarkers]);

  const backgroundPois = useMemo(() => ({
    type: 'FeatureCollection',
    features: poisGeoJSON?.features || []
  }), [poisGeoJSON]);

  const labelGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      ...(selectedFeature ? [selectedFeature] : []),
    ]
  }), [selectedFeature]);

  const handleShapePress = (e: any) => {
    const feature = e.features[0];
    if (!feature) return;

    // 1. CLUSTER TAP: Zoom in until it breaks
    if (feature.properties?.point_count) {
      console.log(`[MapLayers] Cluster pressed: ${feature.properties.point_count} points`);
      // We can't easily get the cluster expansion zoom here without complex logic,
      // so we just jump +2 levels which is usually enough to break most clusters.
      return; 
    }

    // 2. INDIVIDUAL POINT TAP: Standard selection
    onPoiPress(feature);
  };

  const backgroundEvents = useMemo(() => {
    const features = eventMarkers.features.filter(f => String(f.properties?.id) !== String(selectedEventId));
    return { type: 'FeatureCollection', features };
  }, [eventMarkers, selectedEventId]);

  const selectedEventFeature = useMemo(() => {
    const feature = eventMarkers.features.find(f => String(f.properties?.id) === String(selectedEventId));
    return feature ? { type: 'FeatureCollection', features: [feature] } : EMPTY_GEOJSON;
  }, [eventMarkers, selectedEventId]);

  return (
    <>
      {/* 1. Background Sources */}
      <MapLibreGL.ShapeSource 
        id="poiSource" 
        shape={backgroundPois}
        onPress={handleShapePress}
        cluster={true}
        clusterRadius={50}
        clusterMaxZoomLevel={13} // Soltamos antes para evitar "puntos amarillos" dentro del recinto
      >
        {/* Cluster Representation */}
        <MapLibreGL.CircleLayer
          id="poiClusters"
          filter={['has', 'point_count']}
          style={{
            circleColor: theme.colors.brand.primary,
            circleRadius: [
              'step',
              ['get', 'point_count'],
              20,
              10, 25,
              50, 30
            ],
            circleOpacity: 0.8,
            circleStrokeWidth: 2,
            circleStrokeColor: '#FFFFFF',
          }}
        />

        <MapLibreGL.SymbolLayer
          id="poiClusterCount"
          filter={['has', 'point_count']}
          style={{
            textField: '{point_count}',
            textSize: 12,
            textColor: '#FFFFFF',
          }}
        />

        <MapLibreGL.CircleLayer
          id="backgroundPoiDots"
          filter={['all', ['!', ['has', 'point_count']], ['!=', ['to-string', ['get', 'id']], String(selectedPoiId || '')]]}
          minZoomLevel={10}
          style={{
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 2,
              14, 4,
              16, 0 
            ],
            // Fallback to brand primary if color_hex is missing
            circleColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary],
            circleStrokeWidth: 1,
            circleStrokeColor: '#FFFFFF',
            circleOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 0,
              13, 1,
              15.5, 1,
              16, 0
            ],
          }}
        />
        <MapLibreGL.SymbolLayer
          id="poiIconsLayer"
          filter={['all', ['!', ['has', 'point_count']], ['!=', ['to-string', ['get', 'id']], String(selectedPoiId || '')]]}
          minZoomLevel={14.5} // Aparecen un poco antes
          style={{
            iconImage: ['get', 'icon_name'],
            iconColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary],
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14.5, 0.5,
              16, 0.8,
              18, 1.1
            ],
            iconAllowOverlap: true,
            // Texto con halo
            textField: ['get', 'display_name'],
            textSize: 11,
            textColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textAnchor: 'top',
            textOffset: [0, 1.1],
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              16, 0,
              17, 1
            ],
          }}
        />
      </MapLibreGL.ShapeSource>

      <MapLibreGL.ShapeSource 
        id="eventsBackgroundSource" 
        shape={backgroundEvents as any}
        hitbox={{ width: 44, height: 44 }}
        onPress={handleShapePress}
      >
        {/* ONLY TEXT FOR EVENTS - No icons, no circles */}
        <MapLibreGL.SymbolLayer
          id="eventLabelsBackground"
          filter={['!=', ['to-string', ['get', 'id']], String(selectedEventId || '')]}
          style={{
            textField: ['get', 'display_name'],
            textSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 12,
              14, 16
            ],
            textColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2.5,
            textAnchor: 'center',
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              9, 0,
              10, 1,
              16, 1,
              17, 0 // Hide when very close to show POIs
            ],
            textTransform: 'uppercase',
            textLetterSpacing: 0.1,
          }}
        />
      </MapLibreGL.ShapeSource>

      <MapLibreGL.ShapeSource 
        id="eventsSelectedSource" 
        shape={selectedEventFeature as any}
        onPress={handleShapePress}
      >
        <MapLibreGL.SymbolLayer
          id="eventLabelSelected"
          style={{
            textField: ['get', 'display_name'],
            textSize: 18,
            textColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 3,
            textAnchor: 'center',
            textOpacity: 1,
            textTransform: 'uppercase',
            textLetterSpacing: 0.2,
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 2. HYBRID SELECTION - Single React Component for the focus */}
      <SelectedMarker 
        poisGeoJSON={poisGeoJSON}
        eventsGeoJSON={eventsGeoJSON}
        selectedPoiId={selectedPoiId}
        selectedEventId={selectedEventId}
        onPoiPress={onPoiPress}
        theme={theme}
        zoomSharedValue={zoomSharedValue}
      />

      {/* 3. ROUTE - Isolated from POI re-renders */}
      <RouteLayer 
        uiState={uiState}
        currentRoute={currentRoute}
        isDrawerOpen={isDrawerOpen}
      />
    </>
  );
});

MapLayers.displayName = 'MapLayers';
