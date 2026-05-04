import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';

interface MapLayersProps {
  theme: any;
  poisGeoJSON: any;
  pathNetwork: any;
  currentRoute: any;
  isNavigating: boolean;
  onPoiPress: (data: any) => void;
}

export const MapLayers = ({
  theme,
  poisGeoJSON,
  pathNetwork,
  currentRoute,
  isNavigating,
  onPoiPress
}: MapLayersProps) => {
  return (
    <>
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

      {/* 2. GL-BASED POI LAYER (The scalable part) */}
      <MapLibreGL.ShapeSource 
        id="poisSource" 
        shape={poisGeoJSON || EMPTY_GEOJSON}
        onPress={onPoiPress}
        cluster={false}
      >
        <MapLibreGL.CircleLayer
          id="poisCircleLayer"
          minZoomLevel={15}
          style={mapLayerStyles.poiCircles}
        />
        <MapLibreGL.SymbolLayer
          id="poisLabelLayer"
          minZoomLevel={16}
          style={{
            ...mapLayerStyles.poiLabels,
            textColor: theme.dark ? '#FFFFFF' : '#000000',
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 3. ROUTE VISUALS */}
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
