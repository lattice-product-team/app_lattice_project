'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button, Card, CardContent, Chip, Select, ListBox, Input, Modal, ModalContainer, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
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
  
  // POI Customization Modal
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
          // Flatten boundary coordinates (it's a Polygon, so coords[0] is the outer ring)
          setBoundaryPoints(boundary.geometry.coordinates[0].slice(0, -1));
          
          // Center map on boundary
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
  }, [mode, onOpen]);

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

  if (loading) return <div className="p-8 text-white">Loading Editor...</div>;

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex justify-between items-center mb-8 pt-12 px-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-[28px] font-semibold text-white tracking-tight flex items-center gap-3">
              Map Editor
              <Chip size="sm" color="primary" variant="flat" className="text-[10px] font-black uppercase tracking-widest">v2.0</Chip>
            </h1>
            <p className="text-white/30 text-xs font-medium mt-0.5">Spatial configuration and POI management</p>
          </div>
          
          <div className="h-10 w-px bg-white/10 mx-2" />

          <Select 
            className="w-64"
            selectedKey={selectedVenueId}
            onSelectionChange={(key) => setSelectedVenueId(key as string)}
          >
            <Select.Trigger className="bg-white/5 border border-white/10 rounded-full h-10 px-4 outline-none">
              <Select.Value className="text-xs font-bold text-white uppercase tracking-wider" />
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={venues} className="bg-surface border border-white/10 rounded-xl p-1 min-w-64">
                {(v: any) => (
                  <ListBox.Item id={v.id.toString()} textValue={v.name} className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-white/5 cursor-pointer outline-none focus:bg-white/10">
                    {v.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="flex gap-4">
           <Button 
            variant="flat"
            onPress={clearAll}
            className="rounded-full font-medium bg-white/5 text-white/70 border border-white/10"
           >
              Clear
           </Button>
           <Button 
            color="primary"
            onPress={saveMap}
            isLoading={saving}
            className="rounded-full font-bold bg-accent text-accent-foreground px-8"
            startContent={!saving && <Icons.Save className="w-4 h-4" />}
           >
              Save Configuration
           </Button>
        </div>
      </header>

      <div className="flex-1 relative mx-6 mb-6 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={MAP_STYLE}
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
              <div className="group relative">
                <div className="bg-accent text-accent-foreground p-2 rounded-full shadow-2xl border border-white/30 text-sm transform transition-transform group-hover:scale-125 cursor-pointer">
                  {POI_TYPES.find(t => t.value === marker.type)?.emoji || '📍'}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold py-1 px-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {marker.name}
                </div>
              </div>
            </Marker>
          ))}

          {/* Boundary Point Handles */}
          {boundaryPoints.map((point, i) => (
            <Marker key={`bp-${i}`} longitude={point[0]} latitude={point[1]}>
              <div className="w-3 h-3 bg-white rounded-full border-2 border-accent shadow-lg" />
            </Marker>
          ))}
        </Map>

        {/* Toolbox */}
        <Card className="absolute left-8 top-8 w-72 bg-background/80 backdrop-blur-xl border-white/5 rounded-[32px] shadow-2xl">
           <CardContent className="p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">Tools & Modes</h3>
              <div className="space-y-3">
                 <Button 
                  fullWidth
                  onPress={() => setMode('poi')}
                  className={`
                    justify-start gap-4 h-14 rounded-2xl font-bold text-xs px-5 transition-all border
                    ${mode === 'poi' ? 'bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10'}
                  `}
                 >
                    <span className="text-xl">📍</span> Add Custom POI
                 </Button>
                 <Button 
                  fullWidth
                  onPress={() => setMode('boundary')}
                  className={`
                    justify-start gap-4 h-14 rounded-2xl font-bold text-xs px-5 transition-all border
                    ${mode === 'boundary' ? 'bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10'}
                  `}
                 >
                    <span className="text-xl">📐</span> Define Boundary ({boundaryPoints.length})
                 </Button>
              </div>
              
              {mode === 'boundary' && boundaryPoints.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                  <Button 
                    fullWidth
                    variant="flat"
                    onPress={() => setBoundaryPoints(prev => prev.slice(0, -1))}
                    className="h-10 rounded-xl text-[9px] uppercase font-black tracking-widest bg-white/5 text-white/30 hover:text-white"
                  >
                    Undo Last Point
                  </Button>
                  <Button 
                    fullWidth
                    variant="flat"
                    onPress={() => setBoundaryPoints([])}
                    className="h-10 rounded-xl text-[9px] uppercase font-black tracking-widest bg-danger/10 text-danger/60 hover:text-danger"
                  >
                    Reset Boundary
                  </Button>
                </div>
              )}
           </CardContent>
        </Card>
      </div>

      {/* POI Configuration Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="dark">
        <ModalContainer className="bg-surface border border-white/10 rounded-[32px] p-4">
          <ModalHeader className="text-white font-bold">Configure Point of Interest</ModalHeader>
          <ModalBody className="space-y-4">
            <Input 
              label="Point Name"
              placeholder="e.g. Main Bar, South Entrance..."
              value={poiName}
              onChange={(e) => setPoiName(e.target.value)}
              className="dark"
            />
            <Select 
              label="Category"
              selectedKey={poiType}
              onSelectionChange={(key) => setPoiType(key as string)}
            >
              <Select.Trigger className="bg-white/5 border border-white/10">
                <Select.Value className="text-white" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox className="bg-surface border border-white/10">
                  {POI_TYPES.map((t) => (
                    <ListBox.Item key={t.value} id={t.value} textValue={t.label} className="text-white hover:bg-white/5 cursor-pointer p-2 rounded-lg outline-none">
                      <span className="mr-2">{t.emoji}</span> {t.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose} className="rounded-full">Cancel</Button>
            <Button color="primary" onPress={addPoi} className="rounded-full font-bold px-8">Add to Map</Button>
          </ModalFooter>
        </ModalContainer>
      </Modal>
    </div>
  );
}
