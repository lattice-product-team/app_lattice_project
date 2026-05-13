'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Icons } from '@/components/icons';
import Map, {
  NavigationControl,
  Marker,
  Source,
  Layer,
  MapLayerMouseEvent,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// AdminMap component with integrated SVG icons
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
  radarData?: any;
}

const POI_METADATA: Record<string, { icon: any; color: string }> = {
  wc: { icon: Icons.Baby, color: '#54A6FF' },
  restaurant: { icon: Icons.Utensils, color: '#F2A03D' },
  bar: { icon: Icons.Wine, color: '#F2A03D' },
  medical: { icon: Icons.Hospital, color: '#E5484D' },
  gate: { icon: Icons.LogIn, color: '#F8D548' },
  information: { icon: Icons.Info, color: '#D9B735' },
  emergency: { icon: Icons.AlertTriangle, color: '#E5484D' },
  parking: { icon: Icons.MapPin, color: '#54A6FF' },
  shop: { icon: Icons.ShoppingBag, color: '#4F46E5' },
  default: { icon: Icons.MapPin, color: '#F8D548' },
};

const getBBox = (coords: any): [number, number, number, number] => {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  
  const process = (c: any) => {
    if (typeof c[0] === 'number') {
      minLng = Math.min(minLng, c[0]);
      minLat = Math.min(minLat, c[1]);
      maxLng = Math.max(maxLng, c[0]);
      maxLat = Math.max(maxLat, c[1]);
    } else {
      c.forEach(process);
    }
  };
  
  process(coords);
  return [minLng, minLat, maxLng, maxLat];
};

const isPointInPolygon = (point: [number, number], vs: [number, number][][]): boolean => {
  const x = point[0], y = point[1];
  let inside = false;
  // Use the first ring for simplicity
  const polygon = vs[0];
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const getCentroid = (coordinates: [number, number][][]): [number, number] => {
  let totalLng = 0;
  let totalLat = 0;
  let count = 0;
  for (const ring of coordinates) {
    for (const point of ring) {
      totalLng += point[0];
      totalLat += point[1];
      count++;
    }
  }
  return [totalLng / count, totalLat / count];
};

const MapMarker = React.memo(({ 
  type, 
  data, 
  isSelected, 
  onClick,
  currentZoom = 0
}: { 
  type: 'event' | 'poi'; 
  data: any; 
  isSelected?: boolean;
  onClick?: (data: any) => void;
  currentZoom?: number;
}) => {
  const metadata = POI_METADATA[data.category] || POI_METADATA.default;
  const size = type === 'event' ? 'w-10 h-10' : 'w-8 h-8';
  const color = type === 'event' ? (data.primaryColor || '#F8D548') : metadata.color;
  const Icon = type === 'event' ? Icons.Ticket : metadata.icon;

  const coords = type === 'event' 
    ? (data.center?.coordinates || (data.boundary ? getCentroid(data.boundary.coordinates) : null))
    : data.geometry.coordinates;

  if (!coords) return null;

  // Zoom Logic
  const ZOOM_SHOW_EVENTS = 11;
  const ZOOM_SHOW_POIS = 14.5;

  if (type === 'event' && currentZoom < ZOOM_SHOW_EVENTS) return null;
  if (type === 'poi' && currentZoom < ZOOM_SHOW_POIS) return null;

  return (
    <Marker
      longitude={coords[0]}
      latitude={coords[1]}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.(data);
      }}
    >
      <div className={`group relative cursor-pointer flex flex-col items-center`}>
        <div 
          className={`${size} rounded-full border-[2.5px] border-white shadow-md flex items-center justify-center transition-all duration-300 transform ${isSelected ? 'scale-125 ring-4 ring-white/30' : 'hover:scale-110'}`}
          style={{ backgroundColor: color }}
        >
          <Icon className={type === 'event' ? "w-5 h-5" : "w-4 h-4"} color="white" strokeWidth={2.5} />
        </div>
        
        {/* Label - visible on hover, if selected, or if it's an event and we are zoomed in */}
        <div className={`mt-1 bg-obsidian text-eggshell text-[10px] font-black uppercase py-1 px-3 rounded-full shadow-lg transition-all duration-300 whitespace-nowrap ${
          (isSelected || type === 'event') ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
        }`}>
          {data.name}
        </div>
      </div>
    </Marker>
  );
});

