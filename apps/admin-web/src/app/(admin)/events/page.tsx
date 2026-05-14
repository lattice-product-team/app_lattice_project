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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null);
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());

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
    return events.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            e.locationName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const status = selectionValue(statusFilter);
      const now = new Date();
      const end = new Date(e.endDate);
      const isLive = end > now;
      const matchesStatus = !status || status === 'all' || (status === 'active' && isLive) || (status === 'past' && !isLive);

      const capacityVal = selectionValue(capacityFilter);
      const metadata = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
      const capacity = metadata?.capacity || 0;
      const matchesCapacity = !capacityVal || capacityVal === 'all' || 
                              (capacityVal === 'massive' && capacity >= 10000) ||
                              (capacityVal === 'medium' && capacity < 10000 && capacity >= 1000) ||
                              (capacityVal === 'boutique' && capacity < 1000);

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
    setLocationName(event.locationName);
    setAddress(event.address);
    setBoundaryPoints(event.boundary?.coordinates?.[0] || []);
    setIsInterfaceOpen(true);
  };

  const undoLastPoint = () => setBoundaryPoints((prev) => prev.slice(0, -1));
  const clearBoundary = () => setBoundaryPoints([]);

  const activeEventBoundaryGeoJSON = useMemo(() => {
    if (boundaryPoints.length < 3) return null;
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...boundaryPoints, boundaryPoints[0]]],
      },
      properties: {},
    };
  }, [boundaryPoints]);

  const mapInitialView = useMemo(() => {
    if (boundaryPoints.length > 0) {
      return {
        longitude: boundaryPoints[0][0],
        latitude: boundaryPoints[0][1],
        zoom: 15,
      };
    }
    return undefined;
  }, [boundaryPoints]);

  const handleDeleteEvent = async (id?: number) => {
    const targetId = id || editingEventId || eventToDeleteId;
    if (!targetId) return;
    
    if (!isDeleteModalOpen) {
      setEventToDeleteId(targetId);
      setIsDeleteModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/events/${targetId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsInterfaceOpen(false);
        setIsDeleteModalOpen(false);
        setEventToDeleteId(null);
        resetForm();
        refetch();
      }
    } catch (err) {
      console.error('Failed to delete event', err);
    }
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
    setSyncingIds(prev => new Set(prev).add(id));
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
      setSyncingIds(prev => {
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
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gravel">Lattice Studio</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <h2 className="waldenburg-display text-admin-xl text-foreground">
                {editingEventId ? 'Configure Lifecycle' : 'Initialize Event'}
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
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-gravel mb-2">Event Name</label>
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
                      <label className="block text-[10px] font-medium uppercase tracking-widest text-gravel mb-2">Start</label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-xs text-foreground outline-none focus:border-foreground transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-widest text-gravel mb-2">End</label>
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
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-gravel mb-2">Venue Name</label>
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
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-gravel mb-2">Address</label>
                    <input
                      type="text"
                      placeholder="Street address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-12 px-4 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-all font-medium uppercase tracking-tight"
                    />
                  </div>

                  {/* Boundary status */}
                  <div className="flex items-center gap-2 py-4 border-t border-border/50">
                    <div className={`w-2 h-2 rounded-full ${boundaryPoints.length > 2 ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-border'}`} />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-gravel/80">
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
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsInterfaceOpen(false);
                      resetForm();
                    }}
                    className="flex-1 h-14 text-[11px] font-medium uppercase tracking-widest text-gravel hover:text-foreground transition-colors"
                  >
                    Abort
                  </button>
                  
                  {editingEventId && (
                    <button
                      onClick={() => handleDeleteEvent()}
                      className="flex-1 h-14 text-[11px] font-medium uppercase tracking-widest text-ember bg-ember/5 hover:bg-ember/10 transition-colors border border-ember/20 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}

                  <button
                    onClick={handleCreateEvent}
                    disabled={isSubmitting}
                    className="flex-[2] h-14 bg-foreground text-background text-[11px] font-medium uppercase tracking-[0.25em] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-massive"
                  >
                    {isSubmitting ? 'Processing Signal...' : (editingEventId ? 'Commit Changes' : 'Initialize Event')}
                  </button>
                </div>
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
              <h2 className="waldenburg-display text-[28px] text-foreground leading-none">Active Schedule</h2>
              {!loading && (
                <span className={`px-2.5 py-1 text-[9px] font-medium border uppercase tracking-widest ${
                  filteredEvents.length === 0
                    ? 'bg-ember/10 text-ember border-ember/20'
                    : 'bg-elevated text-foreground border-border'
                }`}>
                  {filteredEvents.length} matched
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="primary" 
                onClick={handleOpenCreate} 
                className="h-10 px-6 text-[11px] font-medium uppercase tracking-widest shadow-massive"
              >
                <Icons.Plus className="w-3.5 h-3.5 mr-2" />
                New Event
              </Button>
            </div>
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
                    <ListBox.Item id="all" textValue="All Lifecycles" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      All Lifecycles
                    </ListBox.Item>
                    <ListBox.Item id="active" textValue="Active Now" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      Active Now
                    </ListBox.Item>
                    <ListBox.Item id="past" textValue="Archived" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      Archived
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
                    <ListBox.Item id="all" textValue="All Scales" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      All Scales
                    </ListBox.Item>
                    <ListBox.Item id="massive" textValue="Massive (>10k)" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      Massive (&gt;10k)
                    </ListBox.Item>
                    <ListBox.Item id="medium" textValue="Medium (1k-10k)" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
                      Medium (1k-10k)
                    </ListBox.Item>
                    <ListBox.Item id="boutique" textValue="Boutique (<1k)" className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center">
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
              <tr className="border-b border-border bg-elevated/20">
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium">ID</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium">Event Details</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Rating</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Schedule</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Occupancy</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium">Location</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Capacity</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Status</th>
                <th className="py-3 px-6 text-gravel uppercase text-[10px] tracking-widest font-medium text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="transition-colors divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan={9} className="py-24 text-center"><Spinner color="current" size="sm" /></td></tr>
              ) : filteredEvents.length === 0 ? (
                <tr><td colSpan={9} className="py-24 text-center text-gravel font-medium uppercase text-[10px] tracking-[0.25em] opacity-40">No operational matches found.</td></tr>
              ) : (
                filteredEvents.map((event: any) => {
                  const metadata = typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata;
                  const social = metadata?.social;
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  const isActive = end > new Date();

                  return (
                    <tr key={event.id} className="border-b border-border hover:bg-elevated/10 transition-all group">
                      <td className="py-4 px-6 font-mono text-admin-xs text-slate opacity-40">EVT-{event.id.toString().padStart(3, '0')}</td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-foreground text-admin-base uppercase tracking-tight transition-colors">
                          {event.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => !social && !syncingIds.has(event.id) && syncSocial(event.id)}
                            disabled={syncingIds.has(event.id)}
                            className={`flex flex-col items-center gap-1.5 transition-all ${!social && !syncingIds.has(event.id) ? 'hover:scale-110 cursor-pointer group/stars' : ''} ${syncingIds.has(event.id) ? 'opacity-50 cursor-wait' : ''}`}
                            title={social ? `${social.rating} / 5 (${social.reviews_count} reviews)` : syncingIds.has(event.id) ? 'Syncing...' : 'Click to sync social proof'}
                          >
                            <div className="flex items-center gap-0.5">
                              {syncingIds.has(event.id) ? (
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
                            {social && !syncingIds.has(event.id) && (
                              <span className="text-[9px] font-bold text-gravel opacity-40 uppercase tracking-widest">
                                {social.rating} ({social.reviews_count})
                              </span>
                            )}
                            {!social && (
                              <span className="text-[8px] font-bold text-gravel opacity-20 uppercase tracking-widest group-hover/stars:opacity-50">
                                {syncingIds.has(event.id) ? 'Syncing...' : 'No Data · Sync'}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col text-[11px] font-medium text-gravel uppercase tracking-wider">
                          <span className="text-foreground">{start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="opacity-40 text-[9px]">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-20 h-1.5 bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ width: `${metadata?.currentOccupancy || 0}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-foreground w-8">{metadata?.currentOccupancy || 0}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-admin-xs text-gravel font-medium uppercase tracking-tight max-w-[200px]">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-foreground font-bold">{event.locationName}</span>
                          <span className="opacity-40 leading-tight line-clamp-2">{event.address}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-admin-sm text-foreground font-medium tabular-nums">{metadata?.capacity?.toLocaleString() || '—'}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm inline-block ${isActive ? 'bg-signal-blue text-white shadow-lg' : 'bg-border text-gravel opacity-40'}`}>
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface border border-border/60 shadow-massive p-10 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-ember/10 flex items-center justify-center">
                <Icons.AlertTriangle className="w-8 h-8 text-ember" />
              </div>
              
              <div className="space-y-2">
                <h3 className="waldenburg-display text-2xl text-foreground">Delete Event</h3>
                <p className="text-admin-base text-gravel font-medium uppercase tracking-tight opacity-60">
                  Are you sure you want to remove this event lifecycle? All associated data and boundaries will be permanently erased.
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
