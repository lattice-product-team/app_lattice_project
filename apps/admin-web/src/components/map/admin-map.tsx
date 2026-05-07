'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Map, { NavigationControl, Marker, Source, Layer, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Icons } from "@/components/icons";

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
  selectedPoi?: { lng: number, lat: number } | null;
  onPoiSelect?: (coords: { lng: number, lat: number }) => void;
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

export const AdminMap: React.FC<AdminMapProps> = ({
  mode,
  initialViewState = { longitude: 2.2575, latitude: 41.5641, zoom: 15 },
  events = [],
  pois = [],
  boundaryPoints = [],
  onBoundaryChange,
  selectedPoi,
  onPoiSelect,
  onAssetClick,
  activeEventBoundary
}) => {
  const [viewState, setViewState] = useState(initialViewState);

  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const { lng, lat } = e.lngLat;

    if (mode === 'DRAW_BOUNDARY' && onBoundaryChange) {
      onBoundaryChange([...boundaryPoints, [lng, lat]]);
    } else if (mode === 'PICK_COORDINATE' && onPoiSelect) {
      onPoiSelect({ lng, lat });
    }
  }, [mode, boundaryPoints, onBoundaryChange, onPoiSelect]);

  const boundaryGeoJSON = useMemo(() => {
    if (boundaryPoints.length < 3) return null;
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...boundaryPoints, boundaryPoints[0]]]
      }
    } as any;
  }, [boundaryPoints]);

  const allBoundariesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: events
        .filter(e => e.boundary)
        .map(e => ({
          type: 'Feature',
          properties: { id: e.id, name: e.name, color: e.primaryColor },
          geometry: e.boundary
        }))
    } as any;
  }, [events]);

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {/* Global Boundaries */}
        {mode === 'GLOBAL_VIEW' && (
          <Source type="geojson" data={allBoundariesGeoJSON}>
            <Layer
              id="global-boundaries-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.1
              }}
            />
            <Layer
              id="global-boundaries-outline"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2
              }}
            />
          </Source>
        )}

        {/* Contextual Boundary for POI selection */}
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

        {/* Current Boundary being drawn */}
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
        {mode === 'GLOBAL_VIEW' && pois.map((poi: any) => (
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

        {/* Selected POI Marker */}
        {mode === 'PICK_COORDINATE' && selectedPoi && (
          <Marker
            longitude={selectedPoi.lng}
            latitude={selectedPoi.lat}
            anchor="bottom"
          >
            <div className="bg-obsidian text-eggshell p-2.5 rounded-full shadow-hairline border border-chalk animate-bounce">
              <span className="text-xl">📍</span>
            </div>
          </Marker>
        )}

        {/* Boundary Control Points */}
        {mode === 'DRAW_BOUNDARY' && boundaryPoints.map((point, i) => (
          <Marker key={`bp-${i}`} longitude={point[0]} latitude={point[1]}>
            <div className="w-3 h-3 bg-white rounded-full border-2 border-obsidian shadow-hairline" />
          </Marker>
        ))}
      </Map>
    </div>
  );
};