MapMarker.displayName = 'MapMarker';

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
  radarData,
}) => {
  const mapRef = React.useRef<any>(null);
  const [_internalViewState, setInternalViewState] = useState(initialViewState);
  const lastFittedBoundary = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (activeEventBoundary?.geometry?.coordinates) {
      const boundaryId = activeEventBoundary.properties?.isGlobalFit 
        ? 'global-fit' 
        : JSON.stringify(activeEventBoundary.geometry.coordinates);

      // Only fit if the boundary is different from the last one we fitted
      if (lastFittedBoundary.current === boundaryId) return;

      const bbox = getBBox(activeEventBoundary.geometry.coordinates);
      const t = setTimeout(() => {
        mapRef.current?.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          { 
            padding: { top: 100, bottom: 100, left: 380, right: 480 }, 
            duration: 1000, 
            maxZoom: 16 
          }
        );
        lastFittedBoundary.current = boundaryId;
      }, 350);
      return () => clearTimeout(t);
    } else if (initialViewState && !activeEventBoundary) {
      // Only fly to initial view if no boundary is being fitted
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
    activeEventBoundary,
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
          properties: { id: e.id, name: e.name?.toUpperCase(), color: e.primaryColor },
          geometry: e.boundary,
        })),
    } as any;
  }, [events]);

  const handleMapLoad = useCallback((e: any) => {
    const map = e.target;
    const style = map.getStyle();
    if (!style || !style.layers) return;

    style.layers.forEach((layer: any) => {
      const isNativePOI =
        layer.id.includes('poi') ||
        layer.id.includes('place') ||
        layer.id.includes('transit') ||
        layer.id.includes('transport') ||
        layer.id.includes('station') ||
        layer.id.includes('rail') ||
        layer.id.includes('infrastructure');

      if (isNativePOI) {
        map.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });
  }, []);

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        onMoveEnd={(evt) => setInternalViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
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
            <Layer
              id="global-boundaries-labels"
              type="symbol"
              minzoom={11}
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Bold'],
                'text-size': 10,
                'text-letter-spacing': 0.2,
                'text-transform': 'uppercase',
                'text-anchor': 'center',
                'text-allow-overlap': false,
              }}
              paint={{
                'text-color': ['get', 'color'],
                'text-halo-color': '#fff',
                'text-halo-width': 2,
              }}
            />
          </Source>
        )}

        {radarData && (
          <Source type="geojson" data={radarData}>
            <Layer
              id="radar-heatmap"
              type="heatmap"
              maxzoom={18}
              paint={{
                // Increase the heatmap weight based on frequency and property magnitude
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
                // Increase the heatmap color weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 3],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparency color
                // to create a blur-like effect.
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.6,
                  'rgb(253,219,199)',
                  0.8,
                  'rgb(239,138,98)',
                  1,
                  'rgb(178,24,43)',
                ],
                // Adjust the heatmap radius by zoom level
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 18, 20],
                // Transition from heatmap to circle layer by zoom level
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 18, 0],
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

        {/* Markers */}
        {mode === 'GLOBAL_VIEW' && (
          <>
            {events.map((event) => (
              <MapMarker 
                key={`event-${event.id}`} 
                type="event" 
                data={event} 
                onClick={onAssetClick}
                currentZoom={_internalViewState.zoom}
              />
            ))}
            {pois.map((poi) => (
              <MapMarker 
                key={`poi-${poi.id}`} 
                type="poi" 
                data={poi} 
                onClick={onAssetClick}
                currentZoom={_internalViewState.zoom}
              />
            ))}
          </>
        )}

        {/* Selected POI Marker (New POI creation mode) */}
        {mode === 'PICK_COORDINATE' && selectedPoi && (
          <Marker longitude={selectedPoi.lng} latitude={selectedPoi.lat} anchor="bottom">
            <div className="w-10 h-10 bg-obsidian rounded-full border-[2.5px] border-white shadow-massive flex items-center justify-center animate-bounce">
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

