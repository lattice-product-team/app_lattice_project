'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Chip, Select, ListBox, Modal, ModalContainer, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Icons } from "@/components/icons";
import { ElevenButton } from "@/components/ui/eleven-button";
import { ElevenInput } from "@/components/ui/eleven-input";
import { ElevenCard } from "@/components/ui/eleven-card";

const API_BASE = "http://localhost:3000/api/v1";
const MAPTILER_KEY = 'iqk4irD5FCOr6M6VHVWZ';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

// Dynamically import Map components with SSR disabled
const Map = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Map), { ssr: false });
const NavigationControl = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.NavigationControl), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Marker), { ssr: false });
const Source = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Layer), { ssr: false });

const POI_TYPES = [
  { value: 'wc', label: 'Toilets', emoji: '🚽' },
  { value: 'restaurant', label: 'Restaurant', emoji: '🍔' },
  { value: 'bar', label: 'Bar', emoji: '🍺' },
  { value: 'medical', label: 'Medical', emoji: '🏥' },
  { value: 'gate', label: 'Entrance/Gate', emoji: '🚪' },
  { value: 'information', label: 'Info', emoji: 'ℹ️' },
  { value: 'emergency', label: 'Emergency', emoji: '🚨' },
  { value: 'parking', label: 'Parking', emoji: '🅿️' },
  { value: 'shop', label: 'Shop', emoji: '🛍️' },
];

