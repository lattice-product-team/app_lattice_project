import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { EventMarker } from './EventMarker';
import { POIMarker } from './POIMarker';

interface MapLayersProps {
  theme: any;
  poisGeoJSON: any;
  eventsGeoJSON?: any;
  selectedEventId?: string | number | null;
  selectedPoiId?: string | number | null;
  pathNetwork: any;
  currentRoute: any;
  isNavigating: boolean;
  isPlanning?: boolean;
  onPoiPress: (data: any) => void;
  zoomLevel: number;
  zoomSharedValue: SharedValue<number>;
}

export const MapLayers = React.memo(({
  theme,
  poisGeoJSON,
  eventsGeoJSON,
  selectedEventId,
  selectedPoiId,
  pathNetwork,
  currentRoute,
  isNavigating,
  isPlanning,
  onPoiPress,
  zoomLevel,
  zoomSharedValue,
}: MapLayersProps) => {
  return (
    <>
      {/* 1. EVENTS LAYER - Always visible */}
      {/* 1. EVENTS LAYER (PointAnnotations for maximum stability on iOS) */}
      {eventsGeoJSON?.features?.map((feature: any) => {
        const id = feature.properties?.id || feature.id;
        const isSelected = String(selectedEventId) === String(id);
        const coords = feature.geometry?.coordinates;
        
        if (!coords || coords.length !== 2) return null;

        return (
          <MapLibreGL.PointAnnotation
            key={`ev-pa-${id}`}
            id={`ev-ann-${id}`}
            coordinate={coords}
          >
            <View style={mapPinStyles.markerWrapper}>
              <EventMarker
                event={feature}
                theme={theme}
                isSelected={isSelected}
                onPress={onPoiPress}
                zoomSharedValue={zoomSharedValue}
              />
            </View>
          </MapLibreGL.PointAnnotation>
        );
      })}

      {/* 2. POI LAYER (PointAnnotations with Contextual Visibility) */}
      {poisGeoJSON?.features?.map((feature: any) => {
        const id = feature.properties?.id || feature.id;
        const isSelected = String(selectedPoiId) === String(id);
        const isLinkedToSelectedEvent = selectedEventId && String(feature.properties?.parentId) === String(selectedEventId);
        
        // Visibility logic
        const isVisible = zoomLevel > 13.0 || isSelected || isLinkedToSelectedEvent;
        const coords = feature.geometry?.coordinates;

        if (!isVisible || !coords || coords.length !== 2) return null;

        return (
          <MapLibreGL.PointAnnotation
            key={`poi-pa-${id}`}
            id={`poi-ann-${id}`}
            coordinate={coords}
          >
            <View style={mapPinStyles.markerWrapper}>
              <POIMarker
                poi={feature}
                theme={theme}
                isSelected={isSelected}
                isLinkedToSelectedEvent={isLinkedToSelectedEvent}
                onPress={onPoiPress}
                zoomSharedValue={zoomSharedValue}
              />
            </View>
          </MapLibreGL.PointAnnotation>
        );
      })}

      {/* 3. PATH NETWORK (Stays in GL) */}
      {!isNavigating && (
        <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork || EMPTY_GEOJSON}>
          <MapLibreGL.LineLayer
            id="networkLines"
            style={{
              ...mapLayerStyles.networkLines,
              lineOpacity: 0.15,
              lineColor: theme.colors.brand.primary,
            }}
          />
        </MapLibreGL.ShapeSource>
      )}

      {/* 4. ROUTE VISUALS (Stays in GL) */}
      {!!((isNavigating || isPlanning) && currentRoute) && (
        <MapLibreGL.ShapeSource 
          id="routeSource" 
          key="active-route-source" 
          shape={currentRoute}
        >
          <MapLibreGL.LineLayer 
            id="routeFill" 
            style={mapLayerStyles.routeFill} 
          />
          <MapLibreGL.LineLayer
            id="routeGlow"
            style={{ ...mapLayerStyles.routeGlow, lineBlur: 6, lineOpacity: 0.4 }}
          />
        </MapLibreGL.ShapeSource>
      )}
    </>
  );
});

MapLayers.displayName = 'MapLayers';
