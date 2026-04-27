'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';

// Dynamically import Map components with SSR disabled
const Map = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Map), { ssr: false });
const NavigationControl = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.NavigationControl), { ssr: false });
const Source = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Layer), { ssr: false });

export default function CrowdRadarPage() {
  const [viewState, setViewState] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 14
  });

  const [geojsonData, setGeojsonData] = useState<any>({
    type: 'FeatureCollection',
    features: []
  });

  // Simulation: In a real app, this would fetch from /telemetry/heatmap/:eventId
  useEffect(() => {
    const fetchHeatmap = () => {
      // Mocking some data around Barcelona for visual feedback
      const features = Array.from({ length: 50 }).map((_, i) => ({
        type: 'Feature',
        properties: { intensity: Math.random() },
        geometry: {
          type: 'Point',
          coordinates: [
            2.2575 + (Math.random() - 0.5) * 0.01,
            41.5641 + (Math.random() - 0.5) * 0.01
          ]
        }
      }));
      setGeojsonData({ type: 'FeatureCollection', features });
    };

    fetchHeatmap();
    const interval = setInterval(fetchHeatmap, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="glass-card p-6 flex justify-between items-center z-10 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Crowd Radar</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest font-black">Real-time Density Analysis</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Feed</span>
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-primary">
             <option>All Venues</option>
             <option>Circuit de Barcelona</option>
          </select>
        </div>
      </header>

      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />

          <Source type="geojson" data={geojsonData}>
            <Layer
              id="heatmap-layer"
              type="heatmap"
              paint={{
                'heatmap-weight': ['get', 'intensity'],
                'heatmap-intensity': 2,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0,0,0,0)',
                  0.2, 'rgba(65,105,225,0.5)',
                  0.4, 'rgba(0,255,255,0.5)',
                  0.6, 'rgba(0,255,0,0.5)',
                  0.8, 'rgba(255,255,0,0.5)',
                  1, 'rgba(255,56,46,0.8)'
                ],
                'heatmap-radius': 30,
                'heatmap-opacity': 0.8
              }}
            />
          </Source>
        </Map>

        {/* Legend */}
        <div className="absolute right-6 bottom-10 z-10 glass-card p-4 rounded-xl">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Density Legend</h4>
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-2 rounded-full bg-gradient-to-r from-blue-500 to-primary" />
                 <span className="text-[10px] text-white/60 font-bold">Low → High</span>
              </div>
              <div className="pt-2 border-t border-white/5">
                 <p className="text-[10px] text-white/40 leading-relaxed italic">
                    Data updates every 5s based on active user pings.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
