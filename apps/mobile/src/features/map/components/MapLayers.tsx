import React, { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View, Platform } from 'react-native';
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

export const MapLayers = React.memo(
  ({
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
        return poisGeoJSON?.features?.find(
          (f: any) => String(f.properties?.id) === String(selectedPoiId)
        );
      }
      if (selectedEventId) {
        return eventMarkers.features.find(
          (f: any) => String(f.properties?.id) === String(selectedEventId)
        );
      }
      return null;
    }, [selectedPoiId, selectedEventId, poisGeoJSON, eventMarkers]);

    const backgroundPois = useMemo(
      () => ({
        type: 'FeatureCollection',
        features: poisGeoJSON?.features || [],
      }),
      [poisGeoJSON]
    );

    const labelGeoJSON = useMemo(
      () => ({
        type: 'FeatureCollection',
        features: [
          ...(selectedFeature ? [selectedFeature] : []),
          ...(zoomLevel >= 14 ? backgroundPois.features : []),
        ],
      }),
      [selectedFeature, backgroundPois, zoomLevel]
    );

    const handleShapePress = (e: any) => {
      if (e.features && e.features.length > 0) {
        onPoiPress(e.features[0]);
      }
    };

    return (
      <>
        {/* 1.5 EVENTS - Show large labels that fade out as we zoom in */}
        <MapLibreGL.ShapeSource
          id="eventsSource"
          shape={eventMarkers}
          hitbox={{ width: 50, height: 50 }}
          onPress={handleShapePress}
        >
          <MapLibreGL.SymbolLayer
            id="eventLabels"
            style={{
              textField: ['get', 'name'],
              textSize: 18, // Larger event labels
              textColor: ['get', 'color'],
              textHaloColor: '#FFFFFF',
              textHaloWidth: 3,
              textAnchor: 'center',
              // Fade out to make room for POIs
              textOpacity: ['interpolate', ['linear'], ['zoom'], 13.5, 1, 14.5, 0],
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* 2. POI MARKERS - Always show icons, no more circles */}
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

        {/* 4. LABELS - Larger text, synchronized with event labels disappearing */}
        <MapLibreGL.ShapeSource id="labelsSource" shape={labelGeoJSON as any}>
          <MapLibreGL.SymbolLayer
            id="poiLabelLayer"
            minZoomLevel={13.5}
            style={{
              textField: ['get', 'name'],
              textSize: 14, // Larger POI labels
              textColor: ['get', 'color'],
              textHaloColor: '#FFFFFF',
              textHaloWidth: 2,
              textAnchor: 'top',
              textOffset: [0, 2.5], // Offset to be BELOW the larger icon
              // Appear exactly as events disappear
              textOpacity: ['interpolate', ['linear'], ['zoom'], 13.5, 0, 14.5, 1],
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
  }
);

MapLayers.displayName = 'MapLayers';
