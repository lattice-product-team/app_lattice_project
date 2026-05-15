import React, { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { POIMarker } from './POIMarker';
import { MapUIState } from '../store/useMapUIStore';

interface MapLayersProps {
  theme: any;
  poisGeoJSON: any;
  eventsGeoJSON?: any;
  selectedEventId?: string | number | null;
  selectedPoiId?: string | number | null;
  pathNetwork: any;
  currentRoute: any;
  uiState: MapUIState;
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
  uiState,
  onPoiPress,
  zoomLevel,
  zoomSharedValue,
}: MapLayersProps) => {
  const eventMarkers = useMemo(() => {
    const markers: any[] = [];
    
    eventsGeoJSON?.features?.forEach((f: any) => {
      if (f.geometry.type === 'Point') markers.push(f);
    });
    
    return { type: 'FeatureCollection', features: markers };
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

  const backgroundPois = useMemo(() => ({
    type: 'FeatureCollection',
    features: poisGeoJSON?.features || []
  }), [poisGeoJSON]);

  const labelGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      ...(selectedFeature ? [selectedFeature] : []),
      ...(zoomLevel >= 14 ? backgroundPois.features : [])
    ]
  }), [selectedFeature, backgroundPois, zoomLevel]);

  const handleShapePress = (e: any) => {
    if (e.features && e.features.length > 0) {
      onPoiPress(e.features[0]);
    }
  };

  return (
    <>

      {/* 1.5 HIGH-FIDELITY BACKGROUND POIS - OPTIMIZED FOR ANDROID */}
      {/* We use a CircleLayer for background POIs to keep the map fast, and only use 
          PointAnnotation for the selected one. This is CRITICAL for Android performance. */}
      <MapLibreGL.ShapeSource 
        id="poiSource" 
        shape={backgroundPois}
        hitbox={{ width: 30, height: 30 }}
        onPress={handleShapePress}
      >
      {/* Background circles removed in favor of persistent icons */}
      </MapLibreGL.ShapeSource>

      <MapLibreGL.ShapeSource 
        id="eventsSource" 
        shape={eventMarkers}
        hitbox={{ width: 44, height: 44 }}
        onPress={handleShapePress}
      >
        <MapLibreGL.SymbolLayer
          id="eventLabels"
          style={{
            textField: ['get', 'name'],
            textSize: 16,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 3,
            textAnchor: 'center',
            // Fade out as we zoom in, to reveal POIs
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 1,
              14.5, 0
            ],
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* 2. POI MARKERS - Persistent icons for all visible POIs */}
      {backgroundPois.features.map((feature: any) => {
        const id = feature.properties?.id;
        const isSelected = String(id) === String(selectedPoiId);
        
        return (
          <MapLibreGL.PointAnnotation
            key={`poi-${id}`}
            id={`ann-${id}`}
            coordinate={feature.geometry.coordinates}
            onSelected={() => onPoiPress(feature)}
            style={{ zIndex: isSelected ? 100 : 50 }}
          >
            <View 
              style={[
                mapPinStyles.markerWrapper, 
                { backgroundColor: 'transparent' }
              ]}
              collapsable={false}
            >
              <POIMarker
                poi={feature}
                theme={theme}
                isSelected={isSelected}
                onPress={onPoiPress}
                zoomSharedValue={zoomSharedValue}
              />
            </View>
          </MapLibreGL.PointAnnotation>
        );
      })}

      {/* 4. LABELS - Throttled rendering for better performance */}
      <MapLibreGL.ShapeSource 
        id="labelsSource" 
        shape={labelGeoJSON as any}
      >
        <MapLibreGL.SymbolLayer
          id="poiLabelLayer"
          minZoomLevel={13.5}
          style={{
            textField: ['get', 'name'],
            textSize: 12,
            textColor: ['get', 'color'],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textAnchor: 'top',
            textOffset: [0, 2.2], // Increased offset to be BELOW the icon
            textOpacity: [
              'interpolate',
              ['linear'],
              ['zoom'],
              13.5, 0,
              14.5, 1
            ]
          }}
        />
      </MapLibreGL.ShapeSource>



      {/* 5. ROUTE VISUALS */}
      {(uiState === MapUIState.NAVIGATING || uiState === MapUIState.PLANNING) && currentRoute && (
        <MapLibreGL.ShapeSource id="routeSource" shape={routeGeoJSON} tolerance={0.1}>
          <MapLibreGL.LineLayer
            id="routeGlow"
            style={{ ...mapLayerStyles.routeGlow, lineBlur: 6, lineOpacity: 0.3 }}
          />
          <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
        </MapLibreGL.ShapeSource>
      )}
    </>
  );
});

MapLayers.displayName = 'MapLayers';
