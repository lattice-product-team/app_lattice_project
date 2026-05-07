"use client";

import { useState } from "react";
import { Chip, Spinner, Tooltip, Modal, ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/hooks/use-admin-data";
import dynamic from "next/dynamic";
import { useMapInteractions } from "@/components/map/use-map-interactions";

const AdminMap = dynamic(() => import("@/components/map/admin-map").then(mod => mod.AdminMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-powder/20 animate-pulse flex items-center justify-center text-gravel uppercase text-[10px] font-black tracking-widest">Initializing Map...</div>
});

export default function EventsPage() {
  const { events, loading, error, refetch } = useEvents();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");

  const { boundaryPoints, setBoundaryPoints, undoLastPoint, clearBoundary } = useMapInteractions('DRAW_BOUNDARY');

  const handleCreateEvent = async () => {
    setFormError("");
    if (!name || !startDate || !endDate) {
      setFormError("Please fill in all required fields (Name, Start Date, End Date).");
      return;
    }
    setIsSubmitting(true);
    try {
      const boundary = boundaryPoints.length > 2 
        ? { type: 'Polygon', coordinates: [[...boundaryPoints, boundaryPoints[0]]] }
        : null;

      const res = await fetch("http://localhost:3000/api/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          locationName,
          address,
          boundary
        })
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        refetch();
        // Reset form
        setName("");
        setStartDate("");
        setEndDate("");
        setLocationName("");
        setAddress("");
        clearBoundary();
      }
    } catch (err) {
      console.error("Failed to create event", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncSocial = async (id: number) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/social/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", id })
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
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Event Operations</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Monitoring global event lifecycles.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Oversee planning, execution, and post-event analysis. High-fidelity telemetry and DataForSEO social proof integration.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Archive All</Button>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </div>
      </header>

      <Modal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <ModalBackdrop>
          <ModalContainer size="lg" className="bg-white border border-chalk rounded-2xl p-0 shadow-subtle overflow-hidden">
            <ModalDialog className="outline-none">
              <div className="flex flex-col h-[700px] max-h-[90vh]">
              
              {/* Map Side (Top) */}
              <div className="w-full h-[250px] bg-powder/30 relative shrink-0 border-b border-chalk">
                <div className="absolute inset-0">
                  <AdminMap 
                    mode="DRAW_BOUNDARY" 
                    boundaryPoints={boundaryPoints} 
                    onBoundaryChange={setBoundaryPoints}
                  />
                </div>
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-chalk shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-obsidian mb-0.5">Boundary Editor</p>
                    <p className="text-[9px] text-gravel leading-tight">Click map to define perimeter.</p>
                  </div>
                  {boundaryPoints.length > 0 && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="compact" className="bg-white/90 shadow-sm" onClick={undoLastPoint}>Undo</Button>
                      <Button size="sm" variant="compact" className="bg-white/90 text-ember shadow-sm" onClick={clearBoundary}>Clear</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Side (Bottom) */}
              <div className="w-full flex-1 p-6 overflow-y-auto space-y-6 bg-white">
                <ModalHeader className="waldenburg-display text-admin-xl text-obsidian p-0">Initialize Event</ModalHeader>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Event Name</p>
                    <Input placeholder="e.g. Primavera Sound 2026" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Start Date</p>
                      <Input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gravel">End Date</p>
                      <Input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Location Name</p>
                    <Input placeholder="e.g. Parc del Fòrum" value={locationName} onChange={e => setLocationName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Address</p>
                    <Input placeholder="Street address..." value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                </div>
                <div className="pt-4 flex flex-col gap-3 mt-auto">
                  {formError && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{formError}</p>}
                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={() => { setIsCreateModalOpen(false); setFormError(""); }}>Cancel</Button>
                    <Button variant="primary" className="flex-1" onClick={handleCreateEvent}>
                      {isSubmitting ? <Spinner size="sm" color="current" /> : "Register Event"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-admin-base font-medium">
          Failed to load events: {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-chalk pb-4">
          <div className="flex items-center gap-3">
            <h2 className="waldenburg-display text-[24px] text-obsidian">Active Schedule</h2>
            {!loading && (
              <span className="bg-powder px-2 py-0.5 rounded text-[10px] font-black border border-chalk text-obsidian uppercase tracking-widest">
                {events.length} Events
              </span>
            )}
          </div>
          <div className="w-64">
             <Input placeholder="Search schedule..." variant="transparent" aria-label="Search schedule" />
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide border border-chalk rounded-2xl bg-white/50 backdrop-blur-sm">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-chalk bg-powder/50">
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">ID</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Event Details</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Rating</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black whitespace-nowrap">Schedule</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Occupancy (Live)</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Location / Address</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Capacity</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black">Status</th>
                <th className="py-4 px-6 text-gravel uppercase text-[10px] tracking-widest font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Spinner color="current" size="sm" />
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gravel font-medium">
                    No operational events discovered.
                  </td>
                </tr>
              ) : (
                events.map((event: any) => {
                  const metadata = typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata;
                  const social = metadata?.social;
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  const isActive = end > new Date();

                  return (
                    <tr key={event.id} className="border-b border-chalk hover:bg-powder/30 transition-colors group">
                      <td className="py-6 px-6">
                        <span className="font-mono text-admin-xs text-slate">EVT-{event.id.toString().padStart(3, '0')}</span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="font-bold text-obsidian text-admin-base">{event.name}</span>
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
                              <Icons.CheckCircle className="w-2.5 h-2.5" /> Social Linked
                            </span>
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border-chalk hover:bg-powder"
                            onClick={() => syncSocial(event.id)}
                          >
                            <Icons.RefreshCw className="w-3 h-3 mr-1.5" /> Sync Social
                          </Button>
                        )}
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col text-admin-xs text-gravel">
                          <span className="font-medium text-obsidian">{start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="opacity-70">{start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col gap-2 w-32">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-obsidian">
                              <span>Live</span>
                              <span>{metadata?.currentOccupancy || 0}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-chalk rounded-full overflow-hidden">
                              <div className="h-full bg-obsidian transition-all duration-1000" style={{ width: `${metadata?.currentOccupancy || 0}%` }}></div>
                           </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="text-admin-base font-bold text-obsidian">{event.locationName || "Location"}</span>
                          <span className="text-[11px] text-gravel leading-tight truncate" title={event.address}>{event.address || "Coordinates pending..."}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="font-mono text-admin-sm text-obsidian font-bold">
                          {metadata?.capacity?.toLocaleString() || "N/A"}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <Chip 
                          size="sm" 
                          variant="soft"
                          className={`font-black text-[10px] uppercase tracking-widest rounded-full ${isActive ? 'bg-obsidian text-eggshell' : 'bg-powder text-gravel opacity-50'}`}
                        >
                          {isActive ? 'Active' : 'Past'}
                        </Chip>
                      </td>
                      <td className="py-6 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="compact">View</Button>
                          <Button variant="compact">Manage</Button>
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
