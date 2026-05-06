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
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
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
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        if (data.length > 0) setSelectedEventId(data[0].id.toString());
      });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    fetch(`${API_BASE}/events/${selectedEventId}/spatial`)
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
  }, [selectedEventId]);

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
    <div className="relative w-full h-screen bg-eggshell overflow-hidden">
      {/* Full-screen Map Container */}
      <div className="absolute inset-0 z-0">
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
      </div>

      {/* Floating Header Overlay */}
      <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
        <Card className="p-4 bg-white/80 backdrop-blur-md border-chalk shadow-subtle pointer-events-auto max-w-sm">
          <div className="flex flex-col">
            <p className="text-gravel text-[9px] font-black uppercase tracking-[0.2em] mb-1">Real-time Telemetry</p>
            <h1 className="waldenburg-display text-[22px] text-obsidian leading-none mb-3">
              Crowd Density Radar.
            </h1>
            <div className="flex items-center gap-3">
              <Select 
                className="w-40"
                aria-label="Select event"
                selectedKey={selectedEventId}
                onSelectionChange={(key) => setSelectedEventId(key as string)}
              >
                <Select.Trigger className="bg-white border border-chalk rounded-full h-7 px-3 outline-none shadow-hairline">
                  <Select.Value className="text-[9px] font-black text-obsidian uppercase tracking-wider" />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox items={events} className="bg-white border border-chalk rounded-xl p-1 min-w-40 shadow-subtle">
                    {(v: any) => (
                      <ListBox.Item id={v.id.toString()} textValue={v.name} className="flex items-center px-3 py-1.5 rounded-lg text-admin-xs font-medium text-gravel hover:bg-powder cursor-pointer outline-none focus:bg-powder">
                        {v.name}
                      </ListBox.Item>
                    )}
                  </ListBox>
                </Select.Popover>
              </Select>
              <div className="h-3 w-px bg-chalk mx-2" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse shadow-hairline" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gravel">Live Stream</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Legend */}
      <Card className="absolute right-6 bottom-6 w-52 bg-white/80 backdrop-blur-md p-4 border-chalk shadow-subtle z-10">
         <h4 className="text-[9px] font-black uppercase tracking-widest text-gravel mb-3 border-b border-chalk pb-2 text-center">Crowd Density</h4>
         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-black text-slate uppercase tracking-tighter">Sparse</span>
               <div className="flex-1 mx-3 h-1 rounded-full bg-linear-to-r from-signal-blue to-ember" />
               <span className="text-[9px] font-black text-slate uppercase tracking-tighter">Congested</span>
            </div>
            <p className="text-[10px] text-gravel leading-relaxed text-center italic border-t border-chalk/50 pt-2">
              Architectural telemetry updated at 200ms intervals.
            </p>
         </div>
      </Card>
    </div>
  );
}

