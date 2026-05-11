import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SharedValue } from 'react-native-reanimated';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { EventMarker } from './EventMarker';
import { POIMarker } from './POIMarker';
import { useStartupStore } from '../../../store/useStartupStore';

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
      {eventsGeoJSON?.features?.map((feature: any) => {
        const isSelected = String(selectedEventId) === String(feature.properties?.id);
        
        // STRICT VALIDATION
        const coords = feature.geometry?.coordinates;
        const isValidCoords = coords && coords.length === 2 && (coords[0] !== 0 || coords[1] !== 0);

        if (!isValidCoords) return null;

        return (
          <MapLibreGL.MarkerView
            key={`mv-ev-v3-${feature.properties?.id || feature.id}`}
            id={`event-marker-${feature.properties?.id || feature.id}`}
            coordinate={coords}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <EventMarker
              event={feature}
              theme={theme}
              isSelected={isSelected}
              onPress={onPoiPress}
              zoomSharedValue={zoomSharedValue}
            />
          </MapLibreGL.MarkerView>
        );
      })}

      {/* 2. POI LAYER (With Contextual Visibility) */}
      {poisGeoJSON?.features?.map((feature: any) => {
        const isSelected = String(selectedPoiId) === String(feature.properties?.id);
        const isLinkedToSelectedEvent = selectedEventId && String(feature.properties?.parentId) === String(selectedEventId);
        
        // Use React zoomLevel for mounting/unmounting (stable)
        const isVisible = zoomLevel > 14.5 || isSelected || isLinkedToSelectedEvent;
        const coords = feature.geometry?.coordinates;
        const isValidCoords = coords && coords.length === 2 && (coords[0] !== 0 || coords[1] !== 0);

        if (!isVisible || !isValidCoords) return null;

        return (
          <MapLibreGL.MarkerView
            key={`mv-poi-v4-${feature.properties?.id || feature.id}`}
            id={`poi-marker-${feature.properties?.id || feature.id}`}
            coordinate={coords}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <POIMarker
              poi={feature}
              theme={theme}
              isSelected={isSelected}
              onPress={onPoiPress}
              zoomSharedValue={zoomSharedValue}
              zoomLevel={zoomLevel}
            />
          </MapLibreGL.MarkerView>
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
