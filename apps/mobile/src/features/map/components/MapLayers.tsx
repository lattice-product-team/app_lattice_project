import React, { useMemo, useState } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { View, Platform } from 'react-native';
import { SharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
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
  islandState: SharedValue<number>;
  visibleBounds: number[][] | null;
}

/***
 * Sub-component for Route to isolate re-renders.
 */
const RouteLayer = React.memo(
  ({
    uiState,
    currentRoute,
    isDrawerOpen,
  }: {
    uiState: MapUIState;
    currentRoute: any;
    isDrawerOpen: boolean;
  }) => {
    const routeGeoJSON = useMemo(() => {
      if (!currentRoute) return EMPTY_GEOJSON;
      if (currentRoute.type === 'FeatureCollection') return currentRoute;
      return { type: 'FeatureCollection', features: [currentRoute] };
    }, [currentRoute]);

    const isVisible =
      (uiState === MapUIState.NAVIGATING || uiState === MapUIState.PLANNING) && !!currentRoute;

    if (!isVisible) return null;

    return (
      <MapLibreGL.ShapeSource id="routeSource" shape={routeGeoJSON} tolerance={0.1}>
        <MapLibreGL.LineLayer
          id="routeGlow"
          style={{ ...mapLayerStyles.routeGlow, lineBlur: 6, lineOpacity: 0.3 }}
        />
        <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
      </MapLibreGL.ShapeSource>
    );
  }
);

/***
 * Sub-component for the Selected Feature (POI or Event)
 * This is the ONLY React Native PointAnnotation rendered on the map,
 * allowing for complex animations without killing performance.
 */
const SelectedMarker = React.memo(
  ({
    poisGeoJSON,
    eventsGeoJSON,
    selectedPoiId,
    selectedEventId,
    onPoiPress,
    theme,
    zoomSharedValue,
  }: {
    poisGeoJSON: any;
    eventsGeoJSON: any;
    selectedPoiId: any;
    selectedEventId: any;
    onPoiPress: any;
    theme: any;
    zoomSharedValue: any;
  }) => {
    const selectedFeature = useMemo(() => {
      if (selectedPoiId) {
        return poisGeoJSON?.features?.find(
          (f: any) => String(f.properties?.id) === String(selectedPoiId)
        );
      }
      return null;
    }, [selectedPoiId, poisGeoJSON]);

    //STRICT GUARD: If we have an event selected, we NEVER show the React pin.
    if (selectedEventId && String(selectedEventId).length > 0) return null;

    if (!selectedFeature) return null;

    return (
      <MapLibreGL.PointAnnotation
        key={`selected-${selectedPoiId}`}
        id="selected-annotation"
        coordinate={selectedFeature.geometry.coordinates}
        style={{ zIndex: 1000 }}
      >
        <View
          style={[mapPinStyles.markerWrapper, { backgroundColor: 'transparent' }]}
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
    );
  }
);

