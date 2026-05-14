import React, { useMemo } from 'react';
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
  const { eventMarkers, eventBoundaries } = useMemo(() => {
    const markers: any[] = [];
    const boundaries: any[] = [];
    
    eventsGeoJSON?.features?.forEach((f: any) => {
      if (f.geometry.type === 'Point') markers.push(f);
      else boundaries.push(f);
    });
    
    return {
      eventMarkers: { type: 'FeatureCollection', features: markers },
      eventBoundaries: { type: 'FeatureCollection', features: boundaries },
    };
  }, [eventsGeoJSON]);

  const routeGeoJSON = useMemo(() => {
    // Show route whenever we have one, even if not explicitly in planning/nav mode yet
    // This provides better feedback to the user as soon as they select a POI
    if (!currentRoute) return EMPTY_GEOJSON;
    
    // Ensure we always return a FeatureCollection for maximum stability in MapLibre
    if (currentRoute.type === 'FeatureCollection') return currentRoute;
    
    return {
      type: 'FeatureCollection',
      features: [currentRoute],
    };
  }, [currentRoute]);


  return (
    <>
      {/* 0. EVENT BOUNDARIES (Polygons BELOW markers) */}
      <MapLibreGL.ShapeSource id="eventBoundariesSource" shape={eventBoundaries}>
        <MapLibreGL.FillLayer
          id="eventBoundaryFill"
          style={{
            fillColor: ['get', 'color'],
            fillOpacity: 0.0,
            fillAntialias: true,
          }}
        />
        <MapLibreGL.LineLayer
          id="eventBoundaryOutline"
          style={{
            lineColor: ['get', 'color'],
            lineWidth: 2,
            lineDasharray: [2, 2],
            lineOpacity: 0.0,
          }}
        />
        <MapLibreGL.SymbolLayer
          id="eventLabelLayer"
          minZoomLevel={9}
          maxZoomLevel={14}
          style={{
            textField: ['get', 'name'],
            textSize: 11,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 1.5,
            textHaloBlur: 0.5,
            textTransform: 'uppercase',
            textLetterSpacing: 0.1,
            textAnchor: 'center',
            textPitchAlignment: 'viewport',
            textRotationAlignment: 'viewport',
            textAllowOverlap: true,
            textIgnorePlacement: true,
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              10.5, 1,
              12, 1,
              13, 0
            ]
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 1. EVENTS LAYER - Only visible below zoom 14.0 */}
      {zoomLevel < 14.0 && eventMarkers?.features?.map((feature: any) => {
        const id = feature.properties?.id || feature.id;
        const isSelected = String(selectedEventId) === String(id);
        const coords = feature.geometry?.coordinates;
        
        if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;

        return (
          <MapLibreGL.PointAnnotation
            key={`ev-pa-${id}`}
            id={`ev-ann-${id}`}
            coordinate={coords}
            onSelected={() => onPoiPress(feature)}
            style={{ zIndex: 1 }}
          >
            <View 
              style={[
                mapPinStyles.markerWrapper, 
                { 
                  backgroundColor: 'transparent',
                  transform: [{ translateY: -40 }] 
                }
              ]}
              collapsable={false}
            >
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

      {/* 2. POI LAYER - Only visible at zoom 14.0 and above */}
      {zoomLevel >= 14.0 && poisGeoJSON?.features?.map((feature: any) => {
        const id = feature.properties?.id || feature.id;
        const isSelected = String(selectedPoiId) === String(id);
        const isLinkedToSelectedEvent = selectedEventId && String(feature.properties?.parentId) === String(selectedEventId);
        const coords = feature.geometry?.coordinates;
        
        if (!coords || coords.length !== 2) return null;

        return (
          <MapLibreGL.PointAnnotation
            key={`poi-pa-${id}`}
            id={`poi-ann-${id}`}
            coordinate={coords}
            onSelected={() => onPoiPress(feature)}
            style={{ zIndex: 10 }}
          >
            <View 
              style={[
                mapPinStyles.markerWrapper, 
                { 
                  backgroundColor: 'transparent',
                  transform: [{ translateY: -40 }]
                }
              ]}
              collapsable={false}
            >
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

      {/* 4. ROUTE VISUALS (Stays in GL) */}
      <MapLibreGL.ShapeSource 
        id="routeSource" 
        shape={routeGeoJSON}
        tolerance={0.1} // Slight tolerance for smoother rendering on mobile
        buffer={64}
        maxZoomLevel={20}
      >
        {/* Layer order: Glow UNDER, Fill ON TOP */}
        <MapLibreGL.LineLayer
          id="routeGlow"
          style={{ 
            ...mapLayerStyles.routeGlow, 
            lineBlur: 6, 
            lineOpacity: 0.3,
            lineOpacityTransition: { duration: 400 } // Smooth entrance
          }}
        />
        <MapLibreGL.LineLayer 
          id="routeFill" 
          style={{
            ...mapLayerStyles.routeFill,
            lineOpacityTransition: { duration: 400 } // Smooth entrance
          }} 
        />
      </MapLibreGL.ShapeSource>
    </>
  );
});

MapLayers.displayName = 'MapLayers';
