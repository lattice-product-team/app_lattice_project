'use client';

import React, { useState, useMemo } from 'react';
import { Card, ListBox, Checkbox } from "@heroui/react";
import { AdminMap } from "@/components/map/admin-map";
import { useEvents, usePOIs } from "@/hooks/use-admin-data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function GlobalMapPage() {
  const { events, loading: eventsLoading } = useEvents();
  const { pois, loading: poisLoading } = usePOIs();
  
  const [visibleEventIds, setVisibleEventIds] = useState<Set<string>>(new Set());
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Initialize visibility when events load
  useMemo(() => {
    if (events.length > 0 && visibleEventIds.size === 0) {
      setVisibleEventIds(new Set(events.map((e: any) => e.id.toString())));
    }
  }, [events]);

  const toggleEventVisibility = (id: string) => {
    const next = new Set(visibleEventIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleEventIds(next);
  };

  const filteredEvents = useMemo(() => 
    events.filter((e: any) => visibleEventIds.has(e.id.toString())),
    [events, visibleEventIds]
  );

  const filteredPois = useMemo(() => 
    pois.filter((p: any) => visibleEventIds.has(p.eventId?.toString())),
    [pois, visibleEventIds]
  );

  if (eventsLoading || poisLoading) return (
    <div className="flex-1 flex items-center justify-center bg-eggshell h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
        <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-admin-xs">Loading Global Operations...</p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-eggshell overflow-hidden">
      {/* Full-screen Map */}
      <div className="absolute inset-0 z-0">
        <AdminMap 
          mode="GLOBAL_VIEW" 
          events={filteredEvents}
          pois={filteredPois}
          onAssetClick={setSelectedAsset}
        />
      </div>

      {/* Floating Header */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <Card className="p-4 bg-white/80 backdrop-blur-md border-chalk shadow-subtle pointer-events-auto max-w-sm">
          <p className="text-gravel text-[9px] font-black uppercase tracking-[0.2em] mb-1">Operational Awareness</p>
          <h1 className="waldenburg-display text-[22px] text-obsidian leading-none">
            Global Asset Map.
          </h1>
        </Card>
      </div>

      {/* Event Layers Panel */}
      <Card className="absolute left-6 top-32 w-64 bg-white/80 backdrop-blur-md p-4 border-chalk shadow-subtle z-10">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-gravel mb-3 border-b border-chalk pb-2">Active Layers</h3>
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event: any) => (
            <div 
              key={event.id} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-powder/50 transition-colors cursor-pointer"
              onClick={() => toggleEventVisibility(event.id.toString())}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.primaryColor || '#000' }} />
                <span className="text-[11px] font-bold text-obsidian truncate max-w-[140px]">{event.name}</span>
              </div>
              <Checkbox 
                isSelected={visibleEventIds.has(event.id.toString())} 
                aria-label={`Toggle ${event.name}`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Asset Detail Panel */}
      {selectedAsset && (
        <Card className="absolute right-6 top-6 bottom-6 w-80 bg-white/95 backdrop-blur-md border-chalk shadow-massive z-20 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-chalk flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gravel mb-1">{selectedAsset.category || 'Asset'}</p>
              <h2 className="waldenburg-display text-admin-xl text-obsidian leading-tight">{selectedAsset.name}</h2>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedAsset(null)}>
              <Icons.X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gravel">
                 <Icons.MapPin className="w-4 h-4" />
                 <span className="text-admin-sm font-medium">{selectedAsset.eventName || 'Operational Area'}</span>
               </div>
               <div className="flex items-center gap-3 text-gravel">
                 <Icons.Maximize className="w-4 h-4" />
                 <span className="text-admin-xs leading-tight">{selectedAsset.address || 'Coordinates resolved'}</span>
               </div>
            </div>

            <div className="bg-powder/30 p-4 rounded-xl space-y-3 border border-chalk">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-obsidian">
                  <span>Occupancy</span>
                  <span>{selectedAsset.status || 'Live'}</span>
               </div>
               <div className="h-2 bg-chalk rounded-full overflow-hidden">
                  <div className="h-full bg-obsidian" style={{ width: '45%' }} />
               </div>
               <p className="text-[10px] text-gravel text-center italic">Updated 2 mins ago</p>
            </div>

            {selectedAsset.description && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">Description</p>
                <p className="text-admin-sm text-obsidian leading-relaxed">{selectedAsset.description}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-chalk grid grid-cols-2 gap-3">
             <Button variant="ghost" size="sm" className="text-admin-xs">View Telemetry</Button>
             <Button variant="primary" size="sm" className="text-admin-xs">Manage Asset</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