export const MapLayers = React.memo(
  ({
    theme,
    poisGeoJSON,
    eventsGeoJSON,
    selectedEventId,
    selectedPoiId,
    currentRoute,
    uiState,
    onPoiPress,
    zoomLevel,
    zoomSharedValue,
    islandState,
    visibleBounds,
  }: MapLayersProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //High-performance drawer state sync
    useAnimatedReaction(
      () => {
        'worklet';
        return islandState ? islandState.value > 0.1 : false;
      },
      (isOpen: boolean) => {
        if (isOpen !== isDrawerOpen) {
          runOnJS(setIsDrawerOpen)(isOpen);
        }
      },
      [isDrawerOpen, islandState]
    );

    const eventMarkers = useMemo(() => {
      const markers: any[] = [];
      eventsGeoJSON?.features?.forEach((f: any) => {
        if (f.geometry.type === 'Point') markers.push(f);
      });
      return { type: 'FeatureCollection', features: markers };
    }, [eventsGeoJSON]);

    const backgroundPois = useMemo(
      () => ({
        type: 'FeatureCollection',
        features: poisGeoJSON?.features || [],
      }),
      [poisGeoJSON]
    );

    const handleShapePress = (e: any) => {
      const feature = e.features[0];
      if (!feature) return;

      //Ignore cluster taps
      if (feature.properties?.point_count) return;

      //Trigger press for valid POIs or Events
      if (feature.properties?.id || feature.properties?.name) {
        onPoiPress(feature);
      }
    };

    const backgroundEvents = useMemo(() => {
      const features = eventMarkers.features.filter(
        (f) => String(f.properties?.id) !== String(selectedEventId)
      );
      return { type: 'FeatureCollection', features };
    }, [eventMarkers, selectedEventId]);

    const selectedEventFeature = useMemo(() => {
      const feature = eventMarkers.features.find(
        (f) => String(f.properties?.id) === String(selectedEventId)
      );
      return feature ? { type: 'FeatureCollection', features: [feature] } : EMPTY_GEOJSON;
    }, [eventMarkers, selectedEventId]);

    return (
      <>
        {/*1. Background Sources*/}
        <MapLibreGL.ShapeSource
          id="poiSource"
          shape={backgroundPois}
          onPress={handleShapePress}
          cluster={false}
        >
          {/*SHADOW: Sincronizada con el círculo*/}
          <MapLibreGL.CircleLayer
            id="poiShadows"
            filter={['all', ['!=', ['to-string', ['get', 'id']], String(selectedPoiId || '')]]}
            minZoomLevel={12}
            style={{
              circleRadius: ['interpolate', ['linear'], ['zoom'], 12, 6, 15, 18, 18, 24],
              circleColor: '#000000',
              circleOpacity: 0.15,
              circleBlur: 0.8,
              circleTranslate: [0, 2],
            }}
          />

          {/*PLATE: Círculo base coloreado*/}
          <MapLibreGL.CircleLayer
            id="backgroundPoiDots"
            aboveLayerID="poiShadows"
            filter={['all', ['!=', ['to-string', ['get', 'id']], String(selectedPoiId || '')]]}
            minZoomLevel={12}
            style={{
              circleRadius: [
                'interpolate',
                ['linear'],
                ['zoom'],
                12,
                5,
                15,
                16, //More generous to give the icon breathing room
                18,
                22,
              ],
              circleColor: [
                'coalesce',
                ['get', 'color_hex'],
                theme.colors.brand.primary,
                '#5856D6',
              ],
              circleStrokeWidth: 2,
              circleStrokeColor: '#FFFFFF',
              circleOpacity: ['interpolate', ['linear'], ['zoom'], 11.5, 0, 12, 1, 22, 1],
            }}
          />

          {/*GLYPH: Icono blanco - Sincronizado milimétricamente con el círculo*/}
          <MapLibreGL.SymbolLayer
            id="poiIconsLayer"
            filter={['all', ['!=', ['to-string', ['get', 'id']], String(selectedPoiId || '')]]}
            minZoomLevel={12} //Appears same as the circle
            style={{
              iconImage: ['get', 'icon_name'],
              iconColor: '#FFFFFF',
              iconAnchor: 'center',
              iconSize: ['interpolate', ['linear'], ['zoom'], 12, 0.1, 15, 0.35, 18, 0.5],
              iconAllowOverlap: true,
              iconIgnorePlacement: true,
              iconOpacity: ['interpolate', ['linear'], ['zoom'], 11.5, 0, 12, 1, 22, 1],
              //Text with halo
              textField: ['get', 'display_name'],
              textSize: 11,
              textColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary, '#5856D6'],
              textHaloColor: '#FFFFFF',
              textHaloWidth: 2,
              textAnchor: 'top',
              textOffset: [0, 1.6],
              textOpacity: ['interpolate', ['linear'], ['zoom'], 16.5, 0, 17, 1],
              textAllowOverlap: true,
            }}
          />
        </MapLibreGL.ShapeSource>

        <MapLibreGL.ShapeSource
          id="eventsBackgroundSource"
          shape={backgroundEvents as any}
          hitbox={{ width: 44, height: 44 }}
          onPress={handleShapePress}
        >
          <MapLibreGL.SymbolLayer
            id="eventLabelsBackground"
            filter={['!=', ['to-string', ['get', 'id']], String(selectedEventId || '')]}
            style={{
              textField: ['get', 'display_name'],
              textSize: ['interpolate', ['linear'], ['zoom'], 10, 16, 14, 22],
              textColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary, '#5856D6'],
              textHaloColor: '#FFFFFF',
              textHaloWidth: 2.5,
              textAnchor: 'center',
              textOpacity: ['interpolate', ['linear'], ['zoom'], 9, 0, 10, 1, 16, 1, 17, 0],
              textTransform: 'uppercase',
              textLetterSpacing: 0.1,
              textAllowOverlap: true,
              textIgnorePlacement: true,
            }}
          />
        </MapLibreGL.ShapeSource>

        <MapLibreGL.ShapeSource
          id="eventsSelectedSource"
          shape={selectedEventFeature as any}
          onPress={handleShapePress}
        >
          <MapLibreGL.SymbolLayer
            id="eventLabelSelected"
            style={{
              textField: ['get', 'display_name'],
              textSize: 20,
              textColor: ['coalesce', ['get', 'color_hex'], theme.colors.brand.primary, '#5856D6'],
              textHaloColor: '#FFFFFF',
              textHaloWidth: 3,
              textAnchor: 'center',
              textOpacity: 1,
              textTransform: 'uppercase',
              textLetterSpacing: 0.2,
            }}
          />
        </MapLibreGL.ShapeSource>

        {/*2. HYBRID SELECTION - Single React Component for the focus*/}
        <SelectedMarker
          poisGeoJSON={poisGeoJSON}
          eventsGeoJSON={eventsGeoJSON}
          selectedPoiId={selectedPoiId}
          selectedEventId={selectedEventId}
          onPoiPress={onPoiPress}
          theme={theme}
          zoomSharedValue={zoomSharedValue}
        />

        {/*3. ROUTE - Isolated from POI re-renders*/}
        <RouteLayer uiState={uiState} currentRoute={currentRoute} isDrawerOpen={isDrawerOpen} />
      </>
    );
  }
);

MapLayers.displayName = 'MapLayers';
RouteLayer.displayName = 'RouteLayer';
SelectedMarker.displayName = 'SelectedMarker';