export default function MapEditorPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 15
  });

  const [mode, setMode] = useState<'poi' | 'boundary'>('poi');
  const [markers, setMarkers] = useState<any[]>([]);
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [pendingPoi, setPendingPoi] = useState<{lng: number, lat: number} | null>(null);
  const [poiName, setPoiName] = useState("");
  const [poiType, setPoiType] = useState("wc");

  useEffect(() => {
    fetch(`${API_BASE}/venues`)
      .then(res => res.json())
      .then(data => {
        setVenues(data);
        if (data.length > 0) setSelectedVenueId(data[0].id.toString());
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedVenueId) return;

    fetch(`${API_BASE}/venues/${selectedVenueId}/spatial`)
      .then(res => res.json())
      .then(data => {
        const boundary = data.features.find((f: any) => f.properties.type === 'boundary');
        const pois = data.features.filter((f: any) => f.properties.type !== 'boundary');

        if (boundary) {
          setBoundaryPoints(boundary.geometry.coordinates[0].slice(0, -1));
          const [lng, lat] = boundary.geometry.coordinates[0][0];
          setViewState(prev => ({ ...prev, longitude: lng, latitude: lat }));
        } else {
          setBoundaryPoints([]);
        }

        setMarkers(pois.map((p: any) => ({
          id: p.properties.id,
          lng: p.geometry.coordinates[0],
          lat: p.geometry.coordinates[1],
          name: p.properties.name,
          type: p.properties.type
        })));
      });
  }, [selectedVenueId]);

  const onMapClick = useCallback((e: any) => {
    const { lng, lat } = e.lngLat;
    if (mode === 'poi') {
      setPendingPoi({ lng, lat });
      setPoiName("");
      onOpen();
    } else {
      setBoundaryPoints(prev => [...prev, [lng, lat]]);
    }
  }, [mode]);

  const addPoi = () => {
    if (pendingPoi) {
      setMarkers(prev => [...prev, { 
        ...pendingPoi, 
        id: Date.now(), 
        name: poiName || "New Point", 
        type: poiType 
      }]);
    }
    setPendingPoi(null);
    onClose();
  };

  const saveMap = async () => {
    if (!selectedVenueId) return;
    setSaving(true);
    try {
      const boundaryGeoJSON = boundaryPoints.length > 2 
        ? { type: 'Polygon', coordinates: [[...boundaryPoints, boundaryPoints[0]]] } 
        : null;

      const payload = {
        boundary: boundaryGeoJSON,
        pois: markers.map(m => ({
          name: m.name,
          type: m.type,
          geometry: { type: 'Point', coordinates: [m.lng, m.lat] }
        }))
      };

      const res = await fetch(`${API_BASE}/venues/${selectedVenueId}/spatial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Venue Map saved successfully!");
      }
    } catch (error) {
      console.error("Error saving map:", error);
    } finally {
      setSaving(false);
    }
  };

  const clearAll = () => {
    setMarkers([]);
    setBoundaryPoints([]);
  };

  const boundaryGeoJSON: any = useMemo(() => ({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [boundaryPoints.length > 2 ? [...boundaryPoints, boundaryPoints[0]] : boundaryPoints]
    }
  }), [boundaryPoints]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-eggshell">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
        <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-[12px]">Initializing Spatial Engine...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-eggshell space-y-8">
      <header className="flex justify-between items-start pt-4">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-[14px] font-medium mb-2 uppercase tracking-widest">Spatial Configuration</p>
          <h1 className="waldenburg-display text-[48px] text-obsidian leading-[1.08] mb-4">
            Cartographic Editor.
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Select 
              className="w-64"
              selectedKey={selectedVenueId}
              onSelectionChange={(key) => setSelectedVenueId(key as string)}
            >
              <Select.Trigger className="bg-white border-1 border-chalk rounded-full h-10 px-5 outline-none shadow-hairline">
                <Select.Value className="text-[12px] font-bold text-obsidian uppercase tracking-wider" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={venues} className="bg-white border border-chalk rounded-xl p-1 min-w-64 shadow-subtle">
                  {(v: any) => (
                    <ListBox.Item id={v.id.toString()} textValue={v.name} className="flex items-center px-4 py-2 rounded-lg text-[13px] font-medium text-gravel hover:bg-powder cursor-pointer outline-none focus:bg-powder">
                      {v.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <div className="h-6 w-px bg-chalk mx-2" />
            <ElevenButton variant="ghost" size="sm" onPress={clearAll}>Reset Canvas</ElevenButton>
            <ElevenButton variant="primary" size="sm" onPress={saveMap} isLoading={saving} startContent={!saving && <Icons.Save className="w-4 h-4" />}>
              Commit Changes
            </ElevenButton>
          </div>
        </div>
      </header>

      <div className="flex-1 relative rounded-2xl overflow-hidden border border-chalk shadow-hairline bg-white">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={MAP_STYLE}
          onClick={onMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />

          {boundaryPoints.length > 0 && (
            <Source type="geojson" data={boundaryGeoJSON}>
              <Layer
                id="boundary-fill"
                type="fill"
                paint={{
                  'fill-color': '#000000',
                  'fill-opacity': 0.05
                }}
              />
              <Layer
                id="boundary-outline"
                type="line"
                paint={{
                  'line-color': '#000000',
                  'line-width': 1.5,
                  'line-dasharray': [4, 4]
                }}
              />
            </Source>
          )}

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
            >
              <div className="group relative">
                <div className="bg-obsidian text-eggshell p-2.5 rounded-full shadow-hairline border border-chalk transform transition-all hover:scale-125 cursor-pointer">
                  <span className="text-[16px]">{POI_TYPES.find(t => t.value === marker.type)?.emoji || '📍'}</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-obsidian text-eggshell text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-subtle">
                  {marker.name}
                </div>
              </div>
            </Marker>
          ))}

          {boundaryPoints.map((point, i) => (
            <Marker key={`bp-${i}`} longitude={point[0]} latitude={point[1]}>
              <div className="w-3 h-3 bg-white rounded-full border-2 border-obsidian shadow-hairline" />
            </Marker>
          ))}
        </Map>

        {/* Floating Toolbar */}
        <ElevenCard className="absolute left-6 top-6 w-64 bg-white/90 backdrop-blur-md p-6 border-chalk shadow-subtle">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gravel mb-4 border-b border-chalk pb-2">Cartographic Tools</h3>
          <div className="space-y-2">
             <ElevenButton 
              fullWidth
              variant={mode === 'poi' ? 'primary' : 'ghost'}
              onPress={() => setMode('poi')}
              className="justify-start gap-3 h-12 text-[12px]"
             >
                <Icons.MapPin className="w-4 h-4" /> Point of Interest
             </ElevenButton>
             <ElevenButton 
              fullWidth
              variant={mode === 'boundary' ? 'primary' : 'ghost'}
              onPress={() => setMode('boundary')}
              className="justify-start gap-3 h-12 text-[12px]"
             >
                <Icons.Maximize className="w-4 h-4" /> Perimeter Mode ({boundaryPoints.length})
             </ElevenButton>
          </div>
          
          {mode === 'boundary' && boundaryPoints.length > 0 && (
            <div className="mt-4 pt-4 border-t border-chalk grid grid-cols-2 gap-2">
              <ElevenButton variant="compact" onPress={() => setBoundaryPoints(prev => prev.slice(0, -1))}>Undo</ElevenButton>
              <ElevenButton variant="compact" className="text-ember" onPress={() => setBoundaryPoints([])}>Clear</ElevenButton>
            </div>
          )}
        </ElevenCard>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContainer className="bg-white border border-chalk rounded-2xl p-4 shadow-subtle">
          <ModalHeader className="waldenburg-display text-[24px] text-obsidian">Define Point of Interest</ModalHeader>
          <ModalBody className="space-y-6">
            <ElevenInput 
              label="Identifier"
              placeholder="e.g. South Gate, Medical tent A"
              value={poiName}
              onChange={(e) => setPoiName(e.target.value)}
            />
            <div className="space-y-2">
              <p className="text-gravel text-[12px] font-bold uppercase tracking-widest">Category</p>
              <div className="grid grid-cols-3 gap-2">
                {POI_TYPES.map((t) => (
                  <button 
                    key={t.value}
                    onClick={() => setPoiType(t.value)}
                    className={`p-3 rounded-lg border transition-all text-center
                      ${poiType === t.value ? 'bg-obsidian border-obsidian text-eggshell' : 'bg-powder/30 border-chalk text-gravel hover:bg-powder'}`}
                  >
                    <div className="text-xl mb-1">{t.emoji}</div>
                    <div className="text-[10px] font-black uppercase tracking-tighter truncate">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="mt-4">
            <ElevenButton variant="ghost" onPress={onClose}>Discard</ElevenButton>
            <ElevenButton variant="primary" onPress={addPoi}>Add to Canvas</ElevenButton>
          </ModalFooter>
        </ModalContainer>
      </Modal>
    </div>
  );
}
