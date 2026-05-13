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

  // Create a unique key for the route source to force re-renders when the path changes
  // We use coordinates length and first/last point as a cheap "hash"
  const routeKey = useMemo(() => {
    if (!currentRoute) return 'none';
    const coords = currentRoute.geometry?.coordinates || [];
    if (coords.length === 0) return 'empty';
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `route-${coords.length}-${first[0]}-${last[0]}-${isNavigating ? 'nav' : 'plan'}`;
  }, [currentRoute, isNavigating]);

  return (
    <>
      {/* 1. EVENTS LAYER (Ultra-stable PointAnnotations) */}
      {eventsGeoJSON?.features?.map((feature: any) => {
        const id = feature.properties?.id || feature.id;
        const isSelected = String(selectedEventId) === String(id);
        const coords = feature.geometry?.coordinates;
        
        if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;

        return (
          <MapLibreGL.PointAnnotation
            key={`ev-pa-${id}`}
            id={`ev-ann-${id}`}
            coordinate={coords}
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

      {/* 2. POI LAYER (Ultra-stable PointAnnotations) */}
      {poisGeoJSON?.features?.map((feature: any) => {
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
      {currentRoute && (
        <MapLibreGL.ShapeSource 
          id="routeSource" 
          key={routeKey}
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
      )}
    </>
  );
});

MapLayers.displayName = 'MapLayers';
