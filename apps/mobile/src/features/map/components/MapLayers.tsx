import React, { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { EMPTY_GEOJSON } from '../../../constants/mapConstants';
import { mapLayerStyles } from '../../../styles/mapLayerStyles';
import { mapPinStyles } from '../../../styles/mapPinStyles';
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

  // Background POIs (Excluding the selected one)
  const backgroundPois = useMemo(() => ({
    type: 'FeatureCollection',
    features: poisGeoJSON?.features?.filter((f: any) => String(f.properties?.id) !== String(selectedPoiId)) || []
  }), [poisGeoJSON, selectedPoiId]);

  return (
    <>

      {/* 1.5 HIGH-FIDELITY BACKGROUND POIS (Lucide Icons) */}
      {/* We render these as React views for high quality, but keep a threshold for performance */}
      {zoomLevel >= 13.5 && backgroundPois.features.map((f: any) => (
        <MapLibreGL.PointAnnotation
          key={`bg-pa-${f.properties.id}`}
          id={`bg-ann-${f.properties.id}`}
          coordinate={f.geometry.coordinates}
          onSelected={() => onPoiPress(f)}
        >
          <View 
            style={[
              mapPinStyles.markerWrapper, 
              { backgroundColor: 'transparent' }
            ]}
            collapsable={false}
          >
            <POIMarker
              poi={f}
              theme={theme}
              isSelected={false}
              onPress={onPoiPress}
              zoomSharedValue={zoomSharedValue}
            />
          </View>
        </MapLibreGL.PointAnnotation>
      ))}

      <MapLibreGL.ShapeSource 
        id="eventsSource" 
        shape={eventMarkers}
        hitbox={{ width: 44, height: 44 }}
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

      {/* 2. SELECTED ITEM - Single native view for high-fidelity animations */}
      {selectedFeature && !selectedEventId && (
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
              { backgroundColor: 'transparent' }
            ]}
            collapsable={false}
          >
            <POIMarker
              poi={selectedFeature}
              theme={theme}
              isSelected={true}
              onPress={onPoiPress}
              zoomSharedValue={zoomSharedValue}
            />
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
      {(isNavigating || isPlanning) && currentRoute && (
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
