"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Chip, Select, ListBox } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_BASE = "http://localhost:3000/api/v1";
const MAPTILER_KEY = 'iqk4irD5FCOr6M6VHVWZ';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

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

  useEffect(() => {
    fetch(`${API_BASE}/venues`)
      .then(res => res.json())
      .then(data => {
        setVenues(data);
        if (data.length > 0) setSelectedVenueId(data[0].id.toString());
      });
  }, []);

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

  useEffect(() => {
    const fetchHeatmap = () => {
      if (!boundary) return;
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
    <div className="flex flex-col h-full bg-eggshell space-y-8">
      <header className="flex justify-between items-start pt-4">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Real-time Telemetry</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Crowd Density Radar.
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Select 
              className="w-64"
              aria-label="Select venue"
              selectedKey={selectedVenueId}
              onSelectionChange={(key) => setSelectedVenueId(key as string)}
            >
              <Select.Trigger className="bg-white border border-chalk rounded-full h-10 px-5 outline-none shadow-hairline">
                <Select.Value className="text-admin-xs font-bold text-obsidian uppercase tracking-wider" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={venues} className="bg-white border border-chalk rounded-xl p-1 min-w-64 shadow-subtle">
                  {(v: any) => (
                    <ListBox.Item id={v.id.toString()} textValue={v.name} className="flex items-center px-4 py-2 rounded-lg text-admin-sm font-medium text-gravel hover:bg-powder cursor-pointer outline-none focus:bg-powder">
                      {v.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <div className="h-6 w-px bg-chalk mx-2" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse shadow-hairline" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gravel">Live Stream Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 relative rounded-2xl overflow-hidden border border-chalk shadow-hairline bg-white">
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
                  'line-color': '#000000',
                  'line-width': 1.5,
                  'line-dasharray': [2, 2]
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
                  0.2, 'rgba(4, 71, 255, 0.2)', // Signal Blue
                  0.4, 'rgba(4, 71, 255, 0.4)',
                  0.6, 'rgba(255, 71, 4, 0.4)', // Ember
                  0.8, 'rgba(255, 71, 4, 0.6)',
                  1, 'rgba(255, 71, 4, 0.8)'
                ],
                'heatmap-radius': 35,
                'heatmap-opacity': 0.7
              }}
            />
          </Source>

          {pois.map(poi => (
            <Marker key={poi.id} longitude={poi.lng} latitude={poi.lat} anchor="bottom">
              <div className="group relative">
                <div className="bg-obsidian text-eggshell p-2 rounded-full shadow-hairline border border-chalk transform transition-all hover:scale-125 cursor-pointer">
                  <span className="text-admin-base">{POI_EMOJIS[poi.type] || '📍'}</span>
                </div>
              </div>
            </Marker>
          ))}
        </Map>

        {/* Legend */}
        <Card className="absolute right-6 bottom-6 w-64 bg-white/90 backdrop-blur-md p-6 border-chalk shadow-subtle">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-gravel mb-4 border-b border-chalk pb-2 text-center">Crowd Density</h4>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate uppercase tracking-tighter">Sparse</span>
                 <div className="flex-1 mx-4 h-1.5 rounded-full bg-linear-to-r from-signal-blue to-ember" />
                 <span className="text-[10px] font-black text-slate uppercase tracking-tighter">Congested</span>
              </div>
              <p className="text-[11px] text-gravel leading-relaxed text-center italic border-t border-chalk/50 pt-3">
                Architectural telemetry updated at 200ms intervals.
              </p>
           </div>
        </Card>
      </div>
    </div>
  );
}
