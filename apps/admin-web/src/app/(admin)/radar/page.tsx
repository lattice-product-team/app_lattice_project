'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Select, ListBox } from '@heroui/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEvents } from '@/hooks/use-admin-data';

const API_BASE = 'http://localhost:3000/api/v1';
const MAPTILER_KEY = 'iqk4irD5FCOr6M6VHVWZ';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

// Dynamically import Map components with SSR disabled
const Map = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Map), { ssr: false });
const NavigationControl = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.NavigationControl),
  { ssr: false }
);
const Marker = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Marker), {
  ssr: false,
});
const Source = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Source), {
  ssr: false,
});
const Layer = dynamic(() => import('react-map-gl/maplibre').then((mod) => mod.Layer), {
  ssr: false,
});

const POI_EMOJIS: Record<string, string> = {
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

export default function CrowdRadarPage() {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [viewState, setViewState] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 14,
  });

  const [geojsonData, setGeojsonData] = useState<{
    type: 'FeatureCollection';
    features: any[];
  }>({
    type: 'FeatureCollection',
    features: [],
  });

  const [boundary, setBoundary] = useState<any>(null);

  // Set initial selected event
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id.toString());
    }
  }, [events, selectedEventId]);

  // Fetch static spatial data (boundary)
  useEffect(() => {
    if (!selectedEventId) return;

    fetch(`${API_BASE}/events/${selectedEventId}/spatial`)
      .then((res) => res.json())
      .then((data) => {
        const boundaryFeature = data.features.find((f: any) => f.properties.type === 'boundary');
        setBoundary(boundaryFeature);

        // Center map on event centroid
        if (boundaryFeature?.geometry?.coordinates?.[0]) {
          const coords = boundaryFeature.geometry.coordinates[0];
          const centroidLng = coords.reduce((s: number, c: [number, number]) => s + c[0], 0) / coords.length;
          const centroidLat = coords.reduce((s: number, c: [number, number]) => s + c[1], 0) / coords.length;
          
          setViewState((prev) => ({
            ...prev,
            longitude: centroidLng,
            latitude: centroidLat,
            zoom: 16,
          }));
        }
      });
  }, [selectedEventId]);

  // Fetch real-time crowd telemetry (Heatmap data)
  useEffect(() => {
    const fetchRealTelemetry = async () => {
      if (!selectedEventId) return;

      try {
        const res = await fetch(`${API_BASE}/geo/locations?eventId=${selectedEventId}`);
        const data = await res.json();
        
        // Data expected format: { type: 'FeatureCollection', features: [...] }
        if (data?.features) {
          // Normalize intensity for heatmap (if API doesn't provide it)
          const featuresWithIntensity = data.features.map((f: any) => ({
            ...f,
            properties: {
              ...f.properties,
              intensity: f.properties.intensity || 1, // Default intensity
            }
          }));
          setGeojsonData({ type: 'FeatureCollection', features: featuresWithIntensity });
        }
      } catch (err) {
        console.error('Failed to fetch real-time crowd data:', err);
      }
    };

    fetchRealTelemetry();
    const interval = setInterval(fetchRealTelemetry, 5000); // 5s interval for realism
    return () => clearInterval(interval);
  }, [selectedEventId]);

  if (eventsLoading && events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-eggshell h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
          <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-admin-xs">
            Synchronizing Radar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-eggshell overflow-hidden">
      {/* Full-screen Map Container */}
      <div className="absolute inset-0 z-0">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
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
                  'line-dasharray': [2, 2],
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
                  0,
                  'rgba(0,0,0,0)',
                  0.2,
                  'rgba(4, 71, 255, 0.2)', // Signal Blue
                  0.4,
                  'rgba(4, 71, 255, 0.4)',
                  0.6,
                  'rgba(255, 71, 4, 0.4)', // Ember
                  0.8,
                  'rgba(255, 71, 4, 0.6)',
                  1,
                  'rgba(255, 71, 4, 0.8)',
                ],
                'heatmap-radius': 35,
                'heatmap-opacity': 0.7,
              }}
            />
          </Source>
        </Map>
      </div>

      {/* Floating Header Overlay */}
      <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
        <Card className="p-5 bg-white/80 backdrop-blur-md border-chalk shadow-massive pointer-events-auto max-w-sm">
          <div className="flex flex-col">
            <p className="text-gravel text-[9px] font-black uppercase tracking-[0.2em] mb-1.5">
              Live Crowd Intelligence
            </p>
            <h1 className="waldenburg-display text-[26px] text-obsidian leading-none mb-4">
              Operational Radar.
            </h1>
            <div className="flex items-center gap-3 pt-2 border-t border-chalk/50">
              <Select
                className="w-44"
                aria-label="Select event"
                selectedKey={selectedEventId}
                onSelectionChange={(key) => {
                  const newKey =
                    key && typeof key === 'object' && 'anchorKey' in key
                      ? (key as any).anchorKey
                      : (key as string);

                  if (newKey && newKey !== selectedEventId) {
                    setSelectedEventId(newKey);
                  }
                }}
              >
                <Select.Trigger className="bg-white border border-chalk rounded-full h-8 px-4 outline-none shadow-hairline">
                  <Select.Value className="text-[10px] font-black text-obsidian uppercase tracking-[0.1em]" />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox
                    items={events}
                    className="bg-white border border-chalk rounded-xl p-2 min-w-48 shadow-massive"
                  >
                    {(v: any) => (
                      <ListBox.Item
                        id={v.id.toString()}
                        textValue={v.name}
                        className="flex items-center px-3 py-2 rounded-lg text-admin-sm font-bold text-gravel hover:bg-powder cursor-pointer outline-none focus:bg-powder transition-colors"
                      >
                        {v.name}
                      </ListBox.Item>
                    )}
                  </ListBox>
                </Select.Popover>
              </Select>
              <div className="h-4 w-px bg-chalk mx-2" />
              <div className="flex items-center gap-2 bg-powder/30 px-3 py-1.5 rounded-full border border-chalk">
                <span className="w-2 h-2 rounded-full bg-ember animate-pulse shadow-[0_0_8px_rgba(255,71,4,0.6)]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-obsidian">
                  Telemetry Active
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Real-time stats */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <Card className="p-4 bg-obsidian text-eggshell border-obsidian shadow-massive min-w-[160px]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gravel mb-1">Live Users</p>
            <div className="flex items-baseline gap-2">
              <span className="waldenburg-display text-3xl">{geojsonData.features.length}</span>
              <span className="text-[10px] font-black text-success uppercase tracking-tighter flex items-center gap-1">
                <Icons.TrendingUp className="w-3 h-3" /> Real-time
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <Card className="absolute right-6 bottom-6 w-56 bg-white/90 backdrop-blur-md p-5 border-chalk shadow-massive z-10">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-obsidian mb-4 border-b border-chalk pb-3 flex items-center justify-between">
          Density Scale
          <Icons.ShieldCheck className="w-3.5 h-3.5 text-signal-blue" />
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-gravel uppercase tracking-widest">
              Sparse
            </span>
            <div className="flex-1 mx-4 h-1.5 rounded-full bg-gradient-to-r from-signal-blue via-chalk to-ember shadow-inner" />
            <span className="text-[9px] font-black text-gravel uppercase tracking-widest">
              Dense
            </span>
          </div>
          <div className="bg-powder/20 p-3 rounded-lg border border-chalk/40">
            <p className="text-[9px] text-obsidian leading-relaxed text-center font-medium">
              Architectural telemetry synchronized via Geo-JSON streams.
            </p>
            <p className="text-[8px] text-gravel mt-1 text-center font-black uppercase tracking-widest">
              Update Rate: 5000ms
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
