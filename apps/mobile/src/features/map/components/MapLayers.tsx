import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { EventMarker } from './EventMarker';
import { POIMarker } from './POIMarker';
import { useMapUIStore } from '../store/useMapUIStore';

interface MapLayersProps {
  theme: any;
  allPoisGeoJSON: any;
  poisGeoJSON: any;
  eventsGeoJSON?: any;
  selectedEventId?: string | number | null;
  selectedPoiId?: string | number | null;
  pathNetwork: any;
  currentRoute: any;
  isNavigating: boolean;
  isPlanning?: boolean;
  onPoiPress: (data: any) => void;
}

export const MapLayers = ({
  theme,
  allPoisGeoJSON,
  poisGeoJSON,
  eventsGeoJSON,
  selectedEventId,
  selectedPoiId,
  pathNetwork,
  currentRoute,
  isNavigating,
  isPlanning,
  onPoiPress,
}: MapLayersProps) => {
  const currentZoom = useMapUIStore((s) => s.lastCameraPosition?.zoom || 15);

  return (
    <>
      {/* 1. EVENTS LAYER (PRIORITY - Always render first to maintain stability) */}
      {eventsGeoJSON?.features?.map((feature: any) => (
        <MapLibreGL.MarkerView
          key={`mv-ev-${feature.properties.id}`}
          id={`event-marker-${feature.properties.id}`}
          coordinate={feature.geometry.coordinates}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <EventMarker
            event={feature}
            theme={theme}
            isSelected={String(selectedEventId) === String(feature.properties.id)}
            onPress={onPoiPress}
          />
        </MapLibreGL.MarkerView>
      ))}

      {/* 2. POI LAYER (Unified MarkerViews) */}
      {poisGeoJSON?.features?.map((feature: any) => (
        <MapLibreGL.MarkerView
          key={`mv-poi-${feature.properties.id}`}
          id={`poi-marker-${feature.properties.id}`}
          coordinate={feature.geometry.coordinates}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <POIMarker
            poi={feature}
            theme={theme}
            isSelected={String(selectedPoiId) === String(feature.properties.id)}
            onPress={onPoiPress}
          />
        </MapLibreGL.MarkerView>
      ))}

      {/* 3. EVENT PERIMETER - REMOVED AS REQUESTED */}

      {/* 4. PATH NETWORK (Stays in GL) */}
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

      {/* 5. ROUTE VISUALS (Stays in GL) */}
      {!!((isNavigating || isPlanning) && currentRoute) && (
        <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute}>
          <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
          <MapLibreGL.LineLayer
            id="routeGlow"
            style={{ ...mapLayerStyles.routeGlow, lineBlur: 6, lineOpacity: 0.4 }}
          />
        </MapLibreGL.ShapeSource>
      )}
    </>
  );
};

MapLayers.displayName = 'MapLayers';
