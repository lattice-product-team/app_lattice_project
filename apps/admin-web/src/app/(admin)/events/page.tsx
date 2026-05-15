'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Spinner, Select, ListBox, Selection } from '@heroui/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEvents, API_BASE } from '@/hooks/use-admin-data';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

const AdminMap = dynamic(() => import('@/components/map/admin-map').then((mod) => mod.AdminMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-elevated animate-pulse flex items-center justify-center text-gravel uppercase text-[10px] font-medium tracking-widest">
      Initializing Map Engine...
    </div>
  ),
});

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { events, loading, refetch } = useEvents();

  // Interface State
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['all']));
  const [capacityFilter, setCapacityFilter] = useState<Selection>(new Set(['all']));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [activeEventBoundaryGeoJSON, setActiveEventBoundaryGeoJSON] = useState<any>(null);
  const [mapInitialView, setMapInitialView] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 15,
  });

  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());


  const handleDeleteEvent = async (id?: number) => {
    const targetId = id || eventToDeleteId;
    if (!targetId) return;

    if (!id) {
      // Logic for modal confirmation
      setIsDeleteModalOpen(true);
      setEventToDeleteId(targetId);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/events/${targetId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setEventToDeleteId(null);
        refetch();
      }
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  // Handle incoming eventId from Manage action
  useEffect(() => {
    const targetId = searchParams.get('eventId');
    if (targetId && events.length > 0) {
      const targetEvent = events.find((e) => e.id.toString() === targetId);
      if (targetEvent) {
        setSearchTerm(targetEvent.name);
        // Optional: clear param to avoid re-filtering on refresh
        const params = new URLSearchParams(searchParams.toString());
        params.delete('eventId');
        router.replace(`/events?${params.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, events, router]);

  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([]);

  // Selection helpers
  const selectionValue = (sel: Selection): string => {
    if (sel === 'all') return 'all';
    const arr = Array.from(sel as Set<string | number>);
    return arr.length > 0 ? String(arr[0]) : '';
  };

  const filteredEvents = useMemo(() => {
    const statusValue = selectionValue(statusFilter);
    const capacityValue = selectionValue(capacityFilter);

    return events.filter((event: any) => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());

      const end = new Date(event.endDate);
      const isActive = end > new Date();
      const matchesStatus =
        !statusValue ||
        statusValue === 'all' ||
        (statusValue === 'active' && isActive) ||
        (statusValue === 'past' && !isActive);

      const metadata =
        typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata;
      const capacity = metadata?.capacity || 0;
      const matchesCapacity =
        !capacityValue ||
        capacityValue === 'all' ||
        (capacityValue === 'massive' && capacity >= 10000) ||
        (capacityValue === 'medium' && capacity >= 1000 && capacity < 10000) ||
        (capacityValue === 'small' && capacity < 1000);

      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [events, searchTerm, statusFilter, capacityFilter]);

  const clearBoundary = useCallback(() => {
    setBoundaryPoints([]);
  }, []);

  const undoLastPoint = useCallback(() => {
    setBoundaryPoints((prev) => prev.slice(0, -1));
  }, []);

  const resetForm = useCallback(() => {
    setEditingEventId(null);
    setName('');
    setStartDate('');
    setEndDate('');
    setLocationName('');
    setAddress('');
    setBoundaryPoints([]);
    setFormError('');
  }, []);

  const handleOpenCreate = () => {
    resetForm();
    setIsInterfaceOpen(true);
  };

  const handleOpenEdit = (event: any) => {
    setEditingEventId(event.id);
    setName(event.name);
    setStartDate(new Date(event.startDate).toISOString().slice(0, 16));
    setEndDate(new Date(event.endDate).toISOString().slice(0, 16));
    setLocationName(event.locationName || '');
    setAddress(event.address || '');

    // boundary is returned as a top-level GeoJSON Polygon from the API
    const boundary = event.boundary;
    if (boundary?.coordinates?.[0]) {
      // The ring closes itself ([0] === last point), strip the closing point
      const coords = boundary.coordinates[0].slice(0, -1) as [number, number][];
      setBoundaryPoints(coords);

      // Full GeoJSON Feature so AdminMap can fitBounds
      const boundaryGeoJSON = {
        type: 'Feature',
        geometry: boundary,
        properties: {},
      };
      setActiveEventBoundaryGeoJSON(boundaryGeoJSON);

      // Compute centroid for initial view
      const allCoords = boundary.coordinates[0] as [number, number][];
      const centroidLng =
        allCoords.reduce((s: number, c: [number, number]) => s + c[0], 0) / allCoords.length;
      const centroidLat =
        allCoords.reduce((s: number, c: [number, number]) => s + c[1], 0) / allCoords.length;
      setMapInitialView({ longitude: centroidLng, latitude: centroidLat, zoom: 16 });
    } else {
      clearBoundary();
      setActiveEventBoundaryGeoJSON(null);
      setMapInitialView({ longitude: 2.2575, latitude: 41.5641, zoom: 15 });
    }

    setIsInterfaceOpen(true);
  };


  const handleCreateEvent = async () => {
    if (!name || !startDate || !endDate || !locationName || !address) {
      setFormError('All operational fields are required.');
      return;
    }

    if (boundaryPoints.length < 3) {
      setFormError('A valid boundary (at least 3 points) is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const boundary = {
        type: 'Polygon',
        coordinates: [[...boundaryPoints, boundaryPoints[0]]],
      };

      const url = editingEventId ? `${API_BASE}/events/${editingEventId}` : `${API_BASE}/events`;

      const method = editingEventId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          locationName,
          address,
          boundary,
        }),
      });

      if (res.ok) {
        setIsInterfaceOpen(false);
        resetForm();
        refetch();
      }
    } catch (err) {
      console.error('Failed to save event', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncSocial = async (id: number) => {
    if (syncingIds.has(id)) return;
    setSyncingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`${API_BASE}/social/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'event', id }),
      });
      if (res.ok) refetch();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsInterfaceOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="space-y-12 px-8 pt-[calc(var(--admin-safe-area)+1.5rem)] pb-12 relative transition-colors duration-300">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">
            Event Operations
          </p>
          <h1 className="waldenburg-display text-admin-display text-foreground leading-[1.08] mb-4">
            Monitoring global event lifecycles.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Oversee planning, execution, and post-event analysis. High-fidelity telemetry and
            DataForSEO social proof integration.
          </p>
        </div>
      </header>

      {/* Full-Screen Interface */}
      {/* --- LATTICE STUDIO: EVENT INTERFACE --- */}
      {isInterfaceOpen && (
        <div className="fixed inset-0 z-[100] bg-background animate-in fade-in duration-300">
          {/* Map Layer (Full Screen Background) */}
          <div className="absolute inset-0">
            <AdminMap
              mode="DRAW_BOUNDARY"
              boundaryPoints={boundaryPoints}
              onBoundaryChange={setBoundaryPoints}
              initialViewState={mapInitialView}
              activeEventBoundary={activeEventBoundaryGeoJSON}
            />


            
            {/* Map Interaction Controls */}
            <div className="absolute top-32 left-10 z-[110] flex flex-col gap-3">
              <div className="bg-surface/80 backdrop-blur-md border border-border/60 shadow-massive p-6 rounded-3xl max-w-[240px]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-2">
                  Boundary Definition
                </p>
                <p className="text-[11px] text-gravel leading-relaxed font-medium">
                  Click on the map to draw the event perimeter.
                </p>
              </div>
              {boundaryPoints.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={undoLastPoint}
                    className="flex-1 bg-surface/80 backdrop-blur-md border border-border/60 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-surface transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.RefreshCw className="w-3.5 h-3.5" />
                    Undo
                  </button>
                  <button
                    onClick={clearBoundary}
                    className="flex-1 bg-surface/80 backdrop-blur-md border border-ember/30 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-ember hover:bg-ember/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Trash className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Floating Close Button */}
          <div className="absolute top-10 left-10 z-[110]">
            <Button 
              variant="ghost" 
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-surface border border-border hover:border-foreground shadow-massive transition-colors group/close"
              onClick={() => setIsInterfaceOpen(false)}
            >
              <Icons.X className="w-6 h-6 text-gravel group-hover/close:text-foreground transition-colors" />
            </Button>
          </div>

          {/* Floating Studio Card */}
          <div className="absolute right-12 top-12 bottom-12 w-[460px] bg-surface rounded-[48px] shadow-massive border border-border overflow-hidden flex flex-col z-[105] animate-in slide-in-from-right-8 duration-500">
            
            {/* Header */}
            <div className="px-12 pt-12 pb-8 border-b border-border/40 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gravel/60 mb-2">Lattice Studio</p>
              <h2 className="waldenburg-display text-admin-xl text-foreground">
                {editingEventId ? 'Configure Lifecycle' : 'Initialize Event'}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-scroll custom-scrollbar px-12 py-10 space-y-12">
              
              {/* Section 1: Definition */}
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">1. Event Identity</p>
                
                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">Event Name</label>
                  <input
                    placeholder="e.g. Primavera Sound 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium uppercase tracking-tight rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">Venue Name</label>
                  <input
                    placeholder="e.g. Parc del Fòrum"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium uppercase tracking-tight rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">Address</label>
                  <input
                    placeholder="Street address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium uppercase tracking-tight rounded-2xl"
                  />
                </div>
              </div>

              {/* Section 2: Schedule */}
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">2. Temporal Context</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-xs text-foreground outline-none focus:border-foreground transition-colors font-medium rounded-2xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-xs text-foreground outline-none focus:border-foreground transition-colors font-medium rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Boundary */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">3. Geospatial Perimeter</p>
                <div className={`p-6 rounded-[2rem] border ${boundaryPoints.length > 2 ? 'bg-success/5 border-success/20' : 'border-dashed border-border'} flex flex-col items-center justify-center text-center gap-3`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${boundaryPoints.length > 2 ? 'bg-success text-white' : 'bg-elevated text-gravel/40'}`}>
                    <Icons.Map className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${boundaryPoints.length > 2 ? 'text-success' : 'text-gravel/40'}`}>
                      {boundaryPoints.length > 2 ? 'Boundary Defined' : 'No boundary defined'}
                    </p>
                    <p className="text-[9px] font-medium text-gravel/40 mt-1 uppercase tracking-tighter italic">
                      {boundaryPoints.length > 2 ? `${boundaryPoints.length} control points synchronized` : 'Tap on the map to create points'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-12 py-10 border-t border-border bg-surface flex flex-col gap-4 shrink-0">
              {formError && (
                <p className="text-[10px] font-semibold text-ember uppercase tracking-widest mb-2 px-2">
                  {formError}
                </p>
              )}
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCreateEvent}
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-full bg-foreground text-background text-[12px] font-black uppercase tracking-[0.25em] hover:opacity-90 active:scale-[0.98] transition-all shadow-massive disabled:opacity-50"
                >
                  {isSubmitting ? 'Syncing...' : (editingEventId ? 'Update Event' : 'Confirm Event')}
                </button>

                <div className="flex gap-3">
                  <button
                    className="flex-1 h-14 rounded-full text-[10px] font-bold uppercase tracking-widest text-gravel hover:text-foreground transition-colors bg-elevated/40 border border-border"
                    onClick={() => setIsInterfaceOpen(false)}
                  >
                    Cancel
                  </button>
                  
                  {editingEventId && (
                    <button
                      onClick={() => handleDeleteEvent(editingEventId)}
                      className="flex-1 h-14 rounded-full text-[10px] font-bold uppercase tracking-widest text-ember bg-ember/5 hover:bg-ember/10 transition-colors border border-ember/20 flex items-center justify-center gap-2"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {/* Toolbar - integrated with canvas */}
        <div className="w-full bg-surface/90 border border-border/60 border-b-0 shadow-subtle transition-colors">
          {/* Search + filters row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-0 lg:divide-x divide-border/60 divide-y lg:divide-y-0">
            {/* Search — takes up all remaining space */}
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <Icons.Search className="w-4 h-4 text-gravel/40 shrink-0" />
              <input
                type="text"
                placeholder="Search lifecycles by name or location..."
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

            {/* Status filter */}
            <div className="flex items-center justify-center px-4 py-4 shrink-0 lg:w-56">
              <Select
                placeholder="Lifecycle Status"
                selectedKeys={statusFilter}
                onSelectionChange={setStatusFilter}
              >
                <Select.Trigger className="rounded-xl border border-border/60 h-10 px-5 bg-surface/50 hover:bg-surface transition-all flex items-center justify-center outline-none focus:border-foreground min-w-[160px]">
                  <Select.Value className="text-[10px] font-medium text-foreground uppercase tracking-wider text-center" />
                </Select.Trigger>
                <Select.Popover className="rounded-2xl border border-border/60 shadow-massive bg-surface border border-border/60 shadow-massive">
                  <ListBox className="outline-none">
                    <ListBox.Item
                      id="all"
                      textValue="All Schedules"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      All Schedules
                    </ListBox.Item>
                    <ListBox.Item
                      id="active"
                      textValue="Live & Upcoming"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      Live & Upcoming
                    </ListBox.Item>
                    <ListBox.Item
                      id="past"
                      textValue="Past Events"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      Past Events
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Capacity filter */}
            <div className="flex items-center justify-center px-4 py-4 shrink-0 lg:w-56 border-l border-border/60">
              <Select
                placeholder="Audience Scale"
                selectedKeys={capacityFilter}
                onSelectionChange={setCapacityFilter}
              >
                <Select.Trigger className="rounded-xl border border-border/60 h-10 px-5 bg-surface/50 hover:bg-surface transition-all flex items-center justify-center outline-none focus:border-foreground min-w-[160px]">
                  <Select.Value className="text-[10px] font-medium text-foreground uppercase tracking-wider text-center" />
                </Select.Trigger>
                <Select.Popover className="rounded-2xl border border-border/60 shadow-massive bg-surface border border-border/60 shadow-massive">
                  <ListBox className="outline-none">
                    <ListBox.Item
                      id="all"
                      textValue="All Scales"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      All Scales
                    </ListBox.Item>
                    <ListBox.Item
                      id="massive"
                      textValue="Massive (>10k)"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      Massive (&gt;10k)
                    </ListBox.Item>
                    <ListBox.Item
                      id="medium"
                      textValue="Medium (1k-10k)"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      Medium (1k-10k)
                    </ListBox.Item>
                    <ListBox.Item
                      id="boutique"
                      textValue="Boutique (<1k)"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      Boutique (&lt;1k)
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Clear filters — only shown when active */}
            {(searchTerm ||
              (selectionValue(statusFilter) && selectionValue(statusFilter) !== 'all') ||
              (selectionValue(capacityFilter) && selectionValue(capacityFilter) !== 'all')) && (
              <div className="px-4 py-4 shrink-0 border-l border-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter(new Set([]));
                    setCapacityFilter(new Set([]));
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-ember hover:bg-ember/5 transition-all h-10 px-4 rounded-xl"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                  Clear
                </Button>
              </div>
            )}

            {/* Create Button — Now integrated into the filters row */}
            <div className="px-6 py-4 shrink-0 ml-auto border-l border-border/60 flex items-center">
              <Button 
                variant="primary" 
                onClick={handleOpenCreate} 
                className="h-10 px-8 text-[11px] font-bold uppercase tracking-[0.15em] shadow-massive"
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </div>

        <div className="admin-table-container transition-colors">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-border bg-elevated/20">
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  ID
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Event Details
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Rating
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Schedule
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Occupancy
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Location
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Capacity
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Status
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-right">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="transition-colors divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-24 text-center">
                    <Spinner color="current" size="sm" />
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-24 text-center text-gravel font-medium uppercase text-[10px] tracking-[0.2em]"
                  >
                    No operational matches found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event: any) => {
                  const metadata =
                    typeof event.metadata === 'string'
                      ? JSON.parse(event.metadata)
                      : event.metadata;
                  const social = metadata?.social;
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  const isActive = end > new Date();

                  return (
                    <tr
                      key={event.id}
                      className="border-b border-chalk hover:bg-powder/10 transition-colors group"
                    >
                      <td className="py-6 px-6 font-mono text-admin-xs text-slate opacity-50">
                        EVT-{event.id.toString().padStart(3, '0')}
                      </td>
                      <td className="py-6 px-6">
                        <span className="font-bold text-foreground text-admin-base uppercase tracking-tight">
                          {event.name}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        {social ? (
                          <div className="flex items-center gap-2">
                            <Icons.Star className="w-3 h-3 text-amber fill-amber" />
                            <span className="text-admin-sm font-black text-foreground">
                              {social.rating}
                            </span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3 text-[9px] font-black uppercase tracking-widest"
                            onClick={() => syncSocial(event.id)}
                          >
                            Sync
                          </Button>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col text-[11px] font-medium text-gravel uppercase tracking-wider">
                          <span className="text-foreground">
                            {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="opacity-50 text-[9px]">
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground"
                              style={{ width: `${metadata?.currentOccupancy || 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-foreground">
                            {metadata?.currentOccupancy || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-admin-xs text-gravel font-medium uppercase tracking-tight truncate max-w-[150px]">
                        {event.locationName}
                      </td>
                      <td className="py-6 px-6 font-mono text-admin-sm text-foreground font-bold">
                        {metadata?.capacity?.toLocaleString() || '—'}
                      </td>
                      <td className="py-6 px-6">
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 ${isActive ? 'bg-signal-blue text-white' : 'bg-elevated text-gravel opacity-50'}`}
                        >
                          {isActive ? 'Active' : 'Past'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => router.push(`/?eventId=${event.id}`)}
                            className="h-9 px-5 text-[10px] font-medium uppercase tracking-widest text-foreground bg-surface/50 hover:bg-surface border border-border rounded-xl transition-all hover:shadow-massive active:scale-95"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenEdit(event)}
                            className="h-9 px-5 text-[10px] font-medium uppercase tracking-widest text-foreground bg-surface/50 hover:bg-surface border border-border rounded-xl transition-all hover:shadow-massive active:scale-95"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="h-9 w-9 flex items-center justify-center text-gravel hover:text-ember bg-surface/50 hover:bg-ember/5 border border-border rounded-xl transition-all active:scale-95 shrink-0"
                            title="Delete Event"
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
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-surface border border-border/60 shadow-massive p-10 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-ember/10 flex items-center justify-center">
                <Icons.AlertTriangle className="w-8 h-8 text-ember" />
              </div>

              <div className="space-y-2">
                <h3 className="waldenburg-display text-2xl text-foreground">Delete Event</h3>
                <p className="text-admin-base text-gravel font-medium uppercase tracking-tight opacity-60">
                  Are you sure you want to remove this event lifecycle? All associated data and
                  boundaries will be permanently erased.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={() => handleDeleteEvent()}
                  className="w-full h-14 bg-ember text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-ember/90 transition-all shadow-lg active:scale-[0.98]"
                >
                  Confirm Permanent Deletion
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setEventToDeleteId(null);
                  }}
                  className="w-full h-14 text-[11px] font-medium uppercase tracking-widest text-gravel hover:text-foreground transition-colors"
                >
                  Keep Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
