"use client";

import React, { useState, useMemo } from "react";
import { Chip, Spinner, Tooltip, Modal, ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalBody, ModalFooter, Select, ListBox } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePOIs, useEvents } from "@/hooks/use-admin-data";
import dynamic from "next/dynamic";
import { useMapInteractions } from "@/components/map/use-map-interactions";

const AdminMap = dynamic(() => import("@/components/map/admin-map").then(mod => mod.AdminMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-powder/20 animate-pulse flex items-center justify-center text-gravel uppercase text-[10px] font-black tracking-widest">Initializing Map...</div>
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
  const { pois, loading, refetch } = usePOIs();
  const { events } = useEvents();
  
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("wc");
  const [capacity, setCapacity] = useState("");
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState(true);

  const { selectedPoi, selectPoi, clearPoi } = useMapInteractions('PICK_COORDINATE');

  const selectedEvent = useMemo(() => 
    events.find(e => e.id.toString() === selectedEventId),
    [events, selectedEventId]
  );

  const handleRegisterAsset = async () => {
    if (!name || !type || !selectedPoi || !selectedEventId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/pois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          name,
          description,
          type,
          geometry: { type: 'Point', coordinates: [selectedPoi.lng, selectedPoi.lat] },
          capacity,
          isWheelchairAccessible
        })
      });

      if (res.ok) {
        setIsRegisterModalOpen(false);
        refetch();
        // Reset
        setName("");
        setDescription("");
        setCapacity("");
        clearPoi();
      }
    } catch (err) {
      console.error("Failed to register asset", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncSocial = async (id: number) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/social/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "poi", id })
      });
      if (res.ok) refetch();
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  return (
    <div className="space-y-12 px-8 py-12 pb-24">

      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Global Asset Registry</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Monitoring infrastructure and amenities.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Centralized management of stages, services, and amenities. Integrated DataForSEO telemetry for real-world social proof.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Export Assets</Button>
          <Button variant="primary" onClick={() => setIsRegisterModalOpen(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Register New Asset
          </Button>
        </div>
      </header>

      <Modal isOpen={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <ModalBackdrop>
          <ModalContainer className="bg-white border border-chalk rounded-2xl p-0 shadow-subtle max-w-4xl overflow-hidden">
            <ModalDialog className="outline-none h-full">
              <div className="flex h-[600px]">
              {/* Form Side */}
              <div className="w-1/2 p-8 overflow-y-auto space-y-6">
                <ModalHeader className="waldenburg-display text-admin-xl text-obsidian p-0">Register Infrastructure</ModalHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gravel">1. Operational Context</p>
                    <Select 
                      className="w-full"
                      aria-label="Select parent event"
                      selectedKey={selectedEventId}
                      onSelectionChange={(key) => {
                        // Extract key from Selection object if necessary
                        const newKey = (key && typeof key === 'object' && 'anchorKey' in key) 
                          ? (key as any).anchorKey 
                          : key as string;
                          
                        if (newKey && newKey !== selectedEventId) {
                          setSelectedEventId(newKey);
                        }
                      }}
                    >
                      <Select.Trigger className="bg-white border border-chalk rounded-xl h-10 px-4 outline-none shadow-hairline flex items-center justify-between">
                        <Select.Value className="text-admin-xs font-medium text-obsidian">
                          {selectedEvent?.name || "Choose event..."}
                        </Select.Value>
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox items={events} className="bg-white border border-chalk rounded-xl p-1 min-w-[300px] shadow-subtle max-h-60 overflow-y-auto">
                          {(e: any) => (
                            <ListBox.Item id={e.id.toString()} textValue={e.name} className="flex items-center px-3 py-2 rounded-lg text-admin-xs font-medium text-gravel hover:bg-powder cursor-pointer outline-none focus:bg-powder">
                              {e.name}
                            </ListBox.Item>
                          )}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gravel">2. Asset Details</p>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Asset Name</p>
                      <Input placeholder="e.g. South Gate, Medical tent A" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {POI_TYPES.map((t) => (
                        <button 
                          key={t.value}
                          onClick={() => setType(t.value)}
                          className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-3
                            ${type === t.value ? 'bg-obsidian border-obsidian text-eggshell' : 'bg-powder/30 border-chalk text-gravel hover:bg-powder'}`}
                        >
                          <span className="text-lg">{t.emoji}</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter truncate">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={() => setIsRegisterModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" className="flex-1" onClick={handleRegisterAsset}>
                    {isSubmitting ? <Spinner size="sm" color="current" /> : "Confirm Asset"}
                  </Button>
                </div>
              </div>

              {/* Map Side */}
              <div className="w-1/2 bg-powder/30 relative">
                <div className="absolute inset-0">
                  <AdminMap 
                    mode="PICK_COORDINATE" 
                    selectedPoi={selectedPoi} 
                    onPoiSelect={selectPoi}
                    activeEventBoundary={selectedEvent?.boundary ? { type: 'Feature', geometry: selectedEvent.boundary, properties: {} } : null}
                    initialViewState={selectedEvent?.center ? { 
                      longitude: selectedEvent.center.coordinates[0], 
                      latitude: selectedEvent.center.coordinates[1], 
                      zoom: 16 
                    } : undefined}
                  />
                </div>
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-chalk shadow-sm max-w-[200px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-obsidian mb-1">Location Picker</p>
                    <p className="text-[9px] text-gravel leading-tight">
                      {selectedEventId ? `Place the pin within the boundary of ${selectedEvent?.name}.` : "Select an event first to see its boundary."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-chalk pb-4">
          <div className="flex items-center gap-3">
            <h2 className="waldenburg-display text-[24px] text-obsidian">Active Assets</h2>
            {!loading && (
              <span className="bg-powder px-2 py-0.5 rounded text-[10px] font-black border border-chalk text-obsidian uppercase tracking-widest">
                {pois.length} Registered
              </span>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide border border-chalk rounded-2xl bg-white/50 backdrop-blur-sm">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-chalk bg-powder/50">
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">ID</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Asset Details</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Social Proof</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Location / Address</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Occupancy (Live)</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-center">Accessibility</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Status</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Spinner color="current" size="sm" />
                  </td>
                </tr>
              ) : (
                pois.map((poi: any) => {
                  const occupancy = poi.capacity ? Math.round((poi.currentOccupancy / poi.capacity) * 100) : 0;
                  const status = poi.status || 'open';
                  const social = poi.metadata?.social;

                  return (
                    <tr key={poi.id} className="border-b border-chalk hover:bg-powder/30 transition-colors group">
                      <td className="py-6 px-6">
                        <span className="font-mono text-admin-xs text-slate">POI-{poi.id.toString().padStart(3, '0')}</span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-obsidian text-admin-base">{poi.name}</span>
                          <span className="text-[11px] text-gravel uppercase tracking-wider font-medium">{poi.eventName || "Global Asset"}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        {social ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <Icons.Star className="w-3 h-3 text-amber fill-amber" />
                              <span className="text-admin-sm font-black text-obsidian">{social.rating}</span>
                              <span className="text-[10px] text-gravel font-medium">({social.reviews_count})</span>
                            </div>
                            <span className="text-[9px] text-signal-blue font-bold uppercase tracking-tighter flex items-center gap-1 cursor-help">
                              <Icons.CheckCircle className="w-2.5 h-2.5" /> Verified Social
                            </span>
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border-chalk hover:bg-powder"
                            onClick={() => syncSocial(poi.id)}
                          >
                            <Icons.RefreshCw className="w-3 h-3 mr-1.5" /> Sync Social
                          </Button>
                        )}
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col max-w-[250px]">
                          <span className="text-admin-base font-bold text-obsidian truncate">{poi.locationName || "Location Pending"}</span>
                          <span className="text-[11px] text-gravel leading-tight truncate" title={poi.address}>{poi.address || "Coordinates resolved"}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col gap-2 w-32">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-obsidian">
                            <span>{occupancy}% Full</span>
                            <span>{poi.currentOccupancy || 0} / {poi.capacity || 0}</span>
                          </div>
                          <div className="w-full h-1.5 bg-chalk rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${occupancy > 80 ? 'bg-ember' : 'bg-obsidian'}`} 
                              style={{ width: `${occupancy}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-gravel">
                          {poi.isWheelchairAccessible && (
                            <Icons.Accessibility className="w-4 h-4" />
                          )}
                          {poi.hasPriorityLane && (
                            <Icons.UserCheck className="w-4 h-4 text-signal-blue" />
                          )}
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <Chip 
                          size="sm" 
                          variant="soft"
                          className={`font-black text-[10px] uppercase tracking-widest rounded-full ${
                            status === 'open' ? 'bg-obsidian text-eggshell' : 
                            status === 'maintenance' ? 'bg-ember text-eggshell' : 
                            'bg-powder text-gravel opacity-50'
                          }`}
                        >
                          {status}
                        </Chip>
                      </td>
                      <td className="py-6 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="compact">View</Button>
                          <Button variant="compact">Edit</Button>
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
