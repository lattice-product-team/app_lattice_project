'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';

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
      <header className="glass-card p-6 flex justify-between items-center z-10 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Map Editor</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest font-black">Lattice Studio v1.0</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={clearAll}
            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition-colors"
           >
              Clear All
           </button>
           <button className="bg-primary hover:bg-red-600 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 transition-all">
              Save Venue Map
           </button>
        </div>
      </header>

      <div className="flex-1 relative">
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
                  'fill-color': '#ff382e',
                  'fill-opacity': 0.1
                }}
              />
              <Layer
                id="boundary-outline"
                type="line"
                paint={{
                  'line-color': '#ff382e',
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
              <div className="bg-primary text-white p-1.5 rounded-full shadow-lg border border-white text-xs">
                📍
              </div>
            </Marker>
          ))}

          {/* Boundary Point Handles */}
          {boundaryPoints.map((point, i) => (
            <Marker key={`bp-${i}`} longitude={point[0]} latitude={point[1]}>
              <div className="w-2 h-2 bg-white rounded-full border border-primary" />
            </Marker>
          ))}
        </Map>

        {/* Toolbox */}
        <div className="absolute left-6 top-6 z-10 space-y-4">
           <div className="glass-card p-4 rounded-xl w-64">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Toolbox</h3>
              <div className="space-y-2">
                 <button 
                  onClick={() => setMode('poi')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-3 ${mode === 'poi' ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                 >
                    <span className="text-sm">📍</span> Add POI Marker
                 </button>
                 <button 
                  onClick={() => setMode('boundary')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-3 ${mode === 'boundary' ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                 >
                    <span className="text-sm">📐</span> Draw Boundary ({boundaryPoints.length})
                 </button>
              </div>
              
              {mode === 'boundary' && boundaryPoints.length > 0 && (
                <button 
                  onClick={() => setBoundaryPoints(prev => prev.slice(0, -1))}
                  className="w-full mt-2 text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-white"
                >
                  Undo last point
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
