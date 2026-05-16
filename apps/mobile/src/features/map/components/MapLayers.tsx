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
 * Sub-component for POI Markers to isolate re-renders.
 */
const POIMarkers = React.memo(({ 
  features, 
  selectedPoiId, 
  onPoiPress, 
  theme, 
  zoomSharedValue 
}: { 
  features: any[], 
  selectedPoiId: any, 
  onPoiPress: any, 
  theme: any, 
  zoomSharedValue: any 
}) => {
  // Only render the SELECTED poi as a PointAnnotation for high-fidelity interaction.
  // The rest are handled by the ShapeSource/SymbolLayer for performance.
  const selectedFeature = useMemo(() => 
    features.find(f => String(f.properties?.id) === String(selectedPoiId)),
    [features, selectedPoiId]
  );

  if (!selectedFeature) return null;

  return (
    <MapLibreGL.PointAnnotation
      key={`poi-selected-${selectedPoiId}`}
      id={`ann-selected-${selectedPoiId}`}
      coordinate={selectedFeature.geometry.coordinates}
      onSelected={() => onPoiPress(selectedFeature)}
      style={{ zIndex: 100 }}
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
      ...(zoomLevel >= 14 ? backgroundPois.features : [])
    ]
  }), [selectedFeature, backgroundPois, zoomLevel]);

  const handleShapePress = (e: any) => {
    if (e.features && e.features.length > 0) {
      onPoiPress(e.features[0]);
    }
  };

  return (
    <>
      {/* 1. Background Sources */}
      <MapLibreGL.ShapeSource 
        id="poiSource" 
        shape={backgroundPois}
        hitbox={{ width: 30, height: 30 }}
        onPress={handleShapePress}
      >
        <MapLibreGL.CircleLayer
          id="backgroundPoiDots"
          style={{
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 4,
              18, 8
            ],
            circleColor: ['get', 'color'],
            circleStrokeWidth: 2,
            circleStrokeColor: '#FFFFFF',
            circleOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 0,
              14.5, 1
            ],
            circleStrokeOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 0,
              14.5, 1
            ],
          }}
        />
      </MapLibreGL.ShapeSource>

      <MapLibreGL.ShapeSource 
        id="eventsSource" 
        shape={eventMarkers}
        hitbox={{ width: 44, height: 44 }}
        onPress={handleShapePress}
      >
        <MapLibreGL.SymbolLayer
          id="eventLabels"
          style={{
            textField: ['get', 'name'],
            textSize: 16,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 3,
            textAnchor: 'center',
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 1,
              14.5, 0
            ],
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 2. POI MARKERS - Isolated from Route re-renders */}
      <POIMarkers 
        features={backgroundPois.features}
        selectedPoiId={selectedPoiId}
        onPoiPress={onPoiPress}
        theme={theme}
        zoomSharedValue={zoomSharedValue}
      />

      {/* 3. LABELS */}
      <MapLibreGL.ShapeSource 
        id="labelsSource" 
        shape={labelGeoJSON as any}
      >
        <MapLibreGL.SymbolLayer
          id="poiLabelLayer"
          minZoomLevel={13.5}
          style={{
            textField: ['get', 'name'],
            textSize: 12,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textAnchor: 'top',
            textOffset: [0, 2.2],
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 0,
              14.5, 1
            ]
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 4. ROUTE - Isolated from POI re-renders */}
      <RouteLayer 
        uiState={uiState}
        currentRoute={currentRoute}
        isDrawerOpen={isDrawerOpen}
      />
    </>
  );
});

MapLayers.displayName = 'MapLayers';
