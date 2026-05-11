import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { EventMarker } from './EventMarker';
import { POIMarker } from './POIMarker';
import { applySpiderfication, SpiderfiedFeature } from '../utils/spatialUtils';
import { usePOIStore } from '../../poi/store/usePOIStore';

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
  zoomLevel: number;
}

export const MapLayers = React.memo(({
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
  zoomLevel,
}: MapLayersProps) => {

  // 1. Combine and Spiderfy features to handle overlaps between events and POIs
  const spiderfiedItems = React.useMemo(() => {
    const allFeatures = [
      ...(eventsGeoJSON?.features || []).map((f: any) => ({ ...f, _isEvent: true })),
      ...(poisGeoJSON?.features || []).map((f: any) => ({ ...f, _isEvent: false }))
    ].filter((f: any) => {
      const coords = f.geometry?.coordinates;
      return coords && coords.length === 2 && (coords[0] !== 0 || coords[1] !== 0);
    });

    return applySpiderfication(allFeatures, zoomLevel);
  }, [eventsGeoJSON, poisGeoJSON, zoomLevel]);

  // 2. Separate back into Events and POIs for rendering using our explicit flag
  const events = spiderfiedItems.filter(item => item.feature._isEvent);
  const pois = spiderfiedItems.filter(item => !item.feature._isEvent);

  return (
    <>
      {/* 1. EVENTS LAYER - Always visible */}
      {events.map((item: SpiderfiedFeature) => {
        const { feature, angle, isSpiderfied } = item;
        const isSelected = String(selectedEventId) === String(feature.properties?.id);
        
        if (!feature.geometry?.coordinates) return null;

        return (
          <MapLibreGL.MarkerView
            key={`mv-ev-${feature.properties?.id || feature.id}`}
            id={`event-marker-${feature.properties?.id || feature.id}`}
            coordinate={feature.geometry.coordinates}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <EventMarker
              event={feature}
              theme={theme}
              isSelected={isSelected}
              onPress={onPoiPress}
              spiderAngle={angle || 0}
              isSpiderfied={isSpiderfied}
            />
          </MapLibreGL.MarkerView>
        );
      })}

      {/* 2. POI LAYER (With Contextual Visibility) */}
      {pois.map((item: SpiderfiedFeature) => {
        const { feature, angle, isSpiderfied } = item;
        const isSelected = String(selectedPoiId) === String(feature.properties?.id);
        const isLinkedToSelectedEvent = selectedEventId && String(feature.properties?.parentId) === String(selectedEventId);
        
        // Show POIs if zoom is high enough OR if the POI is selected OR if its parent event is selected
        const isVisible = zoomLevel > 14.0 || isSelected || isLinkedToSelectedEvent;
        
        if (!isVisible || !feature.geometry?.coordinates) return null;

        return (
          <MapLibreGL.MarkerView
            key={`mv-poi-${feature.properties?.id || feature.id}`}
            id={`poi-marker-${feature.properties?.id || feature.id}`}
            coordinate={feature.geometry.coordinates}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <POIMarker
              poi={feature}
              theme={theme}
              isSelected={isSelected}
              onPress={onPoiPress}
              zoomLevel={zoomLevel}
              spiderAngle={angle || 0}
              isSpiderfied={isSpiderfied}
            />
          </MapLibreGL.MarkerView>
        );
      })}

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
