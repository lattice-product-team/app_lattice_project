'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { Icons } from "@/components/icons";

// Dynamically import Map components with SSR disabled
const Map = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Map), { ssr: false });
const NavigationControl = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.NavigationControl), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Marker), { ssr: false });
const Source = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Layer), { ssr: false });

export default function MapEditorPage() {
  const [viewState, setViewState] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 15
  });

  const [mode, setMode] = useState<'poi' | 'boundary'>('poi');
  const [markers, setMarkers] = useState<any[]>([]);
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([]);

  const onMapClick = useCallback((e: any) => {
    const { lng, lat } = e.lngLat;
    
    if (mode === 'poi') {
      setMarkers(prev => [...prev, { lng, lat, id: Date.now() }]);
    } else {
      setBoundaryPoints(prev => [...prev, [lng, lat]]);
    }
  }, [mode]);

  const clearAll = () => {
    setMarkers([]);
    setBoundaryPoints([]);
  };

  // Convert boundary points to GeoJSON Polygon
  const boundaryGeoJSON: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [boundaryPoints.length > 2 ? [...boundaryPoints, boundaryPoints[0]] : boundaryPoints]
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center mb-8 pt-12 px-6">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="ghost" className="text-white/70">
            <Icons.Sidebar className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Map Editor</h1>
            <p className="text-white/30 text-xs font-medium mt-0.5">Lattice Studio v1.0 • Spatial Configuration</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button 
            variant="flat"
            onPress={clearAll}
            className="rounded-full font-medium bg-white/5 text-white/70"
           >
              Clear All
           </Button>
           <Button 
            color="primary"
            className="rounded-full font-medium"
            startContent={<Icons.Save className="w-4 h-4" />}
           >
              Save Venue Map
           </Button>
        </div>
      </header>

      <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          onClick={onMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />

          {/* Boundary Layer */}
          {boundaryPoints.length > 0 && (
            <Source type="geojson" data={boundaryGeoJSON}>
              <Layer
                id="boundary-fill"
                type="fill"
                paint={{
                  'fill-color': '#E2B042',
                  'fill-opacity': 0.1
                }}
              />
              <Layer
                id="boundary-outline"
                type="line"
                paint={{
                  'line-color': '#E2B042',
                  'line-width': 2,
                  'line-dasharray': [2, 1]
                }}
              />
            </Source>
          )}

          {/* POI Markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
            >
              <div className="bg-accent text-accent-foreground p-1.5 rounded-full shadow-lg border border-white/20 text-xs font-black">
                📍
              </div>
            </Marker>
          ))}

          {/* Boundary Point Handles */}
          {boundaryPoints.map((point, i) => (
            <Marker key={`bp-${i}`} longitude={point[0]} latitude={point[1]}>
              <div className="w-2.5 h-2.5 bg-white rounded-full border-2 border-accent shadow-lg" />
            </Marker>
          ))}
        </Map>

        {/* Toolbox */}
        <Card className="absolute left-6 top-6 w-72 bg-background/80 backdrop-blur-md border-white/5 rounded-3xl shadow-2xl">
           <CardContent className="p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Toolbox</h3>
              <div className="space-y-2">
                 <Button 
                  fullWidth
                  onPress={() => setMode('poi')}
                  className={`
                    justify-start gap-4 h-12 rounded-2xl font-bold text-xs px-4 transition-all
                    ${mode === 'poi' ? 'bg-accent text-accent-foreground' : 'bg-white/5 text-white/60 hover:bg-white/10'}
                  `}
                 >
                    <span className="text-lg">📍</span> Add POI Marker
                 </Button>
                 <Button 
                  fullWidth
                  onPress={() => setMode('boundary')}
                  className={`
                    justify-start gap-4 h-12 rounded-2xl font-bold text-xs px-4 transition-all
                    ${mode === 'boundary' ? 'bg-accent text-accent-foreground' : 'bg-white/5 text-white/60 hover:bg-white/10'}
                  `}
                 >
                    <span className="text-lg">📐</span> Draw Boundary ({boundaryPoints.length})
                 </Button>
              </div>
              
              {mode === 'boundary' && boundaryPoints.length > 0 && (
                <Button 
                  fullWidth
                  variant="ghost"
                  onPress={() => setBoundaryPoints(prev => prev.slice(0, -1))}
                  className="mt-2 text-[9px] uppercase font-black tracking-widest text-white/30 hover:text-white"
                >
                  Undo last point
                </Button>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
