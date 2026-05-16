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
 * Sub-component for POI Markers to isolate re-renders.
 */
const POIMarkers = React.memo(({ 
  features, 
  selectedPoiId, 
  onPoiPress, 
  theme, 
  zoomSharedValue,
  visibleBounds 
}: { 
  features: any[], 
  selectedPoiId: any, 
  onPoiPress: any, 
  theme: any, 
  zoomSharedValue: any,
  visibleBounds: number[][] | null
}) => {
  // Helper to check if a point is within visible bounds with a safety margin
  const isPointInBounds = (coords: number[], bounds: number[][] | null) => {
    if (!bounds || bounds.length < 2) return true; // Default to visible if no bounds
    const [[neLng, neLat], [swLng, swLat]] = bounds;
    const [lng, lat] = coords;
    
    // Add 10% padding to bounds to prevent flickering at edges
    const lngPad = Math.abs(neLng - swLng) * 0.1;
    const latPad = Math.abs(neLat - swLat) * 0.1;
    
    const minLng = Math.min(neLng, swLng) - lngPad;
    const maxLng = Math.max(neLng, swLng) + lngPad;
    const minLat = Math.min(neLat, swLat) - latPad;
    const maxLat = Math.max(neLat, swLat) + latPad;

    return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
  };

  const visibleFeatures = useMemo(() => {
    if (!visibleBounds) return features;
    return features.filter(f => 
      String(f.properties?.id) === String(selectedPoiId) || // Always keep selected
      isPointInBounds(f.geometry.coordinates, visibleBounds)
    );
  }, [features, visibleBounds, selectedPoiId]);

  // Render ONLY visible pois as PointAnnotations for performance.
  // We use the ID to ensure stability across re-renders.
  return (
    <>
      {visibleFeatures.map((feature) => {
        const id = String(feature.properties?.id);
        const isSelected = id === String(selectedPoiId);
        
        return (
          <MapLibreGL.PointAnnotation
            key={`poi-${id}`}
            id={`ann-${id}`}
            coordinate={feature.geometry.coordinates}
            style={{ zIndex: isSelected ? 100 : 1 }}
          >
            <View 
              style={[
                mapPinStyles.markerWrapper, 
                { backgroundColor: 'transparent' }
              ]}
              collapsable={false}
            >
              <POIMarker
                poi={feature}
                theme={theme}
                isSelected={isSelected}
                onPress={onPoiPress}
                zoomSharedValue={zoomSharedValue}
              />
            </View>
          </MapLibreGL.PointAnnotation>
        );
      })}
    </>
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
    if (e.features && e.features.length > 0) {
      onPoiPress(e.features[0]);
    }
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
      {/* 1. Background Sources (Empty, logic moved to POIMarkers) */}
      <MapLibreGL.ShapeSource 
        id="poiSource" 
        shape={backgroundPois}
      />

      <MapLibreGL.ShapeSource 
        id="eventsBackgroundSource" 
        shape={backgroundEvents as any}
        hitbox={{ width: 44, height: 44 }}
        onPress={handleShapePress}
      >
        <MapLibreGL.SymbolLayer
          id="eventLabelsBackground"
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

      <MapLibreGL.ShapeSource 
        id="eventsSelectedSource" 
        shape={selectedEventFeature as any}
        onPress={handleShapePress}
      >
        <MapLibreGL.SymbolLayer
          id="eventLabelSelected"
          style={{
            textField: ['get', 'name'],
            textSize: 18,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 4,
            textAnchor: 'center',
            textOpacity: 1,
            textTransform: 'uppercase',
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
        visibleBounds={visibleBounds}
      />

      {/* 3. LABELS (Empty, logic moved to POIMarkers) */}
      <MapLibreGL.ShapeSource 
        id="labelsSource" 
        shape={EMPTY_GEOJSON}
      />

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
