'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { usePOIs, useEvents, API_BASE } from '@/hooks/use-admin-data';
import { useSocket } from '@/hooks/use-socket';
import dynamic from 'next/dynamic';
import { useMapInteractions } from '@/components/map/use-map-interactions';
import { useRouter } from 'next/navigation';

const AdminMap = dynamic(() => import('@/components/map/admin-map').then((mod) => mod.AdminMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-elevated animate-pulse flex items-center justify-center text-gravel uppercase text-[10px] font-medium tracking-widest">
      Initializing Map Engine...
    </div>
  ),
});

const POI_TYPES = [
  { value: 'wc', label: 'Toilets', icon: Icons.Baby },
  { value: 'restaurant', label: 'Restaurant', icon: Icons.Utensils },
  { value: 'bar', label: 'Bar', icon: Icons.Wine },
  { value: 'medical', label: 'Medical', icon: Icons.Hospital },
  { value: 'gate', label: 'Entrance/Gate', icon: Icons.LogIn },
  { value: 'information', label: 'Info', icon: Icons.Info },
  { value: 'emergency', label: 'Emergency', icon: Icons.AlertTriangle },
  { value: 'parking', label: 'Parking', icon: Icons.MapPin },
  { value: 'shop', label: 'Shop', icon: Icons.ShoppingBag },
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
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());

  // Form State
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('wc');
  const [capacity, setCapacity] = useState('');
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState(true);

  const [address, setAddress] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectionSource, setSelectionSource] = useState<'CLICK' | 'SEARCH' | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poiToDeleteId, setPoiToDeleteId] = useState<number | null>(null);

  const { selectedPoi, selectPoi, clearPoi } = useMapInteractions('PICK_COORDINATE');

  // Auto-resolve address when pin is placed
  useEffect(() => {
    if (selectedPoi && selectedPoi.lat && selectedPoi.lng) {
      const resolve = async () => {
        try {
          const res = await fetch(`${API_BASE}/resolve-address?lat=${selectedPoi.lat}&lng=${selectedPoi.lng}`);
          if (res.ok) {
            const data = await res.json();
            setAddress(data.address);
            // Use the first part of the address as locationName if it's not already set
            if (!locationName) {
              setLocationName(data.address.split(',')[0]);
            }
          }
        } catch (err) {
          console.error('Failed to resolve address', err);
        }
      };
      resolve();
    }
  }, [selectedPoi?.lat, selectedPoi?.lng]);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id.toString() === selectedEventId),
    [events, selectedEventId]
  );

  const filteredPois = useMemo(() => {
    const typeValue = selectionValue(typeFilter);
    const eventValue = selectionValue(eventFilter);

    return pois.filter((poi) => {
      const matchesSearch =
        poi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poi.locationName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeValue || typeValue === 'all' || poi.type === typeValue;
      const matchesEvent = !eventValue || eventValue === 'all' || poi.eventId?.toString() === eventValue;
      return matchesSearch && matchesType && matchesEvent;
    });
  }, [pois, searchTerm, typeFilter, eventFilter]);

  const resetForm = React.useCallback(() => {
    setEditingPoiId(null);
    setName('');
    setDescription('');
    setType('wc');
    setCapacity('');
    setIsWheelchairAccessible(true);
    setAddress('');
    setLocationName('');
    setSelectionSource(null);
    clearPoi();
    setFormError('');
  }, [clearPoi]);

  const handleOpenCreate = () => {
    resetForm();
    setIsInterfaceOpen(true);
  };

  const handleOpenEdit = (poi: any) => {
    setEditingPoiId(poi.id);
    setName(poi.name);
    setDescription(poi.description || '');
    setType(poi.type);
    setCapacity(poi.capacity?.toString() || '');
    setIsWheelchairAccessible(poi.isWheelchairAccessible);
    setSelectedEventId(poi.eventId?.toString() || '');
    setAddress(poi.address || '');
    setLocationName(poi.locationName || '');
    setSelectionSource('CLICK');
    
    const coords = poi.geometry?.coordinates || poi.center?.coordinates;
    if (coords) {
      selectPoi({
        id: poi.id,
        name: poi.name,
        lng: coords[0],
        lat: coords[1],
        category: poi.type,
      });
    }
    setIsInterfaceOpen(true);
  };

  const handleRegisterAsset = async () => {
    if (!name || !type || !selectedPoi) {
      setFormError('Identity and location are mandatory for registration.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const poiData = {
        name,
        description,
        type,
        capacity: capacity ? parseInt(capacity) : null,
        isWheelchairAccessible,
        eventId: selectedEventId ? parseInt(selectedEventId) : null,
        address,
        locationName,
        geometry: {
          type: 'Point',
          coordinates: [selectedPoi.lng, selectedPoi.lat],
        },
      };

      const url = editingPoiId ? `${API_BASE}/pois/${editingPoiId}` : `${API_BASE}/pois`;
      const method = editingPoiId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poiData),
      });

      if (res.ok) {
        setIsInterfaceOpen(false);
        resetForm();
        refetch();
      } else {
        const err = await res.json();
        setFormError(err.error || 'Registration failed.');
      }
    } catch (err) {
      setFormError('Network error during asset synchronization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePoi = async (id?: number) => {
    const targetId = id || editingPoiId || poiToDeleteId;
    if (!targetId) return;
    
    // Instead of native confirm, we open our custom modal
    if (!isDeleteModalOpen) {
      setPoiToDeleteId(targetId);
      setIsDeleteModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/pois/${targetId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsInterfaceOpen(false);
        setIsDeleteModalOpen(false);
        setPoiToDeleteId(null);
        resetForm();
        refetch();
      }
    } catch (err) {
      console.error('Failed to delete POI', err);
    }
  };

  const syncSocial = async (id: number) => {
    if (syncingIds.has(id)) return;
    
    setSyncingIds(prev => new Set(prev).add(id));
    try {
      const res = await fetch(`${API_BASE}/social/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'poi', id }),
      });
      if (res.ok) refetch();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
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
    <div className="space-y-12 px-8 pt-[calc(var(--admin-safe-area)+1.5rem)] pb-24 transition-colors duration-300">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">
            Global Asset Registry
          </p>
          <h1 className="waldenburg-display text-admin-display text-foreground leading-[1.08] mb-4">
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
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-300 w-screen h-screen transition-colors">
          <div className="h-20 border-b border-border flex items-center justify-between px-12 shrink-0 bg-surface">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gravel">Lattice Studio</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <h2 className="waldenburg-display text-admin-xl text-foreground">
                {editingPoiId ? 'Configure Asset' : 'Register Infrastructure'}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-border hover:border-foreground transition-all group/close"
              onClick={() => setIsInterfaceOpen(false)}
            >
              <Icons.X className="w-5 h-5 text-gravel group-hover/close:text-foreground transition-colors" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Map */}
            <div className="flex-1 bg-elevated/20 relative border-r border-border transition-colors">
              <AdminMap
                mode="PICK_COORDINATE"
                selectedPoi={selectedPoi}
                onPoiSelect={selectPoi}
                activeEventBoundary={activeEventBoundary}
                initialViewState={mapViewState}
                selectedCategory={type}
                selectionSource={selectionSource}
              />
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-surface border-border shadow-massive max-w-[260px]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground mb-1.5">
                    Location Picker
                  </p>
                  <p className="text-[11px] text-gravel leading-relaxed font-medium">
                    {selectedEventId
                      ? `Place pin within ${selectedEvent?.name}.`
                      : 'Select an event context first.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-[450px] bg-surface overflow-hidden flex flex-col transition-colors">
              <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                <div className="space-y-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gravel">1. Operational Context</p>
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
                    <Select.Trigger className="bg-elevated/40 border border-border rounded-xl h-14 px-6 outline-none transition-all focus:border-foreground flex items-center justify-between">
                      <Select.Value className="text-admin-sm font-medium text-foreground uppercase tracking-tight">
                        {selectedEvent?.name || 'Choose context...'}
                      </Select.Value>
                    </Select.Trigger>
                    <Select.Popover className="rounded-2xl border border-border shadow-massive bg-surface border border-border shadow-massive">
                      <ListBox
                        items={events}
                        className="outline-none"
                      >
                        {(e: { id: number | string; name: string }) => (
                          <ListBox.Item
                            id={e.id.toString()}
                            textValue={e.name}
                            className="flex items-center px-4 py-3 rounded-xl text-[11px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background"
                          >
                            {e.name}
                          </ListBox.Item>
                        )}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gravel">2. Asset Definition</p>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-gravel">Asset Name</p>
                    <input
                      placeholder="e.g. South Gate, Medical tent A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-all font-medium uppercase tracking-tight rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-gravel">Category</p>
                    <div className="grid grid-cols-2 gap-3">
                      {POI_TYPES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setType(t.value)}
                          className={`px-4 py-4 rounded-xl border transition-all flex items-center gap-3 active:scale-[0.97]
                          ${type === t.value ? 'bg-foreground border-foreground text-background shadow-massive' : 'bg-elevated/20 border-border text-gravel hover:bg-elevated hover:text-foreground'}`}
                        >
                          <t.icon className="w-5 h-5 shrink-0" />
                          <span className="text-[10px] font-medium uppercase tracking-tighter truncate">
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-gravel">Estimated Capacity</p>
                    <input
                      type="number"
                      placeholder="Maximum occupancy"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-all font-medium uppercase tracking-tight rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface border-t border-border p-10 flex flex-col gap-4">
                {formError && (
                  <p className="text-[10px] font-medium text-ember uppercase tracking-widest mb-2">
                    {formError}
                  </p>
                )}
                
                <div className="flex gap-4">
                  <button
                    className="flex-1 h-14 text-[11px] font-medium uppercase tracking-widest text-gravel hover:text-foreground transition-colors"
                    onClick={() => {
                      setIsInterfaceOpen(false);
                      setFormError('');
                    }}
                  >
                    Abort
                  </button>
                  
                  {editingPoiId && (
                    <button
                      onClick={handleDeletePoi}
                      className="flex-1 h-14 text-[11px] font-medium uppercase tracking-widest text-ember bg-ember/5 hover:bg-ember/10 transition-colors border border-ember/20 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}

                  <button 
                    onClick={handleRegisterAsset}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-xl bg-foreground text-background text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.95] transition-all shadow-massive disabled:opacity-50"
                  >
                    {isSubmitting ? 'Syncing...' : (editingPoiId ? 'Update Asset' : 'Confirm Asset')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {/* Toolbar - integrated with canvas */}
        <div className="w-full bg-surface border border-border/60 border-b-0 shadow-subtle transition-colors">
          {/* Top row: title + matched count + create button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-border/60 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="waldenburg-display text-[28px] text-foreground leading-none">Points of Interest</h2>
              {!loading && (
                <span className={`px-2.5 py-1 text-[9px] font-medium border uppercase tracking-widest ${
                  filteredPois.length === 0
                    ? 'bg-ember/10 text-ember border-ember/20'
                    : 'bg-elevated text-foreground border-border'
                }`}>
                  {filteredPois.length} matched
                </span>
              )}
            </div>
            <Button 
              variant="primary" 
              onClick={handleOpenCreate} 
              className="h-10 px-6 text-[11px] font-medium uppercase tracking-widest shadow-massive"
            >
              <Icons.Plus className="w-3.5 h-3.5 mr-2" />
              New Asset
            </Button>
          </div>

          {/* Search + filters row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-0 lg:divide-x divide-border/60 divide-y lg:divide-y-0">
            {/* Search — takes up all remaining space */}
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <Icons.Search className="w-4 h-4 text-gravel/40 shrink-0" />
              <input
                type="text"
                placeholder="Search assets by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-admin-base text-foreground placeholder:text-gravel/40 outline-none font-medium uppercase tracking-tight"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gravel/40 hover:text-foreground transition-colors shrink-0"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type filter */}
            <div className="flex items-center justify-center px-4 py-4 shrink-0 lg:w-48">
              <Select
                placeholder="Asset Type"
                selectedKeys={typeFilter}
                onSelectionChange={setTypeFilter}
              >
                <Select.Trigger className="rounded-xl border border-border/60 h-10 px-5 bg-surface/50 hover:bg-surface transition-all flex items-center justify-center outline-none focus:border-foreground min-w-[140px]">
                  <Select.Value className="text-[10px] font-medium text-foreground uppercase tracking-wider text-center" />
                </Select.Trigger>
                <Select.Popover className="rounded-2xl border border-border/60 shadow-massive bg-surface border border-border/60 shadow-massive">
                  <ListBox className="outline-none">
                    <ListBox.Item id="all" textValue="All Types" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      All Types
                    </ListBox.Item>
                    {POI_TYPES.map((t) => (
                      <ListBox.Item key={t.value} id={t.value} textValue={t.label} className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                        {t.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Event filter */}
            <div className="flex items-center justify-center px-4 py-4 shrink-0 lg:w-56 border-l border-border/60">
              <Select
                placeholder="Parent Event"
                selectedKeys={eventFilter}
                onSelectionChange={setEventFilter}
              >
                <Select.Trigger className="rounded-xl border border-border/60 h-10 px-5 bg-surface/50 hover:bg-surface transition-all flex items-center justify-center outline-none focus:border-foreground min-w-[140px]">
                  <Select.Value className="text-[10px] font-medium text-foreground uppercase tracking-wider text-center" />
                </Select.Trigger>
                <Select.Popover className="rounded-2xl border border-border/60 shadow-massive bg-surface border border-border/60 shadow-massive">
                  <ListBox className="outline-none">
                    <ListBox.Item id="all" textValue="Global Assets" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      Global Assets
                    </ListBox.Item>
                    {events.map((e: any) => (
                      <ListBox.Item key={e.id.toString()} id={e.id.toString()} textValue={e.name} className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
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
              <div className="px-5 py-4 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter(new Set([]));
                    setEventFilter(new Set([]));
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-ember hover:bg-ember/5 transition-all h-9 px-4 rounded-xl"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-table-container transition-colors">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-border bg-elevated/20">
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium">ID</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium">Asset Details</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Social Proof</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium">Location / Address</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Occupancy (Live)</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Accessibility</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Status</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="transition-colors divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan={8} className="py-24 text-center"><Spinner color="current" size="sm" /></td></tr>
              ) : filteredPois.length === 0 ? (
                <tr><td colSpan={8} className="py-24 text-center text-gravel font-medium uppercase text-[10px] tracking-[0.25em] opacity-40">No asset matches found.</td></tr>
              ) : (
                filteredPois.map((poi: any) => {
                  const occupancy = poi.capacity ? Math.round((poi.currentOccupancy / poi.capacity) * 100) : 0;
                  const status = poi.status || 'open';
                  const social = poi.metadata?.social;

                  return (
                    <tr key={poi.id} className="border-b border-border hover:bg-elevated/10 transition-all group">
                      <td className="py-4 px-6 font-mono text-admin-xs text-slate opacity-40">POI-{poi.id.toString().padStart(3, '0')}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-admin-base uppercase tracking-tight transition-colors">{poi.name}</span>
                          <span className="text-[10px] text-gravel uppercase tracking-wider font-medium opacity-40">{poi.eventName || 'Global Asset'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => !social && !syncingIds.has(poi.id) && syncSocial(poi.id)}
                            disabled={syncingIds.has(poi.id)}
                            className={`flex flex-col items-center gap-1.5 transition-all ${!social && !syncingIds.has(poi.id) ? 'hover:scale-110 cursor-pointer group/stars' : ''} ${syncingIds.has(poi.id) ? 'opacity-50 cursor-wait' : ''}`}
                            title={social ? `${social.rating} / 5 (${social.reviews_count} reviews)` : syncingIds.has(poi.id) ? 'Syncing...' : 'Click to sync social proof'}
                          >
                            <div className="flex items-center gap-0.5">
                              {syncingIds.has(poi.id) ? (
                                <Icons.RefreshCw className="w-4 h-4 text-amber animate-spin" />
                              ) : (
                                [1, 2, 3, 4, 5].map((star) => {
                                  const rating = social?.rating || 0;
                                  const isFilled = star <= Math.round(rating);
                                  return (
                                    <Icons.Star 
                                      key={star} 
                                      className={`w-3.5 h-3.5 ${
                                        isFilled 
                                          ? 'text-amber fill-amber' 
                                          : 'text-gravel/20 group-hover/stars:text-gravel/40'
                                      } transition-colors`} 
                                    />
                                  );
                                })
                              )}
                            </div>
                            {social && !syncingIds.has(poi.id) && (
                              <span className="text-[9px] font-bold text-gravel opacity-40 uppercase tracking-widest">
                                {social.rating} ({social.reviews_count})
                              </span>
                            )}
                            {!social && (
                              <span className="text-[8px] font-bold text-gravel opacity-20 uppercase tracking-widest group-hover/stars:opacity-50">
                                {syncingIds.has(poi.id) ? 'Syncing...' : 'No Data · Sync'}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start justify-center max-w-[300px]">
                          <span className="text-[10px] text-gravel leading-tight opacity-40 font-medium uppercase tracking-wider">
                            {poi.address || 'Location Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-20 h-1.5 bg-border/40 rounded-full overflow-hidden">
                            <div className={`h-full ${occupancy > 80 ? 'bg-ember' : 'bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.2)]'}`} style={{ width: `${occupancy}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-foreground w-8">{occupancy}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3 text-gravel opacity-40">
                          {poi.isWheelchairAccessible && <Icons.Accessibility className="w-5 h-5" />}
                          {poi.hasPriorityLane && <Icons.UserCheck className="w-5 h-5 text-signal-blue" />}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm inline-block ${
                          status === 'open' ? 'bg-foreground text-background shadow-lg' : 
                          status === 'maintenance' ? 'bg-ember text-white shadow-lg' : 
                          'bg-border text-gravel opacity-40'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => router.push(`/?poiId=${poi.id}`)}
                            className="h-9 px-5 text-[10px] font-medium uppercase tracking-widest text-foreground bg-surface/50 hover:bg-surface border border-border rounded-xl transition-all hover:shadow-massive active:scale-95"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenEdit(poi)}
                            className="h-9 px-5 text-[10px] font-medium uppercase tracking-widest text-foreground bg-surface/50 hover:bg-surface border border-border rounded-xl transition-all hover:shadow-massive active:scale-95"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeletePoi(poi.id);
                            }}
                            className="h-9 w-9 flex items-center justify-center text-gravel hover:text-ember bg-surface/50 hover:bg-ember/5 border border-border rounded-xl transition-all active:scale-95 shrink-0"
                            title="Delete Asset"
                          >
                            <Icons.Trash className="w-3.5 h-3.5" />
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface border border-border/60 shadow-massive p-10 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-ember/10 flex items-center justify-center">
                <Icons.AlertTriangle className="w-8 h-8 text-ember" />
              </div>
              
              <div className="space-y-2">
                <h3 className="waldenburg-display text-2xl text-foreground">Confirm Deletion</h3>
                <p className="text-admin-base text-gravel font-medium uppercase tracking-tight opacity-60">
                  Are you sure you want to remove this asset? This action is permanent and cannot be undone.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={() => handleDeletePoi()}
                  className="w-full h-14 bg-ember text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-ember/90 transition-all shadow-lg active:scale-[0.98]"
                >
                  Delete Asset Permanently
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPoiToDeleteId(null);
                  }}
                  className="w-full h-14 text-[11px] font-medium uppercase tracking-widest text-gravel hover:text-foreground transition-colors"
                >
                  Keep Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
