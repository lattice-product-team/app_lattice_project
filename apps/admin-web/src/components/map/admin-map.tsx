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

import { 
  Utensils, 
  Wine, 
  Baby, 
  Hospital, 
  LogIn, 
  Info, 
  AlertTriangle, 
  MapPin, 
  ShoppingBag,
  Ticket,
  Circle
} from 'lucide-react';

const POI_METADATA: Record<string, { icon: any; color: string }> = {
  wc: { icon: Baby, color: '#54A6FF' },
  restaurant: { icon: Utensils, color: '#F2A03D' },
  bar: { icon: Wine, color: '#F2A03D' },
  medical: { icon: Hospital, color: '#E5484D' },
  gate: { icon: LogIn, color: '#F8D548' },
  information: { icon: Info, color: '#D9B735' },
  emergency: { icon: AlertTriangle, color: '#E5484D' },
  parking: { icon: MapPin, color: '#54A6FF' },
  shop: { icon: ShoppingBag, color: '#4F46E5' },
  default: { icon: MapPin, color: '#F8D548' },
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
  onClick 
}: { 
  type: 'event' | 'poi'; 
  data: any; 
  isSelected?: boolean;
  onClick?: (data: any) => void;
}) => {
  const metadata = POI_METADATA[data.category] || POI_METADATA.default;
  const size = type === 'event' ? 'w-10 h-10' : 'w-8 h-8';
  const color = type === 'event' ? (data.primaryColor || '#F8D548') : metadata.color;
  const Icon = type === 'event' ? Ticket : metadata.icon;

  const coords = type === 'event' 
    ? (data.center?.coordinates || (data.boundary ? getCentroid(data.boundary.coordinates) : null))
    : data.geometry.coordinates;

  if (!coords) return null;

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
          <Icon size={type === 'event' ? 20 : 16} color="white" strokeWidth={2.5} />
        </div>
        
        {/* Label - visible on hover or if selected */}
        <div className={`mt-1 bg-obsidian text-eggshell text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-lg transition-all duration-200 whitespace-nowrap ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}>
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
}) => {
  const mapRef = React.useRef<any>(null);
  const [_internalViewState, setInternalViewState] = useState(initialViewState);

  React.useEffect(() => {
    if (activeEventBoundary?.geometry?.coordinates) {
      const bbox = getBBox(activeEventBoundary.geometry.coordinates);
      // Delay so the overlay animation (300ms) finishes before fitBounds,
      // ensuring the map container has its final size.
      const t = setTimeout(() => {
        mapRef.current?.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          { padding: 80, duration: 800, maxZoom: 17 }
        );
      }, 350);
      return () => clearTimeout(t);
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
              />
            ))}
            {pois.map((poi) => (
              <MapMarker 
                key={`poi-${poi.id}`} 
                type="poi" 
                data={poi} 
                onClick={onAssetClick} 
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

