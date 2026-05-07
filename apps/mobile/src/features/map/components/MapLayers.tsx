import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { EventMarker } from './EventMarker';
import { POIMarker } from './POIMarker';
import { useMapUIStore } from '../store/useMapUIStore';

interface MapLayersProps {
  theme: any;
  poisGeoJSON: any;
  eventsGeoJSON?: any;
  selectedEventId?: string | number | null;
  pathNetwork: any;
  currentRoute: any;
  isNavigating: boolean;
  onPoiPress: (data: any) => void;
}

export const MapLayers = ({
  theme,
  poisGeoJSON,
  eventsGeoJSON,
  selectedEventId,
  pathNetwork,
  currentRoute,
  isNavigating,
  onPoiPress
}: MapLayersProps) => {
  const currentZoom = useMapUIStore(s => s.lastCameraPosition?.zoom || 15);

  return (
    <>
      {/* 1. EVENTS LAYER (Unified MarkerView) */}
      {eventsGeoJSON?.features?.map((feature: any) => (
        <MapLibreGL.MarkerView
          key={feature.id}
          id={`event-marker-${feature.id}`}
          coordinate={feature.geometry.coordinates}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <EventMarker 
            event={feature}
            theme={theme}
            isSelected={selectedEventId === feature.id}
            onPress={onPoiPress}
          />
        </MapLibreGL.MarkerView>
      ))}

      {/* 2. POI LAYER (Unified MarkerView) - Only visible at high zoom */}
      {currentZoom > 15.5 && poisGeoJSON?.features
        ?.filter((f: any) => f.properties.type !== 'boundary')
        .map((feature: any) => (
          <MapLibreGL.MarkerView
            key={feature.id}
            id={`poi-marker-${feature.id}`}
            coordinate={feature.geometry.coordinates}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <POIMarker 
              poi={feature}
              theme={theme}
              onPress={onPoiPress}
            />
          </MapLibreGL.MarkerView>
        ))
      }

      {/* 3. EVENT PERIMETER (Stays in GL for performance) */}
      {!isNavigating && (
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
      )}

      {/* 4. PATH NETWORK (Stays in GL) */}
      {!isNavigating && (
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
      )}

      {/* 5. ROUTE VISUALS (Stays in GL) */}
      {!!(isNavigating && currentRoute) && (
        <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute}>
          <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
          <MapLibreGL.LineLayer
            id="routeGlow"
            style={{ ...mapLayerStyles.routeGlow, lineBlur: 4 }}
          />
        </MapLibreGL.ShapeSource>
      )}
    </>
  );
};

MapLayers.displayName = 'MapLayers';
