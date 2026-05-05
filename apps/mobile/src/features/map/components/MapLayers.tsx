import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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
      {/* 1. EVENTS LAYER (NATIVE ANNOTATIONS FOR CIRCULAR CLIPPING) */}
      {eventsGeoJSON?.features?.map((feature: any) => {
        const { id, properties, geometry } = feature;
        const isSelected = selectedEventId === id;
        const color = properties.color || theme.colors.primary;
        
        return (
          <MapLibreGL.PointAnnotation
            key={id}
            id={`event-ann-${id}`}
            coordinate={geometry.coordinates}
            onSelected={() => onPoiPress(feature)}
          >
            <View style={[
              styles.eventPinContainer,
              { transform: [{ scale: isSelected ? 1.3 : 1 }] }
            ]}>
              {/* Shadow */}
              <View style={styles.eventPinShadow} />
              
              {/* Main Body */}
              <View style={[styles.eventPinBody, { borderColor: color }]}>
                {properties.imageKey && properties.imageKey !== 'placeholder-event' ? (
                  <Image 
                    source={{ uri: properties.imageKey.startsWith('event-img-') ? eventsGeoJSON.features.find((f: any) => f.id === id).properties.imageUrl || '' : '' }} 
                    style={styles.eventPinImage}
                    // Since we don't have imageUrl in properties directly yet, let's ensure it's there
                  />
                ) : (
                  <View style={[styles.eventPinPlaceholder, { backgroundColor: color }]}>
                    <Text style={styles.eventPinPlaceholderText}>{properties.name?.charAt(0)}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Label (Optional: only if selected or at high zoom) */}
            <MapLibreGL.Callout title={properties.name} />
          </MapLibreGL.PointAnnotation>
        );
      })}

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

const styles = StyleSheet.create({
  eventPinContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventPinShadow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    opacity: 0.15,
    transform: [{ translateY: 2 }],
  },
  eventPinBody: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventPinImage: {
    width: '100%',
    height: '100%',
  },
  eventPinPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventPinPlaceholderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
