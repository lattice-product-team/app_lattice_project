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
  { value: 'restaurant', label: 'Restaurant/Food', icon: Icons.Utensils },
  { value: 'bar', label: 'Bar/Drinks', icon: Icons.Beer },
  { value: 'coffee', label: 'Coffee/Snacks', icon: Icons.Coffee },
  { value: 'shop', label: 'Official Shop', icon: Icons.Store },
  { value: 'stage', label: 'Stage/Theater', icon: Icons.Theater },
  { value: 'vip', label: 'VIP Zone', icon: Icons.Crown },
  { value: 'parking', label: 'Parking', icon: Icons.MapPin },
  { value: 'wc', label: 'Restrooms', icon: Icons.User },
  { value: 'medical', label: 'Medical/Health', icon: Icons.Hospital },
  { value: 'security', label: 'Security/Shield', icon: Icons.Shield },
  { value: 'information', label: 'Info/Library', icon: Icons.LibraryBig },
  { value: 'gate', label: 'Entrance/Exit', icon: Icons.LogOut },
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
  const [bannerUrl, setBannerUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [address, setAddress] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectionSource, setSelectionSource] = useState<'CLICK' | 'SEARCH' | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poiToDeleteId, setPoiToDeleteId] = useState<number | null>(null);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const { selectedPoi, selectPoi, clearPoi } = useMapInteractions('PICK_COORDINATE');

  // Auto-resolve address when pin is placed
  useEffect(() => {
    if (selectedPoi && selectedPoi.lat && selectedPoi.lng) {
      const resolve = async () => {
        try {
          const res = await fetch(
            `${API_BASE}/resolve-address?lat=${selectedPoi.lat}&lng=${selectedPoi.lng}`
          );
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
      const matchesType = !typeValue || typeValue === 'all' || (poi.category || poi.type) === typeValue;
      const matchesEvent =
        !eventValue || eventValue === 'all' || poi.eventId?.toString() === eventValue;
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
    setBannerUrl('');
    setGalleryUrls([]);
  }, [clearPoi]);

  const handleOpenCreate = () => {
    resetForm();
    setIsInterfaceOpen(true);
  };

  const handleOpenEdit = (poi: any) => {
    setEditingPoiId(poi.id);
    setName(poi.name);
    setDescription(poi.description || '');
    setType(poi.category || poi.type);
    setCapacity(poi.capacity?.toString() || '');
    setIsWheelchairAccessible(poi.isWheelchairAccessible);
    setSelectedEventId(poi.eventId?.toString() || '');
    setAddress(poi.address || '');
    setLocationName(poi.locationName || '');
    setBannerUrl(poi.bannerUrl || '');
    setGalleryUrls(poi.galleryUrls || []);
    setSelectionSource('CLICK');

    const coords = poi.geometry?.coordinates || poi.center?.coordinates;
    if (coords) {
      selectPoi({
        id: poi.id,
        name: poi.name,
        lng: coords[0],
        lat: coords[1],
        category: poi.category || poi.type,
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
        bannerUrl,
        galleryUrls,
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

  const handleDeletePoiInline = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/pois/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsInterfaceOpen(false);
        setIsDeleteConfirming(false);
        setPendingDeleteId(null);
        resetForm();
        refetch();
      }
    } catch (err) {
      console.error('Failed to delete POI inline', err);
    }
  };

  const syncSocial = async (id: number) => {
    if (syncingIds.has(id)) return;

    setSyncingIds((prev) => new Set(prev).add(id));
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
      setSyncingIds((prev) => {
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
      {/* --- LATTICE STUDIO: POI INTERFACE --- */}
      {isInterfaceOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[200] bg-background animate-in fade-in duration-300">
          {/* Map Layer (Full Screen Background) */}
          <div className="absolute inset-0">
            <AdminMap
              mode="PICK_COORDINATE"
              selectedPoi={selectedPoi}
              onPoiSelect={selectPoi}
              activeEventBoundary={activeEventBoundary}
              initialViewState={mapViewState || { longitude: 2.1734, latitude: 41.3851, zoom: 13 }}
              selectedCategory={type}
              selectionSource={selectionSource}
            />
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
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gravel/60 mb-2">
                Lattice Studio
              </p>
              <h2 className="waldenburg-display text-3xl text-foreground">
                {editingPoiId ? 'Edit Asset' : 'New Asset'}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-scroll custom-scrollbar px-12 py-10 space-y-12">
              {/* Section 1: Context */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
                  1. Operational Context
                </p>
                <Select
                  className="w-full"
                  aria-label="Select parent event"
                  selectedKey={selectedEventId}
                  onSelectionChange={(key) => {
                    const newKey =
                      key && typeof key === 'object' && 'anchorKey' in key
                        ? (key as any).anchorKey
                        : (key as string);
                    if (newKey && newKey !== selectedEventId) setSelectedEventId(newKey);
                  }}
                >
                  <Select.Trigger className="bg-elevated/40 border border-border rounded-2xl h-14 px-6 outline-none transition-colors focus:border-foreground flex items-center justify-between">
                    <Select.Value className="text-admin-sm font-medium text-foreground uppercase tracking-tight">
                      {selectedEvent?.name || 'Choose parent event...'}
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Popover className="rounded-2xl border border-border shadow-massive bg-surface">
                    <ListBox items={events} className="outline-none">
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

              {/* Section 2: Definition */}
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
                  2. Asset Definition
                </p>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">
                    Asset Name
                  </label>
                  <input
                    placeholder="e.g. South Gate, Medical tent A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium uppercase tracking-tight rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description of the asset's purpose..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium rounded-3xl resize-none"
                  />
                </div>
              </div>

              {/* Section 3: Media */}
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
                  3. Media Assets
                </p>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">
                    Banner Image URL
                  </label>
                  <input
                    placeholder="https://example.com/banner.jpg"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium rounded-2xl"
                  />
                  {bannerUrl && (
                    <div className="mt-2 h-32 w-full rounded-2xl overflow-hidden border border-border">
                      <img
                        src={
                          bannerUrl.startsWith('PLACEHOLDER_') ||
                          bannerUrl === 'null' ||
                          bannerUrl === ''
                            ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="200" height="200" fill="url(%23g)" rx="16"/><circle cx="100" cy="100" r="40" fill="%231e293b" stroke="%23334155" stroke-width="2"/><path d="M100 75c-13.8 0-25 11.2-25 25 0 18.8 25 40 25 40s25-21.2 25-40c0-13.8-11.2-25-25-25zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="%2364748b"/></svg>`
                            : bannerUrl
                        }
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="200" height="200" fill="url(%23g)" rx="16"/><circle cx="100" cy="100" r="40" fill="%231e293b" stroke="%23334155" stroke-width="2"/><path d="M100 75c-13.8 0-25 11.2-25 25 0 18.8 25 40 25 40s25-21.2 25-40c0-13.8-11.2-25-25-25zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="%2364748b"/></svg>`;
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">
                    Gallery Images
                  </label>
                  <div className="flex gap-2">
                    <input
                      placeholder="https://example.com/image.jpg"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="flex-1 h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium rounded-2xl"
                    />
                    <button
                      onClick={() => {
                        if (newGalleryUrl) {
                          setGalleryUrls([...galleryUrls, newGalleryUrl]);
                          setNewGalleryUrl('');
                        }
                      }}
                      className="h-14 w-14 bg-foreground text-background rounded-2xl flex items-center justify-center hover:opacity-90"
                    >
                      <Icons.Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {galleryUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {galleryUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-ember text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icons.X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Specifications */}
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
                  4. Technical Specifications
                </p>

                <div className="space-y-4">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {POI_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        className={`px-4 py-5 rounded-2xl border transition-colors flex items-center gap-3 active:scale-[0.97]
                        ${type === t.value ? 'bg-foreground border-foreground text-background shadow-massive' : 'bg-elevated/20 border-border text-gravel hover:bg-elevated hover:text-foreground'}`}
                      >
                        <t.icon className="w-5 h-5 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight truncate">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gravel/60 ml-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="Max occupancy"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full h-14 px-6 bg-elevated/40 border border-border text-admin-base text-foreground placeholder:text-gravel/30 outline-none focus:border-foreground transition-colors font-medium uppercase tracking-tight rounded-2xl"
                  />
                </div>
              </div>

              {/* Section 3: Location (Auto) */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
                  3. Location Intelligence
                </p>
                {address ? (
                  <div className="p-6 rounded-[2rem] bg-elevated/40 border border-border/60 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gravel/60 mb-2">
                      Resolved Address
                    </p>
                    <p className="text-[12px] text-foreground font-medium leading-relaxed">
                      {address}
                    </p>
                    <p className="text-[9px] font-medium text-gravel/40 mt-3 uppercase tracking-tighter italic">
                      Drag the pin on the map to refine position
                    </p>
                  </div>
                ) : (
                  <div className="p-8 rounded-[2rem] border border-dashed border-border flex flex-col items-center justify-center text-center">
                    <Icons.MapPin className="w-6 h-6 text-gravel/20 mb-3" />
                    <p className="text-[10px] text-gravel/40 uppercase font-bold tracking-widest">
                      Select position on map
                    </p>
                  </div>
                )}
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
                  onClick={handleRegisterAsset}
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-full bg-foreground text-background text-[12px] font-black uppercase tracking-[0.25em] hover:opacity-90 active:scale-[0.98] transition-all shadow-massive disabled:opacity-50"
                >
                  {isSubmitting ? 'Syncing...' : editingPoiId ? 'Update Asset' : 'Confirm Asset'}
                </button>

                <div className="flex gap-3">
                  <button
                    className="flex-1 h-14 rounded-full text-[10px] font-bold uppercase tracking-widest text-gravel hover:text-foreground transition-colors bg-elevated/40 border border-border"
                    onClick={() => setIsInterfaceOpen(false)}
                  >
                    Cancel
                  </button>

                  {editingPoiId && (
                    isDeleteConfirming ? (
                      <button
                        onClick={() => handleDeletePoiInline(editingPoiId)}
                        className="flex-1 h-14 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-ember hover:bg-ember/90 transition-all border border-transparent flex items-center justify-center gap-2 shadow-lg active:scale-95 animate-pulse"
                      >
                        <Icons.AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                        Are you sure?
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsDeleteConfirming(true);
                          setTimeout(() => setIsDeleteConfirming(false), 4000);
                        }}
                        className="flex-1 h-14 rounded-full text-[10px] font-bold uppercase tracking-widest text-ember bg-ember/5 hover:bg-ember/10 transition-colors border border-ember/20 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Icons.Trash className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {/* Toolbar - integrated with canvas */}
        <div className="w-full bg-surface border border-border/60 border-b-0 shadow-subtle transition-colors">
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
                    <ListBox.Item
                      id="all"
                      textValue="All Types"
                      className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      All Types
                    </ListBox.Item>
                    {POI_TYPES.map((t) => (
                      <ListBox.Item
                        key={t.value}
                        id={t.value}
                        textValue={t.label}
                        className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                      >
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
                    <ListBox.Item
                      id="all"
                      textValue="Global Assets"
                      className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                    >
                      Global Assets
                    </ListBox.Item>
                    {events.map((e: any) => (
                      <ListBox.Item
                        key={e.id.toString()}
                        id={e.id.toString()}
                        textValue={e.name}
                        className="flex items-center px-4 py-3 rounded-xl text-[10px] font-medium uppercase tracking-wider text-gravel hover:bg-elevated hover:text-foreground cursor-pointer outline-none data-[selected=true]:bg-foreground data-[selected=true]:text-background text-center"
                      >
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
              <div className="px-4 py-4 shrink-0 border-l border-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter(new Set([]));
                    setEventFilter(new Set([]));
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
                  Asset Details
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Rating
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">
                  Location / Address
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-center">
                  Occupancy (Live)
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-center">
                  Accessibility
                </th>
                <th className="py-5 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-center">
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
                  <td colSpan={8} className="py-24">
                    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center">
                        <Icons.RefreshCw className="w-4 h-4 text-gravel animate-spin" />
                      </div>
                      <span className="text-gravel uppercase text-[10px] font-medium tracking-[0.2em]">
                        Retrieving Asset Registry...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredPois.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-24 text-center text-gravel font-medium uppercase text-[10px] tracking-[0.25em] opacity-40"
                  >
                    No asset matches found.
                  </td>
                </tr>
              ) : (
                filteredPois.map((poi: any) => {
                  const occupancy = poi.capacity
                    ? Math.round((poi.currentOccupancy / poi.capacity) * 100)
                    : 0;
                  const status = poi.status || 'open';
                  const social = poi.metadata?.social;

                  return (
                    <tr
                      key={poi.id}
                      className="border-b border-border hover:bg-elevated/10 transition-all group"
                    >
                      <td className="py-4 px-6 font-mono text-admin-xs text-slate opacity-40">
                        POI-{poi.id.toString().padStart(3, '0')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-elevated border border-border overflow-hidden shrink-0 shadow-sm">
                            <img
                              src={
                                !poi.bannerUrl ||
                                poi.bannerUrl === 'null' ||
                                (typeof poi.bannerUrl === 'string' &&
                                  (poi.bannerUrl.startsWith('PLACEHOLDER_') ||
                                    poi.bannerUrl === ''))
                                  ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="200" height="200" fill="url(%23g)" rx="16"/><circle cx="100" cy="100" r="40" fill="%231e293b" stroke="%23334155" stroke-width="2"/><path d="M100 75c-13.8 0-25 11.2-25 25 0 18.8 25 40 25 40s25-21.2 25-40c0-13.8-11.2-25-25-25zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="%2364748b"/></svg>`
                                  : poi.bannerUrl
                              }
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="200" height="200" fill="url(%23g)" rx="16"/><circle cx="100" cy="100" r="40" fill="%231e293b" stroke="%23334155" stroke-width="2"/><path d="M100 75c-13.8 0-25 11.2-25 25 0 18.8 25 40 25 40s25-21.2 25-40c0-13.8-11.2-25-25-25zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="%2364748b"/></svg>`;
                              }}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-foreground text-admin-base uppercase tracking-tight truncate">
                              {poi.name}
                            </span>
                            <span className="text-[10px] text-gravel uppercase tracking-wider font-medium opacity-40 truncate">
                              {poi.eventName || 'Global Asset'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
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
                            onClick={() => syncSocial(poi.id)}
                            isLoading={syncingIds.has(poi.id)}
                          >
                            Sync
                          </Button>
                        )}
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
                            <div
                              className={`h-full ${occupancy > 80 ? 'bg-ember' : 'bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.2)]'}`}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-foreground w-8">
                            {occupancy}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3 text-gravel opacity-40">
                          {poi.isWheelchairAccessible && (
                            <Icons.Accessibility className="w-5 h-5" />
                          )}
                          {poi.hasPriorityLane && (
                            <Icons.UserCheck className="w-5 h-5 text-signal-blue" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          <button
                            className={`min-w-[110px] h-9 px-4 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] border transition-all shadow-subtle flex items-center justify-center gap-2.5
                              ${
                                status === 'open'
                                  ? 'bg-surface border-border text-foreground hover:shadow-massive hover:border-foreground/20'
                                  : status === 'maintenance'
                                    ? 'bg-surface border-ember/20 text-ember hover:shadow-massive hover:border-ember/40'
                                    : 'bg-elevated/40 border-border/40 text-gravel opacity-60'
                              } transition-colors`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'open' ? 'bg-success' : status === 'maintenance' ? 'bg-ember' : 'bg-gravel'}`}
                            />
                            {status}
                          </button>
                        </div>
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
                          {pendingDeleteId === poi.id ? (
                            <button
                              onClick={() => handleDeletePoiInline(poi.id)}
                              className="h-9 px-3 flex items-center justify-center text-white bg-ember hover:bg-ember/90 border border-transparent rounded-xl transition-all active:scale-95 shrink-0 text-[9px] font-bold uppercase tracking-widest gap-1 animate-pulse"
                              title="Confirm Delete"
                            >
                              <Icons.AlertTriangle className="w-3 h-3" />
                              Sure?
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setPendingDeleteId(poi.id);
                                setTimeout(() => setPendingDeleteId(null), 4000);
                              }}
                              className="h-9 w-9 flex items-center justify-center text-gravel hover:text-ember bg-surface/50 hover:bg-ember/5 border border-border rounded-xl transition-all active:scale-95 shrink-0"
                              title="Delete Asset"
                            >
                              <Icons.Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
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
                <h3 className="waldenburg-display text-2xl text-foreground">Confirm Deletion</h3>
                <p className="text-admin-base text-gravel font-medium uppercase tracking-tight opacity-60">
                  Are you sure you want to remove this asset? This action is permanent and cannot be
                  undone.
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
