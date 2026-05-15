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
    if (!currentRoute) return EMPTY_GEOJSON;
    if (currentRoute.type === 'FeatureCollection') return currentRoute;
    return { type: 'FeatureCollection', features: [currentRoute] };
  }, [currentRoute]);

  const selectedFeature = useMemo(() => {
    if (selectedPoiId) {
      return poisGeoJSON?.features?.find((f: any) => String(f.properties?.id) === String(selectedPoiId));
    }
    if (selectedEventId) {
      return eventMarkers.features.find((f: any) => String(f.properties?.id) === String(selectedEventId));
    }
    return null;
  }, [selectedPoiId, selectedEventId, poisGeoJSON, eventMarkers]);

  // Background POIs (Excluding the selected one)
  const backgroundPois = useMemo(() => ({
    type: 'FeatureCollection',
    features: poisGeoJSON?.features?.filter((f: any) => String(f.properties?.id) !== String(selectedPoiId)) || []
  }), [poisGeoJSON, selectedPoiId]);

  // Background Events (Excluding the selected one)
  const backgroundEvents = useMemo(() => ({
    type: 'FeatureCollection',
    features: eventMarkers.features.filter((f: any) => String(f.properties?.id) !== String(selectedEventId)) || []
  }), [eventMarkers, selectedEventId]);

  return (
    <>
      {/* 0. EVENT BOUNDARIES */}
      <MapLibreGL.ShapeSource id="eventBoundariesSource" shape={eventBoundaries}>
        <MapLibreGL.FillLayer
          id="eventBoundaryFill"
          style={{
            fillColor: ['get', 'color'],
            fillOpacity: 0.1,
            fillAntialias: true,
          }}
        />
        <MapLibreGL.LineLayer
          id="eventBoundaryOutline"
          style={{
            lineColor: ['get', 'color'],
            lineWidth: 2,
            lineDasharray: [2, 2],
            lineOpacity: 0.6,
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 1. GPU-ACCELERATED BACKGROUND LAYERS */}
      <MapLibreGL.ShapeSource 
        id="backgroundPoisSource" 
        shape={backgroundPois}
        onPress={(e) => onPoiPress(e.features[0])}
      >
        <MapLibreGL.CircleLayer
          id="backgroundPoiDots"
          minZoomLevel={13}
          style={{
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 3,
              16, 7
            ],
            circleColor: ['get', 'color'],
            circleStrokeWidth: 2,
            circleStrokeColor: '#FFFFFF',
            circleOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 0,
              13.5, 1
            ],
            circleStrokeOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13, 0,
              13.5, 1
            ],
          }}
        />
      </MapLibreGL.ShapeSource>

      <MapLibreGL.ShapeSource 
        id="backgroundEventsSource" 
        shape={backgroundEvents}
        onPress={(e) => onPoiPress(e.features[0])}
      >
        <MapLibreGL.CircleLayer
          id="backgroundEventDots"
          minZoomLevel={10}
          maxZoomLevel={16}
          style={{
            circleRadius: [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 5,
              14, 10
            ],
            circleColor: ['get', 'color'],
            circleStrokeWidth: 3,
            circleStrokeColor: '#FFFFFF',
            circleOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              11, 1,
              15.5, 1,
              16, 0
            ],
            circleStrokeOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              11, 1,
              15.5, 1,
              16, 0
            ],
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 2. SELECTED ITEM - Single native view for high-fidelity animations */}
      {selectedFeature && (
        <MapLibreGL.PointAnnotation
          key={`selected-pa-${selectedFeature.properties?.id}`}
          id={`selected-ann-${selectedFeature.properties?.id}`}
          coordinate={selectedFeature.geometry.coordinates}
          onSelected={() => onPoiPress(selectedFeature)}
          style={{ zIndex: 100 }}
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
            {selectedEventId ? (
              <EventMarker
                event={selectedFeature}
                theme={theme}
                isSelected={true}
                onPress={onPoiPress}
                zoomSharedValue={zoomSharedValue}
              />
            ) : (
              <POIMarker
                poi={selectedFeature}
                theme={theme}
                isSelected={true}
                onPress={onPoiPress}
                zoomSharedValue={zoomSharedValue}
              />
            )}
          </View>
        </MapLibreGL.PointAnnotation>
      )}

      {/* 4. LABELS - Throttled rendering for better performance */}
      <MapLibreGL.ShapeSource 
        id="labelsSource" 
        shape={{
          type: 'FeatureCollection',
          features: [
            ...(selectedFeature ? [selectedFeature] : []),
            ...(zoomLevel >= 15 ? backgroundPois.features : [])
          ]
        }}
      >
        <MapLibreGL.SymbolLayer
          id="poiLabelLayer"
          minZoomLevel={14}
          style={{
            textField: ['get', 'name'],
            textSize: 11,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textAnchor: 'top',
            textOffset: [0, 1.8],
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,
              15, 1
            ]
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 5. ROUTE VISUALS */}
      <MapLibreGL.ShapeSource id="routeSource" shape={routeGeoJSON} tolerance={0.1}>
        <MapLibreGL.LineLayer
          id="routeGlow"
          style={{ ...mapLayerStyles.routeGlow, lineBlur: 6, lineOpacity: 0.3 }}
        />
        <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
      </MapLibreGL.ShapeSource>
    </>
  );
});

MapLayers.displayName = 'MapLayers';
