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
  selectedPoiId?: string | number | null;
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
  selectedPoiId,
  pathNetwork,
  currentRoute,
  isNavigating,
  onPoiPress
}: MapLayersProps) => {
  const currentZoom = useMapUIStore(s => s.lastCameraPosition?.zoom || 15);

  return (
    <>
      {/* 2. POI LAYER (GL-BASED FOR PERFECT SYNC) */}
      <MapLibreGL.ShapeSource 
        id="poisSource" 
        shape={poisGeoJSON || EMPTY_GEOJSON}
        onPress={onPoiPress}
      >
        {/* POI Background Circle */}
        <MapLibreGL.CircleLayer
          id="poisCircle"
          minZoomLevel={14.0}
          style={{
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              16, ['case', ['==', ['get', 'id'], selectedPoiId || ''], 18, 12],
              18, ['case', ['==', ['get', 'id'], selectedPoiId || ''], 24, 16]
            ],
            circleColor: ['get', 'color'],
            circleStrokeWidth: 2,
            circleStrokeColor: '#FFFFFF',
            circleOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14.0, 0,
              15.0, 1
            ],
            circlePitchAlignment: 'map',
          }}
        />

        {/* POI Category Icon */}
        <MapLibreGL.SymbolLayer
          id="poisIcon"
          minZoomLevel={14.0}
          style={{
            iconImage: [
              'coalesce',
              ['concat', 'icon-', ['get', 'category']],
              'icon-default'
            ],
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              16, ['case', ['==', ['get', 'id'], selectedPoiId || ''], 0.6, 0.4],
              18, ['case', ['==', ['get', 'id'], selectedPoiId || ''], 0.8, 0.6]
            ],
            iconOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14.0, 0,
              15.0, 1
            ],
            iconPitchAlignment: 'viewport',
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
          }}
        />

        {/* POI Label */}
        <MapLibreGL.SymbolLayer
          id="poisLabel"
          minZoomLevel={15.0}
          style={{
            textFont: ['Roboto Regular', 'Noto Sans Regular'],
            textField: ['get', 'name'],
            textSize: 10,
            textOffset: [0, 2.5],
            textAnchor: 'top',
            textColor: theme.colors.text.primary || '#000000',
            textHaloColor: theme.colors.bg.main || '#FFFFFF',
            textHaloWidth: 2,
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              15.0, 0,
              16.0, 1
            ],
            textAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
      </MapLibreGL.ShapeSource>

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

      {/* 6. EVENTS LAYER (Using MarkerView for better touch reliability) */}
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
    </>
  );
};

MapLayers.displayName = 'MapLayers';
