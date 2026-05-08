'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Map, {
  NavigationControl,
  Marker,
  Source,
  Layer,
  MapLayerMouseEvent,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_KEY = 'iqk4irD5FCOr6M6VHVWZ';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

export type InteractionMode = 'GLOBAL_VIEW' | 'DRAW_BOUNDARY' | 'PICK_COORDINATE';

interface AdminMapProps {
  mode: InteractionMode;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  events?: any[];
  pois?: any[];
  boundaryPoints?: [number, number][];
  onBoundaryChange?: (points: [number, number][]) => void;
  selectedPoi?: { lng: number; lat: number } | null;
  onPoiSelect?: (coords: { lng: number; lat: number }) => void;
  onAssetClick?: (asset: any) => void;
  activeEventBoundary?: any;
}

const POI_TYPES: Record<string, string> = {
  wc: '🚽',
  restaurant: '🍔',
  bar: '🍺',
  medical: '🏥',
  gate: '🚪',
  information: 'ℹ️',
  emergency: '🚨',
  parking: '🅿️',
  shop: '🛍️',
};

const isPointInPolygon = (point: [number, number], polygon: [number, number][][]) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++) {
    const xi = polygon[0][i][0],
      yi = polygon[0][i][1];
    const xj = polygon[0][j][0],
      yj = polygon[0][j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const getBBox = (coordinates: [number, number][][]) => {
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;
  for (const ring of coordinates) {
    for (const point of ring) {
      if (point[0] < minLng) minLng = point[0];
      if (point[0] > maxLng) maxLng = point[0];
      if (point[1] < minLat) minLat = point[1];
      if (point[1] > maxLat) maxLat = point[1];
    }
  }
  return [minLng, minLat, maxLng, maxLat] as [number, number, number, number];
};

const DEFAULT_VIEW_STATE = { longitude: 2.2575, latitude: 41.5641, zoom: 15 };

const POIMarkers = React.memo(({ pois, onAssetClick }: { pois: any[]; onAssetClick?: (asset: any) => void }) => {
  return (
    <>
      {pois.map((poi: any) => (
        <Marker
          key={poi.id}
          longitude={poi.geometry.coordinates[0]}
          latitude={poi.geometry.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onAssetClick?.(poi);
          }}
        >
          <div className="group relative cursor-pointer">
            <div className="bg-obsidian text-eggshell p-2 rounded-full shadow-hairline border border-chalk transform transition-all hover:scale-110">
              <span className="text-sm">{POI_TYPES[poi.category] || '📍'}</span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-obsidian text-eggshell text-[10px] font-bold uppercase py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {poi.name}
            </div>
          </div>
        </Marker>
      ))}
    </>
  );
});

POIMarkers.displayName = 'POIMarkers';

export const AdminMap: React.FC<AdminMapProps> = ({
  mode,
  initialViewState = DEFAULT_VIEW_STATE,
  events = [],
  pois = [],
  boundaryPoints = [],
  onBoundaryChange,
  selectedPoi,
  onPoiSelect,
  onAssetClick,
  activeEventBoundary,
}) => {
  const mapRef = React.useRef<any>(null);
  const [_internalViewState, setInternalViewState] = useState(initialViewState);

  React.useEffect(() => {
    if (activeEventBoundary?.geometry?.coordinates) {
      const bbox = getBBox(activeEventBoundary.geometry.coordinates);
      mapRef.current?.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: 40, duration: 1000 }
      );
    } else if (initialViewState) {
      mapRef.current?.flyTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        duration: 1000,
      });
    }
  }, [
    initialViewState.longitude,
    initialViewState.latitude,
    initialViewState.zoom,
    activeEventBoundary?.geometry,
  ]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (mode === 'DRAW_BOUNDARY' && onBoundaryChange) {
        onBoundaryChange([...boundaryPoints, [lng, lat]]);
      } else if (mode === 'PICK_COORDINATE' && onPoiSelect) {
        if (activeEventBoundary?.geometry?.coordinates) {
          const isInside = isPointInPolygon([lng, lat], activeEventBoundary.geometry.coordinates);
          if (!isInside) {
            console.warn('Click outside event boundary');
            return;
          }
        }
        onPoiSelect({ lng, lat });
      }
    },
    [mode, boundaryPoints, onBoundaryChange, onPoiSelect, activeEventBoundary]
  );

  const boundaryGeoJSON = useMemo(() => {
    if (boundaryPoints.length < 3) return null;
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...boundaryPoints, boundaryPoints[0]]],
      },
    } as any;
  }, [boundaryPoints]);

  const allBoundariesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: events
        .filter((e) => e.boundary)
        .map((e) => ({
          type: 'Feature',
          properties: { id: e.id, name: e.name, color: e.primaryColor },
          geometry: e.boundary,
        })),
    } as any;
  }, [events]);

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        onMoveEnd={(evt) => setInternalViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {mode === 'GLOBAL_VIEW' && (
          <Source type="geojson" data={allBoundariesGeoJSON}>
            <Layer
              id="global-boundaries-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.1,
              }}
            />
            <Layer
              id="global-boundaries-outline"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
              }}
            />
          </Source>
        )}

        {mode === 'PICK_COORDINATE' && activeEventBoundary && (
          <Source type="geojson" data={activeEventBoundary}>
            <Layer
              id="context-boundary-fill"
              type="fill"
              paint={{ 'fill-color': '#000', 'fill-opacity': 0.05 }}
            />
            <Layer
              id="context-boundary-outline"
              type="line"
              paint={{ 'line-color': '#000', 'line-width': 1, 'line-dasharray': [2, 2] }}
            />
          </Source>
        )}

        {mode === 'DRAW_BOUNDARY' && boundaryGeoJSON && (
          <Source type="geojson" data={boundaryGeoJSON}>
            <Layer
              id="current-boundary-fill"
              type="fill"
              paint={{ 'fill-color': '#000', 'fill-opacity': 0.1 }}
            />
            <Layer
              id="current-boundary-outline"
              type="line"
              paint={{ 'line-color': '#000', 'line-width': 2 }}
            />
          </Source>
        )}

        {/* Global POIs */}
        {mode === 'GLOBAL_VIEW' && (
          <POIMarkers pois={pois} onAssetClick={onAssetClick} />
        )}

        {/* Selected POI Marker */}
        {mode === 'PICK_COORDINATE' && selectedPoi && (
          <Marker longitude={selectedPoi.lng} latitude={selectedPoi.lat} anchor="bottom">
            <div className="bg-obsidian text-eggshell p-2.5 rounded-full shadow-hairline border border-chalk animate-bounce">
              <span className="text-xl">📍</span>
            </div>
          </Marker>
        )}

        {/* Boundary Control Points */}
        {mode === 'DRAW_BOUNDARY' &&
          boundaryPoints.map((point, i) => (
            <Marker key={`bp-${i}`} longitude={point[0]} latitude={point[1]}>
              <div className="w-3 h-3 bg-white rounded-full border-2 border-obsidian shadow-hairline" />
            </Marker>
          ))}
      </Map>
    </div>
  );
};
