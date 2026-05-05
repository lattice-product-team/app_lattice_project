import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';

interface MapLayersProps {
  theme: any;
  poisGeoJSON: any;
  eventsGeoJSON?: any;
  eventImages?: Record<string, { uri: string }>;
  pathNetwork: any;
  currentRoute: any;
  isNavigating: boolean;
  onPoiPress: (data: any) => void;
}

export const MapLayers = ({
  theme,
  poisGeoJSON,
  eventsGeoJSON,
  eventImages,
  pathNetwork,
  currentRoute,
  isNavigating,
  onPoiPress
}: MapLayersProps) => {
  return (
    <>
      {/* 0. IMAGES REGISTRATION (GPU) */}
      <MapLibreGL.Images images={eventImages || {}} />

      {/* 1. EVENTS LAYER (GPU-RENDERED) */}
      <MapLibreGL.ShapeSource
        id="eventsSource"
        shape={eventsGeoJSON || EMPTY_GEOJSON}
        onPress={onPoiPress}
      >
        {/* Shadow Layer for depth */}
        <MapLibreGL.CircleLayer
          id="eventShadowLayer"
          style={{
            circleColor: '#000000',
            circleOpacity: 0.2,
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 12,
              18, 26
            ],
            circleBlur: 1,
            circleTranslate: [0, 2],
          }}
        />

        {/* Background white circle (The Pin Body) */}
        <MapLibreGL.CircleLayer
          id="eventCircleLayer"
          style={{
            circleColor: '#FFFFFF',
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 10,
              18, 24
            ],
            circleStrokeWidth: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 1,
              18, 2
            ],
            circleStrokeColor: ['get', 'color'],
            circlePitchAlignment: 'map',
          }}
        />

        {/* Event Image (GPU Symbol) - Sized to fit inside the circle */}
        <MapLibreGL.SymbolLayer
          id="eventImageLayer"
          style={{
            iconImage: ['get', 'imageKey'],
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 0.2,
              18, 0.5
            ],
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconPadding: 0,
          }}
        />

        {/* Event Label (GPU Text) */}
        <MapLibreGL.SymbolLayer
          id="eventLabelLayer"
          minZoomLevel={13}
          style={{
            textField: ['get', 'name'],
            textFont: ['Inter SemiBold', 'Arial Unicode MS Regular'],
            textSize: 12,
            textOffset: [0, 2.5],
            textAnchor: 'top',
            textColor: theme.dark ? '#FFFFFF' : '#1A1A1A',
            textHaloColor: theme.dark ? '#000000' : '#FFFFFF',
            textHaloWidth: 1,
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 0,
              14, 1
            ],
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
        
        {/* POI Icons (SDF style) */}
        <MapLibreGL.SymbolLayer
          id="poisIconLayer"
          minZoomLevel={15}
          style={{
            ...mapLayerStyles.poiIcons,
            iconOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              15.0, 0,
              16.5, 1
            ],
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
