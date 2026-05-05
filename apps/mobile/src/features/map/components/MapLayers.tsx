import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';

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
  return (
    <>
      {/* 1. EVENTS LAYER (GPU-RENDERED STACK) */}
      <MapLibreGL.ShapeSource
        id="eventsSource"
        shape={eventsGeoJSON || EMPTY_GEOJSON}
        onPress={onPoiPress}
      >
        {/* Layer 1: Shadow for depth */}
        <MapLibreGL.CircleLayer
          id="eventShadowLayer"
          style={{
            circleColor: '#000000',
            circleOpacity: 0.15,
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 14,
              18, 28
            ],
            circleBlur: 1,
            circleTranslate: [0, 2],
            circlePitchAlignment: 'viewport',
          }}
        />

        {/* Layer 2: Main Body (White Circle with dynamic border) */}
        <MapLibreGL.CircleLayer
          id="eventCircleLayer"
          style={{
            circleColor: '#FFFFFF',
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, ['*', ['case', ['==', ['get', 'id'], selectedEventId || ''], 1.4, 1], 12],
              18, ['*', ['case', ['==', ['get', 'id'], selectedEventId || ''], 1.4, 1], 26]
            ],
            circleStrokeWidth: 2,
            circleStrokeColor: ['get', 'color'],
            circlePitchAlignment: 'viewport',
          }}
        />

        {/* Layer 3: Event Image (Registered dynamically in MapImageManager) */}
        <MapLibreGL.SymbolLayer
          id="eventImageLayer"
          style={{
            iconImage: ['get', 'imageKey'],
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, ['*', ['case', ['==', ['get', 'id'], selectedEventId || ''], 1.4, 1], 0.25],
              18, ['*', ['case', ['==', ['get', 'id'], selectedEventId || ''], 1.4, 1], 0.55]
            ],
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconPitchAlignment: 'viewport',
          }}
        />

        {/* Layer 4: Label (Only visible at high zoom) */}
        <MapLibreGL.SymbolLayer
          id="eventLabelLayer"
          minZoomLevel={14}
          style={{
            textField: ['get', 'name'],
            textFont: ['Inter SemiBold', 'Arial Unicode MS Regular'],
            textSize: 13,
            textOffset: [0, 2.8],
            textAnchor: 'top',
            textColor: theme.dark ? '#FFFFFF' : '#1A1A1A',
            textHaloColor: theme.dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            textHaloWidth: 1.5,
            textPitchAlignment: 'viewport',
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 2. VENUE BOUNDARY */}
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

      {/* 2. GL-BASED POI LAYER (Scalable & Fluid) */}
      <MapLibreGL.ShapeSource 
        id="poisSource" 
        shape={poisGeoJSON || EMPTY_GEOJSON}
        onPress={onPoiPress}
        cluster={false}
      >
        {/* Background Circle with smooth fade */}
        <MapLibreGL.CircleLayer
          id="poisCircleLayer"
          minZoomLevel={14}
          style={{
            ...mapLayerStyles.poiCircles,
            circleOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14.5, 0,
              16.0, 0.9
            ],
            circleStrokeOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14.5, 0,
              16.0, 1
            ],
          }}
        />
        
        {/* POI Icons (Vector/Maki style) */}
        <MapLibreGL.SymbolLayer
          id="poisIconLayer"
          minZoomLevel={15.5}
          style={{
            ...mapLayerStyles.poiIcons,
            iconImage: ['get', 'icon'], // Use the icon name from GeoJSON properties
            iconSize: 0.8,
            iconOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              15.5, 0,
              16.5, 1
            ],
            iconPitchAlignment: 'viewport',
          }}
        />

        {/* POI Labels with smooth fade */}
        <MapLibreGL.SymbolLayer
          id="poisLabelLayer"
          minZoomLevel={16}
          style={{
            ...mapLayerStyles.poiLabels,
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              16.0, 0,
              17.5, 1
            ],
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
