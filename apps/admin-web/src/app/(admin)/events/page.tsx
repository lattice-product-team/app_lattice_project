'use client';

import { useState, useMemo, useEffect } from 'react';
import { Spinner, Select, ListBox, Selection } from '@heroui/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEvents, API_BASE } from '@/hooks/use-admin-data';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

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
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const { events, loading, refetch } = useEvents();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set([]));
  const [capacityFilter, setCapacityFilter] = useState<Selection>(new Set([]));

  // Interface State
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [activeEventBoundaryGeoJSON, setActiveEventBoundaryGeoJSON] = useState<any>(null);
  const [mapInitialView, setMapInitialView] = useState({
    longitude: 2.2575,
    latitude: 41.5641,
    zoom: 15,
  });

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Selection>(new Set([]));
  const [capacityFilter, setCapacityFilter] = useState<Selection>(new Set([]));

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

      const capacityVal = selectionValue(capacityFilter);
      const metadata = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
      const capacity = metadata?.capacity || 0;
      const matchesCapacity =
        !capacityValue ||
        capacityValue === 'all' ||
        (capacityValue === 'massive' && capacity >= 10000) ||
        (capacityValue === 'medium' && capacity >= 1000 && capacity < 10000) ||
        (capacityValue === 'boutique' && capacity < 1000);

      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [events, searchTerm, statusFilter, capacityFilter]);

  const resetForm = React.useCallback(() => {
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
      {isInterfaceOpen && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-300 w-screen h-screen transition-colors">
          <div className="h-20 border-b border-border flex items-center justify-between px-12 shrink-0 bg-surface">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gravel">
                Lattice Studio
              </span>
              <div className="w-1 h-1 rounded-full bg-chalk" />
              <h2 className="waldenburg-display text-admin-xl text-obsidian">
                {editingEventId ? 'Configure Lifecycle' : 'Initialize Event'}
              </h2>
            </div>
            <Button
              variant="ghost"
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-chalk hover:border-obsidian"
              onClick={() => setIsInterfaceOpen(false)}
            >
              <Icons.X className="w-5 h-5 text-gravel group-hover/close:text-foreground transition-colors" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Map */}
            <div className="flex-1 bg-elevated/20 relative border-r border-border transition-colors">
              <AdminMap
                mode="DRAW_BOUNDARY"
                boundaryPoints={boundaryPoints}
                onBoundaryChange={setBoundaryPoints}
                initialViewState={mapInitialView}
                activeEventBoundary={activeEventBoundaryGeoJSON}
              />
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                <div className="bg-surface border-border shadow-massive max-w-[260px]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground mb-1.5">
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
                      className="bg-surface border border-border/60 px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-foreground hover:bg-elevated transition-all"
                    >
                      Undo
                    </button>
                    <button
                      onClick={clearBoundary}
                      className="bg-surface border border-ember/30 px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-ember hover:bg-ember/5 transition-all"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-[480px] bg-surface flex flex-col overflow-hidden transition-colors">
              <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-gravel/50 mb-8">
                  {editingEventId ? 'Edit Event' : 'New Event'}
                </p>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gravel mb-2">
                      Event Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Primavera Sound 2026"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-all font-medium uppercase tracking-tight"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gravel mb-2">
                        Start
                      </label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-xs text-foreground outline-none focus:border-foreground transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gravel mb-2">
                        End
                      </label>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-xs text-foreground outline-none focus:border-foreground transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gravel mb-2">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Parc del Fòrum"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-all font-medium uppercase tracking-tight"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gravel mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-all font-medium uppercase tracking-tight"
                    />
                  </div>

                  {/* Boundary status */}
                  <div className="flex items-center gap-2 py-3 border-t border-chalk/50">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${boundaryPoints.length > 2 ? 'bg-success' : 'bg-chalk'}`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gravel/60">
                      {boundaryPoints.length > 2
                        ? `Boundary set · ${boundaryPoints.length} points`
                        : 'No boundary defined'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-10 py-8 border-t border-border bg-surface flex flex-col gap-4">
                {formError && (
                  <p className="text-[10px] font-medium text-ember uppercase tracking-widest mb-2">
                    {formError}
                  </p>
                )}
                <button
                  onClick={handleCreateEvent}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-obsidian text-eggshell text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingEventId ? 'Save Changes' : 'Create Event'}
                </button>
                <button
                  onClick={() => setIsInterfaceOpen(false)}
                  className="w-full h-10 text-[10px] font-black uppercase tracking-widest text-gravel hover:text-ember transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {/* Toolbar - integrated with canvas */}
        <div className="w-full bg-surface/90 border border-border/60 border-b-0 shadow-subtle transition-colors">
          {/* Top row: title + matched count + create button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-border/60 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="waldenburg-display text-[28px] text-obsidian leading-none">
                Active Schedule
              </h2>
              {!loading && (
                <span
                  className={`px-2.5 py-1 text-[9px] font-black border uppercase tracking-widest ${
                    filteredEvents.length === 0
                      ? 'bg-ember/10 text-ember border-ember/20'
                      : 'bg-powder text-obsidian border-chalk'
                  }`}
                >
                  {filteredEvents.length} matched
                </span>
              )}
            </div>
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="h-9 px-5 text-[11px] font-black uppercase tracking-widest"
            >
              <Icons.Plus className="w-3.5 h-3.5 mr-1.5" />
              New Event
            </Button>
          </div>

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
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
                    >
                      All Schedules
                    </ListBox.Item>
                    <ListBox.Item
                      id="active"
                      textValue="Live & Upcoming"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
                    >
                      Live & Upcoming
                    </ListBox.Item>
                    <ListBox.Item
                      id="past"
                      textValue="Past Events"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
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
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
                    >
                      All Scales
                    </ListBox.Item>
                    <ListBox.Item
                      id="massive"
                      textValue="Massive (>10k)"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
                    >
                      Massive (&gt;10k)
                    </ListBox.Item>
                    <ListBox.Item
                      id="medium"
                      textValue="Medium (1k-10k)"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
                    >
                      Medium (1k-10k)
                    </ListBox.Item>
                    <ListBox.Item
                      id="boutique"
                      textValue="Boutique (<1k)"
                      className="flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gravel hover:bg-powder hover:text-obsidian cursor-pointer outline-none data-[selected=true]:bg-obsidian data-[selected=true]:text-white text-center"
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
              <div className="px-5 py-4 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter(new Set([]));
                    setCapacityFilter(new Set([]));
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
              <tr className="border-b border-chalk bg-powder/20">
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
                        <span className="font-bold text-obsidian text-admin-base uppercase tracking-tight">
                          {event.name}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        {social ? (
                          <div className="flex items-center gap-2">
                            <Icons.Star className="w-3 h-3 text-amber fill-amber" />
                            <span className="text-admin-sm font-black text-obsidian">
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
                          <span className="text-obsidian">
                            {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="opacity-50 text-[9px]">
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1 bg-chalk rounded-full overflow-hidden">
                            <div
                              className="h-full bg-obsidian"
                              style={{ width: `${metadata?.currentOccupancy || 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-obsidian">
                            {metadata?.currentOccupancy || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-admin-xs text-gravel font-medium uppercase tracking-tight truncate max-w-[150px]">
                        {event.locationName}
                      </td>
                      <td className="py-6 px-6 font-mono text-admin-sm text-obsidian font-bold">
                        {metadata?.capacity?.toLocaleString() || '—'}
                      </td>
                      <td className="py-6 px-6">
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 ${isActive ? 'bg-signal-blue text-white' : 'bg-chalk text-gravel opacity-50'}`}
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
