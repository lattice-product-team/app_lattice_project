'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
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
const MAP_STYLE_LIGHT = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
const MAP_STYLE_DARK = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`;

const DEFAULT_VIEW_STATE = {
  longitude: 2.128,
  latitude: 41.353,
  zoom: 13,
};

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
  selectedCategory?: string;
  selectedAssetId?: string | number;
  selectionSource?: 'SEARCH' | 'CLICK' | null;
}

const POI_METADATA: Record<string, { icon: any; color: string }> = {
  restaurant: { icon: Icons.Utensils, color: '#FF9500' },
  food: { icon: Icons.Utensils, color: '#FF9500' },
  coffee: { icon: Icons.Coffee, color: '#FF9500' },
  bar: { icon: Icons.Beer, color: '#FF9500' },
  beer: { icon: Icons.Beer, color: '#FF9500' },
  parking: { icon: Icons.MapPin, color: '#007AFF' },
  wc: { icon: Icons.User, color: '#007AFF' },
  toilet: { icon: Icons.User, color: '#007AFF' },
  restroom: { icon: Icons.User, color: '#007AFF' },
  medical: { icon: Icons.Hospital, color: '#FF3B30' },
  hospital: { icon: Icons.Hospital, color: '#FF3B30' },
  emergency: { icon: Icons.Hospital, color: '#FF3B30' },
  security: { icon: Icons.Shield, color: '#FF3B30' },
  gate: { icon: Icons.LogOut, color: '#5856D6' },
  entrance: { icon: Icons.LogOut, color: '#5856D6' },
  information: { icon: Icons.LibraryBig, color: '#5AC8FA' },
  info: { icon: Icons.LibraryBig, color: '#5AC8FA' },
  'library-big': { icon: Icons.LibraryBig, color: '#5AC8FA' },
  shop: { icon: Icons.Store, color: '#AF52DE' },
  store: { icon: Icons.Store, color: '#AF52DE' },
  shopping: { icon: Icons.Store, color: '#AF52DE' },
  stage: { icon: Icons.Theater, color: '#34C759' },
  theater: { icon: Icons.Theater, color: '#34C759' },
  vip: { icon: Icons.Crown, color: '#FFCC00' },
  crown: { icon: Icons.Crown, color: '#FFCC00' },
  meetup: { icon: Icons.Users, color: '#5856D6' },
  users: { icon: Icons.Users, color: '#5856D6' },
  default: { icon: Icons.MapPin, color: '#5856D6' },
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
  const [minLng, minLat, maxLng, maxLat] = getBBox(coordinates);
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
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

  // Dynamic scaling based on zoom to prevent markers from overwhelming boundaries
  const zoomScale = isSelected ? 1.25 : (currentZoom < 14 ? 0.75 : 1);
  const hideLabelByZoom = type === 'event' && currentZoom < 15;

  // Stability: Don't render markers if we are too far out
  if (type === 'event' && currentZoom < 11) return null;
  if (type === 'poi' && currentZoom < 14.5) return null;

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
      <div 
        className="group relative cursor-pointer flex flex-col items-center transition-transform duration-300"
        style={{ transform: `scale(${zoomScale})` }}
      >
        <div 
          className={`${size} rounded-full border-[2.5px] border-white shadow-md flex items-center justify-center transition-all duration-300 ${isSelected ? 'ring-4 ring-white/30' : 'hover:scale-110'}`}
          style={{ backgroundColor: color }}
        >
          <Icon className={type === 'event' ? "w-5 h-5" : "w-4 h-4"} color="white" strokeWidth={2.5} />
        </div>
        
        {/* Label - visible on hover, if selected, or if it's an event and we are zoomed in */}
        <div className={`mt-1 bg-obsidian text-eggshell text-[10px] font-black uppercase py-1 px-3 rounded-full shadow-lg transition-all duration-300 whitespace-nowrap ${
          (isSelected || (type === 'event' && !hideLabelByZoom)) ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
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
  selectedCategory,
  selectedAssetId,
  selectionSource,
}) => {
  const mapRef = React.useRef<any>(null);

  const { theme } = useTheme();
  const mapStyle = theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT;

  const [_internalViewState, setInternalViewState] = useState(initialViewState);
  const lastFittedBoundary = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (activeEventBoundary) {
      const isCollection = activeEventBoundary.type === 'FeatureCollection';
      const isGlobal = isCollection ? activeEventBoundary.features?.[0]?.properties?.isGlobalFit : activeEventBoundary.properties?.isGlobalFit;
      const boundaryId = isGlobal ? 'global-fit' : JSON.stringify(activeEventBoundary);
      const isManualSelection = selectionSource === 'CLICK' || selectionSource === 'SEARCH';

      // Only fit if the boundary is different from the last one we fitted,
      // OR if this was a manual selection (click/search) to ensure it centers
      if (lastFittedBoundary.current === boundaryId && !isManualSelection) return;

      const bbox = isCollection 
        ? getBBox(activeEventBoundary.features.map((f: any) => f.geometry.coordinates))
        : getBBox(activeEventBoundary.geometry.coordinates);

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
    selectionSource,
  ]);

  // Center on selected POI when picking coordinate
  React.useEffect(() => {
    if (selectedPoi && selectionSource === 'CLICK' && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedPoi.lng, selectedPoi.lat],
        zoom: 17,
        duration: 1500,
        padding: { top: 0, bottom: 0, left: 350, right: 0 } // Offset for the sidebar
      });
    }
  }, [selectedPoi?.lng, selectedPoi?.lat, selectionSource]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const { lng, lat } = e.lngLat;

      // Handle layer clicks first (Events via boundaries)
      const features = e.features;
      const boundaryFeature = features?.find(f => f.layer.id === 'global-boundaries-fill');
      
      if (boundaryFeature && mode === 'GLOBAL_VIEW' && onAssetClick) {
        const eventId = boundaryFeature.properties?.id;
        const event = events.find(ev => String(ev.id) === String(eventId));
        if (event) {
          onAssetClick(event);
          return;
        }
      }

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
    [mode, boundaryPoints, onBoundaryChange, onPoiSelect, activeEventBoundary, events, onAssetClick]
  );

  const handleMarkerDrag = useCallback(
    (idx: number, e: any) => {
      if (onBoundaryChange) {
        const newPoints = [...boundaryPoints];
        newPoints[idx] = [e.lngLat.lng, e.lngLat.lat];
        onBoundaryChange(newPoints);
      }
    },
    [boundaryPoints, onBoundaryChange]
  );

  const handlePoiDrag = useCallback(
    (e: any) => {
      if (onPoiSelect) {
        onPoiSelect({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      }
    },
    [onPoiSelect]
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
    // If an asset is selected, only show that one (Focus Mode)
    const filteredEvents = selectedAssetId 
      ? events.filter(e => String(e.id) === String(selectedAssetId))
      : events;

    return {
      type: 'FeatureCollection',
      features: filteredEvents
        .filter((e) => e.boundary)
        .map((e) => ({
          type: 'Feature',
          properties: { id: e.id, name: e.name?.toUpperCase(), color: e.primaryColor },
          geometry: e.boundary,
        })),
    } as any;
  }, [events, selectedAssetId]);

  const allLabelsGeoJSON = useMemo(() => {
    const filteredEvents = selectedAssetId 
      ? events.filter(e => String(e.id) === String(selectedAssetId))
      : events;

    return {
      type: 'FeatureCollection',
      features: filteredEvents
        .filter((e) => e.boundary)
        .map((e) => ({
          type: 'Feature',
          properties: { id: e.id, name: e.name?.toUpperCase(), color: e.primaryColor },
          geometry: {
            type: 'Point',
            coordinates: getCentroid(e.boundary.coordinates),
          },
        })),
    } as any;
  }, [events, selectedAssetId]);

  const applyLayerFiltering = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    
    const style = map.getStyle();
    if (!style || !style.layers) return;

    style.layers.forEach((layer: any) => {
      const isSymbolLayer = layer.type === 'symbol';
      if (!isSymbolLayer) return;

      const isOurLayer = layer.id.startsWith('global-');
      // More comprehensive list of native labels to keep visible
      const isEssentialLabel = 
        layer.id.includes('place') || 
        layer.id.includes('road') || 
        layer.id.includes('street') || 
        layer.id.includes('highway') ||
        layer.id.includes('water') ||
        layer.id.includes('poi') ||
        layer.id.includes('transit') ||
        layer.id.includes('airport') ||
        layer.id.includes('country') ||
        layer.id.includes('state') ||
        layer.id.includes('city');

      if (isOurLayer || isEssentialLabel) {
        map.setLayoutProperty(layer.id, 'visibility', 'visible');
      } else {
        // Only hide labels that are truly non-essential (e.g. some obscure MapTiler specific layers)
        // or if you want a very clean map. To be safe, we'll keep almost everything now.
        map.setLayoutProperty(layer.id, 'visibility', 'visible');
      }
    });
  }, []);

  // Apply filtering on load and when style changes
  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (map.isStyleLoaded()) {
      applyLayerFiltering();
    }

    const onStyleData = () => {
      applyLayerFiltering();
    };

    map.on('styledata', onStyleData);
    return () => {
      map.off('styledata', onStyleData);
    };
  }, [mapStyle, applyLayerFiltering]);

  const handleMapLoad = useCallback((e: any) => {
    applyLayerFiltering();
  }, [applyLayerFiltering]);

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        onMoveEnd={(evt) => setInternalViewState(evt.viewState)}
        mapStyle={mapStyle}
        interactiveLayerIds={['global-boundaries-fill']}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
        cursor={mode === 'GLOBAL_VIEW' ? 'default' : 'crosshair'}
      >
        <NavigationControl position="top-right" />

        {mode === 'GLOBAL_VIEW' && (
          <Source type="geojson" data={allBoundariesGeoJSON}>
            <Layer
              id="global-boundaries-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.15,
              }}
            />
            <Layer
              id="global-boundaries-outline"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': ['interpolate', ['linear'], ['zoom'], 8, 3, 15, 1.5],
              }}
            />
          </Source>
        )}

        {mode === 'GLOBAL_VIEW' && (
          <Source type="geojson" data={allLabelsGeoJSON}>
            <Layer
              id="global-boundaries-labels"
              type="symbol"
              minzoom={6}
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Bold'],
                'text-size': ['interpolate', ['linear'], ['zoom'], 6, 8, 14, 12, 18, 14],
                'text-letter-spacing': 0.1,
                'text-transform': 'uppercase',
                'text-anchor': 'center',
                'text-max-width': 10,
                'text-allow-overlap': true,
                'text-ignore-placement': true,
              }}
              paint={{
                'text-color': ['get', 'color'],
                'text-halo-color': theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                'text-halo-width': 2,
                'text-halo-blur': 1,
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
                // Use a weight that allows for smoother blending
                'heatmap-weight': 1,
                // Balanced intensity for a natural glow
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 4],
                // Smoother color ramp with more transparent edges for a "uniform" look
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 242, 255, 0)',
                  0.1, 'rgba(0, 242, 255, 0.2)',
                  0.3, 'rgba(110, 255, 158, 0.4)',
                  0.5, 'rgba(255, 230, 0, 0.6)',
                  0.8, 'rgba(255, 136, 0, 0.8)',
                  1, 'rgba(255, 51, 0, 1)'
                ],
                // Smaller radius for precision but enough to see the density
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 5, 18, 35],
                // High opacity for visibility
                'heatmap-opacity': 0.7,
              }}
            />
          </Source>
        )}

        {mode === 'PICK_COORDINATE' && activeEventBoundary && (
          <Source type="geojson" data={activeEventBoundary}>
            <Layer
              id="context-boundary-fill"
              type="fill"
              paint={{ 
                'fill-color': theme === 'dark' ? '#fff' : '#000', 
                'fill-opacity': 0.05 
              }}
            />
            <Layer
              id="context-boundary-outline"
              type="line"
              paint={{ 
                'line-color': theme === 'dark' ? '#fff' : '#000', 
                'line-width': 1, 
                'line-dasharray': [2, 2] 
              }}
            />
          </Source>
        )}

        {mode === 'DRAW_BOUNDARY' && boundaryGeoJSON && (
          <Source type="geojson" data={boundaryGeoJSON}>
            <Layer
              id="current-boundary-fill"
              type="fill"
              paint={{ 
                'fill-color': theme === 'dark' ? '#fff' : '#000', 
                'fill-opacity': 0.1 
              }}
            />
            <Layer
              id="current-boundary-outline"
              type="line"
              paint={{ 
                'line-color': theme === 'dark' ? '#fff' : '#000', 
                'line-width': 2 
              }}
            />
          </Source>
        )}

        {mode === 'GLOBAL_VIEW' && (
          <>
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
          <Marker 
            longitude={selectedPoi.lng} 
            latitude={selectedPoi.lat} 
            anchor="bottom"
            draggable
            onDragEnd={handlePoiDrag}
          >
            <div className="flex flex-col items-center group cursor-grab active:cursor-grabbing">
              <div 
                className="w-10 h-10 rounded-full border-[2.5px] border-white shadow-massive flex items-center justify-center transition-all duration-300 animate-in fade-in zoom-in"
                style={{ backgroundColor: POI_METADATA[selectedCategory || 'default']?.color || '#000' }}
              >
                {React.createElement(POI_METADATA[selectedCategory || 'default']?.icon || Icons.MapPin, {
                  className: "w-5 h-5",
                  color: "white",
                  strokeWidth: 2.5
                })}
              </div>
              <div className="mt-2 bg-surface px-3 py-1 rounded-full shadow-lg border border-border transition-colors">
                <span className="text-[8px] font-black uppercase tracking-widest text-foreground">Drag to adjust</span>
              </div>
            </div>
          </Marker>
        )}

        {/* Boundary Control Points */}
        {mode === 'DRAW_BOUNDARY' &&
          boundaryPoints.map((point, i) => (
            <Marker 
              key={`bp-${i}`} 
              longitude={point[0]} 
              latitude={point[1]}
              draggable
              onDragEnd={(e) => handleMarkerDrag(i, e)}
            >
              <div className="w-5 h-5 bg-foreground rounded-full border-2 border-background shadow-massive cursor-grab active:cursor-grabbing flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-background rounded-full" />
              </div>
            </Marker>
          ))}
      </Map>
    </div>
  );
};

