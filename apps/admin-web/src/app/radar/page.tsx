'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button, Select, ListBox } from "@heroui/react";
import { Icons } from "@/components/icons";

const API_BASE = "http://localhost:3000/api/v1";
const MAPTILER_KEY = 'iqk4irD5FCOr6M6VHVWZ';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`;

// Dynamically import Map components with SSR disabled
const Map = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Map), { ssr: false });
const NavigationControl = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.NavigationControl), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Marker), { ssr: false });
const Source = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Layer), { ssr: false });

const POI_EMOJIS: Record<string, string> = {
  wc: '🚽',
  restaurant: '🍔',
  bar: '🍺',
  medical: '🏥',
  gate: '🚪',
  information: 'ℹ️',
  emergency: '🚨',
  parking: '🅿️',
  shop: '🛍️'
};

export default function CrowdRadarPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [viewState, setViewState] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 14
  });

  const [geojsonData, setGeojsonData] = useState<any>({
    type: 'FeatureCollection',
    features: []
  });

  const [pois, setPois] = useState<any[]>([]);
  const [boundary, setBoundary] = useState<any>(null);

  // Fetch initial venues
  useEffect(() => {
    fetch(`${API_BASE}/venues`)
      .then(res => res.json())
      .then(data => {
        setVenues(data);
        if (data.length > 0) setSelectedVenueId(data[0].id.toString());
      });
  }, []);

  // Fetch spatial data for the selected venue
  useEffect(() => {
    if (!selectedVenueId) return;

    fetch(`${API_BASE}/venues/${selectedVenueId}/spatial`)
      .then(res => res.json())
      .then(data => {
        const boundaryFeature = data.features.find((f: any) => f.properties.type === 'boundary');
        const poiFeatures = data.features.filter((f: any) => f.properties.type !== 'boundary');

        setBoundary(boundaryFeature);
        setPois(poiFeatures.map((p: any) => ({
          id: p.properties.id,
          lng: p.geometry.coordinates[0],
          lat: p.geometry.coordinates[1],
          name: p.properties.name,
          type: p.properties.type
        })));

        if (boundaryFeature) {
          const [lng, lat] = boundaryFeature.geometry.coordinates[0][0];
          setViewState(prev => ({ ...prev, longitude: lng, latitude: lat }));
        }
      });
  }, [selectedVenueId]);

  // Simulation: Heatmap telemetry
  useEffect(() => {
    const fetchHeatmap = () => {
      if (!boundary) return;

      // Mocking some data around the boundary
      const [lngBase, latBase] = boundary.geometry.coordinates[0][0];
      const features = Array.from({ length: 50 }).map((_, i) => ({
        type: 'Feature',
        properties: { intensity: Math.random() },
        geometry: {
          type: 'Point',
          coordinates: [
            lngBase + (Math.random() - 0.5) * 0.01,
            latBase + (Math.random() - 0.5) * 0.01
          ]
        }
      }));
      setGeojsonData({ type: 'FeatureCollection', features });
    };

    fetchHeatmap();
    const interval = setInterval(fetchHeatmap, 5000);
    return () => clearInterval(interval);
  }, [boundary]);

  return (
    <div className="flex flex-col h-full">
      <header className="glass-card p-6 pt-12 flex justify-between items-center z-10 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="ghost" className="text-white/70">
            <Icons.Sidebar className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Crowd Radar</h1>
            <p className="text-white/30 text-xs font-medium mt-0.5">Real-time Density Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Feed</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
            <Icons.MapPin className="w-4 h-4 text-accent" />
            <Select 
              className="w-48"
              selectedKey={selectedVenueId}
              onSelectionChange={(key) => setSelectedVenueId(key as string)}
            >
              <Select.Trigger className="bg-transparent border-none min-h-0 h-auto p-0 flex items-center gap-2 outline-none">
                <Select.Value className="text-xs font-bold text-white uppercase tracking-wider" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox className="bg-surface border border-white/10 rounded-xl p-1 min-w-48">
                  {venues.map((v: any) => (
                    <ListBox.Item key={v.id} id={v.id.toString()} textValue={v.name} className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-white/5 cursor-pointer outline-none focus:bg-white/10">
                      {v.name}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </header>

      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />

          {boundary && (
            <Source type="geojson" data={boundary}>
              <Layer
                id="boundary-line"
                type="line"
                paint={{
                  'line-color': '#ff382e',
                  'line-width': 2,
                  'line-dasharray': [2, 2]
                }}
              />
              <Layer
                id="boundary-fill"
                type="fill"
                paint={{
                  'fill-color': '#ff382e',
                  'fill-opacity': 0.05
                }}
              />
            </Source>
          )}

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

          {pois.map(poi => (
            <Marker key={poi.id} longitude={poi.lng} latitude={poi.lat} anchor="bottom">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-surface/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg text-[10px] font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {poi.name}
                </div>
                <div className="w-8 h-8 bg-surface border border-white/20 rounded-full flex items-center justify-center shadow-2xl text-lg">
                  {POI_EMOJIS[poi.type] || '📍'}
                </div>
              </div>
            </Marker>
          ))}
        </Map>

        {/* Legend */}
        <div className="absolute right-6 bottom-10 z-10 glass-card p-4 rounded-xl">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Density Legend</h4>
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-2 rounded-full bg-gradient-to-r from-blue-500 to-[#ff382e]" />
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
