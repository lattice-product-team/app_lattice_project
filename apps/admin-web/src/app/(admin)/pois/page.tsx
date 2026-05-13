'use client';

import React, { useState, useMemo } from 'react';
import {
  Chip,
  Spinner,
  Modal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  ListBox,
  Selection,
} from '@heroui/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePOIs, useEvents } from '@/hooks/use-admin-data';
import { useSocket } from '@/hooks/use-socket';
import dynamic from 'next/dynamic';
import { useMapInteractions } from '@/components/map/use-map-interactions';
import { useRouter } from 'next/navigation';

const AdminMap = dynamic(() => import('@/components/map/admin-map').then((mod) => mod.AdminMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-powder/20 animate-pulse flex items-center justify-center text-gravel uppercase text-[10px] font-black tracking-widest">
      Initializing Map...
    </div>
  ),
});

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

export default function POIsPage() {
  const router = useRouter();
  const { pois, loading, refetch } = usePOIs();
  const { events } = useEvents();
  const { subscribe, isConnected } = useSocket();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Selection>(new Set([]));
  const [eventFilter, setEventFilter] = useState<Selection>(new Set([]));

  // Helper: extract a plain string from HeroUI's Selection
  const selectionValue = (sel: Selection): string => {
    if (sel === 'all') return 'all';
    const arr = Array.from(sel as Set<string | number>);
    return arr.length > 0 ? String(arr[0]) : '';
  };

  // Real-time synchronization
  React.useEffect(() => {
    if (isConnected) {
      const unsubscribe = subscribe('admin:pois:updated', () => {
        console.log('[Real-time] POIs updated, refetching...');
        refetch();
      });
      return unsubscribe;
    }
  }, [isConnected, subscribe, refetch]);

  // Interface State
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingPoiId, setEditingPoiId] = useState<number | null>(null);

  // Form State
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('wc');
  const [capacity, setCapacity] = useState('');
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState(true);

  const { selectedPoi, selectPoi, clearPoi } = useMapInteractions('PICK_COORDINATE');

  const selectedEvent = useMemo(
    () => events.find((e) => e.id.toString() === selectedEventId),
    [events, selectedEventId]
  );

  const filteredPois = useMemo(() => {
    const typeValue = selectionValue(typeFilter);
    const eventValue = selectionValue(eventFilter);

    return pois.filter((poi: any) => {
      const matchesSearch = poi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          poi.locationName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !typeValue || typeValue === 'all' || poi.type === typeValue;
      
      const matchesEvent = !eventValue || eventValue === 'all' || poi.eventId?.toString() === eventValue;

      return matchesSearch && matchesType && matchesEvent;
    });
  }, [pois, searchTerm, typeFilter, eventFilter]);

  const handleOpenCreate = () => {
    setEditingPoiId(null);
    setName('');
    setDescription('');
    setType('wc');
    setCapacity('');
    setSelectedEventId('');
    clearPoi();
    setIsInterfaceOpen(true);
  };

  const handleOpenEdit = (poi: any) => {
    setEditingPoiId(poi.id);
    setName(poi.name);
    setDescription(poi.description || '');
    // Support both 'type' and 'category' from backend
    setType(poi.category || poi.type || 'wc');
    setCapacity(poi.capacity?.toString() || '');
    setSelectedEventId(poi.eventId?.toString() || '');
    setIsWheelchairAccessible(poi.isWheelchairAccessible);
    
    if (poi.geometry?.coordinates) {
      selectPoi({ 
        lng: poi.geometry.coordinates[0], 
        lat: poi.geometry.coordinates[1] 
      });
    }
    
    setIsInterfaceOpen(true);
  };

  const handleRegisterAsset = async () => {
    setFormError('');
    if (!name || !type || !selectedPoi || !selectedEventId) {
      setFormError('Please fill in all required fields and select a location on the map.');
      return;
    }
    setIsSubmitting(true);
    try {
      const url = editingPoiId 
        ? `http://localhost:3000/api/v1/pois/${editingPoiId}`
        : 'http://localhost:3000/api/v1/pois';
      
      const method = editingPoiId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          name,
          description,
          category: type, // API often expects category
          type: type,     // Legacy support
          geometry: { type: 'Point', coordinates: [selectedPoi.lng, selectedPoi.lat] },
          capacity: parseInt(capacity) || 0,
          isWheelchairAccessible,
        }),
      });

      if (res.ok) {
        setIsInterfaceOpen(false);
        refetch();
        // Reset
        setName('');
        setDescription('');
        setCapacity('');
        clearPoi();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setFormError(errorData.message || `Server error: ${res.status}`);
      }
    } catch (err) {
      console.error('Failed to register asset', err);
      setFormError('Network error. Please check if the API is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncSocial = async (id: number) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/social/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'poi', id }),
      });
      if (res.ok) refetch();
    } catch (err) {
      console.error('Sync failed', err);
    }
  };

  const mapViewState = useMemo(() => {
    if (!selectedEvent?.center) return undefined;
    return {
      longitude: selectedEvent.center.coordinates[0],
      latitude: selectedEvent.center.coordinates[1],
      zoom: 16,
    };
  }, [selectedEvent]);

  const activeEventBoundary = useMemo(
    () =>
      selectedEvent?.boundary
        ? { type: 'Feature', geometry: selectedEvent.boundary, properties: {} }
        : null,
    [selectedEvent]
  );

  return (
    <div className="space-y-12 px-8 pt-[calc(var(--admin-safe-area)+1.5rem)] pb-24">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">
            Global Asset Registry
          </p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Monitoring infrastructure and amenities.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Centralized management of stages, services, and amenities. Integrated DataForSEO
            telemetry for real-world social proof.
          </p>
        </div>
      </header>

      {/* Full-Screen Interface */}
      {isInterfaceOpen && (
        <div className="fixed inset-0 z-[100] bg-eggshell flex flex-col animate-in fade-in duration-300 w-screen h-screen">
          <div className="h-20 border-b border-chalk flex items-center justify-between px-12 shrink-0 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gravel">Lattice Studio</span>
              <div className="w-1 h-1 rounded-full bg-chalk" />
              <h2 className="waldenburg-display text-admin-xl text-obsidian">
                {editingPoiId ? 'Configure Asset' : 'Register Infrastructure'}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-chalk hover:border-obsidian"
              onClick={() => setIsInterfaceOpen(false)}
            >
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Map */}
            <div className="flex-1 bg-powder/30 relative border-r border-chalk">
              <AdminMap
                mode="PICK_COORDINATE"
                selectedPoi={selectedPoi}
                onPoiSelect={selectPoi}
                activeEventBoundary={activeEventBoundary}
                initialViewState={mapViewState}
              />
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-white/90 backdrop-blur-sm px-5 py-4 border border-chalk/60 shadow-subtle-2 max-w-[260px]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian mb-1.5">
                    Location Picker
                  </p>
                  <p className="text-[11px] text-gravel leading-relaxed">
                    {selectedEventId
                      ? `Place pin within ${selectedEvent?.name}.`
                      : 'Select an event context first.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-[450px] bg-white overflow-y-auto p-12 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gravel">1. Operational Context</p>
                <Select
                  className="w-full"
                  aria-label="Select parent event"
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
                  <Select.Trigger className="bg-white border border-chalk rounded-xl h-12 px-5 outline-none shadow-hairline flex items-center justify-between">
                    <Select.Value className="text-admin-sm font-medium text-obsidian">
                      {selectedEvent?.name || 'Choose event...'}
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox
                      items={events}
                      className="bg-white border border-chalk rounded-xl p-2 min-w-[300px] shadow-subtle max-h-60 overflow-y-auto"
                    >
                      {(e: { id: number | string; name: string }) => (
                        <ListBox.Item
                          id={e.id.toString()}
                          textValue={e.name}
                          className="flex items-center px-4 py-3 rounded-lg text-admin-sm font-medium text-gravel hover:bg-powder cursor-pointer outline-none focus:bg-powder"
                        >
                          {e.name}
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gravel">2. Asset Definition</p>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Asset Name</p>
                  <Input
                    placeholder="e.g. South Gate, Medical tent A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-admin-base font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Category</p>
                  <div className="grid grid-cols-2 gap-3">
                    {POI_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-3
                        ${type === t.value ? 'bg-obsidian border-obsidian text-eggshell shadow-subtle' : 'bg-white border-chalk text-gravel hover:bg-powder/50'}`}
                      >
                        <span className="text-xl">{t.emoji}</span>
                        <span className="text-[11px] font-black uppercase tracking-tighter truncate">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Estimated Capacity</p>
                  <Input
                    type="number"
                    placeholder="Maximum occupancy"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="h-12 text-admin-base font-medium"
                  />
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-4 border-t border-chalk">
                {formError && (
                  <p className="text-[11px] font-black text-ember uppercase tracking-widest">
                    {formError}
                  </p>
                )}
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    className="flex-1 h-12 text-[11px] font-black uppercase tracking-widest"
                    onClick={() => {
                      setIsInterfaceOpen(false);
                      setFormError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1 h-12 text-[11px] font-black uppercase tracking-widest" onClick={handleRegisterAsset}>
                    {isSubmitting ? <Spinner size="sm" color="current" /> : (editingPoiId ? 'Update Asset' : 'Confirm Asset')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {/* Toolbar - integrated with canvas */}
        <div className="w-full bg-white/40 backdrop-blur-md border border-chalk/60 border-b-0 shadow-subtle">
          {/* Top row: title + matched count + create button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-chalk/60 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="waldenburg-display text-[28px] text-obsidian leading-none">Points of Interest</h2>
              {!loading && (
                <span className={`px-2.5 py-1 text-[9px] font-black border uppercase tracking-widest ${
                  filteredPois.length === 0
                    ? 'bg-ember/10 text-ember border-ember/20'
                    : 'bg-powder text-obsidian border-chalk'
                }`}>
                  {filteredPois.length} matched
                </span>
              )}
            </div>
            <Button variant="primary" onClick={handleOpenCreate} className="h-9 px-5 text-[11px] font-black uppercase tracking-widest">
              <Icons.Plus className="w-3.5 h-3.5 mr-1.5" />
              New Asset
            </Button>
          </div>

          {/* Search + filters row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-0 lg:divide-x divide-chalk/60 divide-y lg:divide-y-0">
            {/* Search — takes up all remaining space */}
            <div className="flex-1 flex items-center gap-3 px-6 py-3.5">
              <Icons.Search className="w-4 h-4 text-gravel/40 shrink-0" />
              <input
                type="text"
                placeholder="Search assets by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-admin-base text-obsidian placeholder:text-gravel/40 outline-none font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gravel/40 hover:text-obsidian transition-colors shrink-0"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type filter */}
            <div className="flex items-center justify-center px-4 py-3 shrink-0 lg:w-48">
              <Select
                placeholder="Asset Type"
                selectedKeys={typeFilter}
                onSelectionChange={setTypeFilter}
              >
                <Select.Trigger className="rounded-xl border border-chalk/60 h-10 px-4 bg-white/50 hover:bg-white transition-all flex items-center justify-center outline-none focus:border-obsidian min-w-[140px]">
                  <Select.Value className="text-[11px] font-bold text-obsidian uppercase tracking-wider text-center" />
                </Select.Trigger>
                <Select.Popover className="rounded-2xl border border-chalk/60 shadow-massive bg-white/80 backdrop-blur-xl p-1 min-w-[200px] max-w-[240px] z-[500]">
                  <ListBox className="outline-none">
                    <ListBox.Item id="all" textValue="All Types" className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center">
                      All Types
                    </ListBox.Item>
                    {POI_TYPES.map((t) => (
                      <ListBox.Item key={t.value} id={t.value} textValue={t.label} className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center">
                        {t.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Event filter */}
            <div className="flex items-center justify-center px-4 py-3 shrink-0 lg:w-56 border-l border-chalk/60">
              <Select
                placeholder="Parent Event"
                selectedKeys={eventFilter}
                onSelectionChange={setEventFilter}
              >
                <Select.Trigger className="rounded-xl border border-chalk/60 h-10 px-4 bg-white/50 hover:bg-white transition-all flex items-center justify-center outline-none focus:border-obsidian min-w-[140px]">
                  <Select.Value className="text-[11px] font-bold text-obsidian uppercase tracking-wider text-center" />
                </Select.Trigger>
                <Select.Popover className="rounded-2xl border border-chalk/60 shadow-massive bg-white/80 backdrop-blur-xl p-1 min-w-[200px] max-w-[240px] z-[500]">
                  <ListBox className="outline-none">
                    <ListBox.Item id="all" textValue="Global Assets" className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center">
                      Global Assets
                    </ListBox.Item>
                    {events.map((e: any) => (
                      <ListBox.Item key={e.id.toString()} id={e.id.toString()} textValue={e.name} className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center">
                        {e.name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Clear filters — only shown when active */}
            {(searchTerm || 
              (selectionValue(typeFilter) && selectionValue(typeFilter) !== 'all') || 
              (selectionValue(eventFilter) && selectionValue(eventFilter) !== 'all')) && (
              <div className="px-5 py-3.5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter(new Set([]));
                    setEventFilter(new Set([]));
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ember hover:bg-ember/5 transition-all h-8 px-3 rounded-lg"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-table-container">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-chalk bg-powder/20">
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">ID</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Asset Details</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Social Proof</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Location / Address</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Occupancy (Live)</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-center">Accessibility</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Status</th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-24 text-center"><Spinner color="current" size="sm" /></td></tr>
              ) : filteredPois.length === 0 ? (
                <tr><td colSpan={8} className="py-24 text-center text-gravel font-medium uppercase text-[10px] tracking-[0.2em]">No asset matches found.</td></tr>
              ) : (
                filteredPois.map((poi: any) => {
                  const occupancy = poi.capacity ? Math.round((poi.currentOccupancy / poi.capacity) * 100) : 0;
                  const status = poi.status || 'open';
                  const social = poi.metadata?.social;

                  return (
                    <tr key={poi.id} className="border-b border-chalk hover:bg-powder/10 transition-colors group">
                      <td className="py-6 px-6 font-mono text-admin-xs text-slate opacity-50">POI-{poi.id.toString().padStart(3, '0')}</td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-obsidian text-admin-base uppercase tracking-tight">{poi.name}</span>
                          <span className="text-[11px] text-gravel uppercase tracking-wider font-medium opacity-50">{poi.eventName || 'Global Asset'}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        {social ? (
                          <div className="flex items-center gap-2">
                            <Icons.Star className="w-3 h-3 text-amber fill-amber" />
                            <span className="text-admin-sm font-black text-obsidian">{social.rating}</span>
                            <span className="text-[10px] text-gravel font-medium opacity-50">({social.reviews_count})</span>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-7 px-3 text-[9px] font-black uppercase tracking-widest" onClick={() => syncSocial(poi.id)}>Sync</Button>
                        )}
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col max-w-[250px]">
                          <span className="text-admin-base font-bold text-obsidian truncate uppercase tracking-tight">{poi.locationName || 'Location Pending'}</span>
                          <span className="text-[11px] text-gravel leading-tight truncate opacity-50" title={poi.address}>{poi.address || 'Coordinates resolved'}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1 bg-chalk rounded-full overflow-hidden">
                            <div className={`h-full ${occupancy > 80 ? 'bg-ember' : 'bg-obsidian'}`} style={{ width: `${occupancy}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-obsidian">{occupancy}%</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-gravel opacity-50">
                          {poi.isWheelchairAccessible && <Icons.Accessibility className="w-4 h-4" />}
                          {poi.hasPriorityLane && <Icons.UserCheck className="w-4 h-4 text-signal-blue" />}
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 ${
                          status === 'open' ? 'bg-obsidian text-white' : 
                          status === 'maintenance' ? 'bg-ember text-white' : 
                          'bg-chalk text-gravel opacity-50'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/?poiId=${poi.id}`)}
                            className="text-[10px] font-bold uppercase tracking-wider text-obsidian bg-white/50 hover:bg-white border border-chalk/60 px-4 py-1.5 rounded-xl transition-all hover:shadow-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenEdit(poi)}
                            className="text-[10px] font-bold uppercase tracking-wider text-obsidian bg-white/50 hover:bg-white border border-chalk/60 px-4 py-1.5 rounded-xl transition-all hover:shadow-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
