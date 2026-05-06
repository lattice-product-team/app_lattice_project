"use client";

import React from "react";
import { Chip, Spinner, Tooltip } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { usePOIs } from "@/hooks/use-admin-data";

export default function POIsPage() {
  const { pois, loading, refetch } = usePOIs();

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
    <div className="space-y-12 pb-24">
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
          <Button variant="primary">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Register New Asset
          </Button>
        </div>
      </header>

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
                    <Spinner color="current" size="sm" label="Synchronizing infrastructure telemetry..." />
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
                            <Tooltip content="Source: Google Maps via DataForSEO">
                              <span className="text-[9px] text-signal-blue font-bold uppercase tracking-tighter flex items-center gap-1 cursor-help">
                                <Icons.CheckCircle className="w-2.5 h-2.5" /> Verified Social
                              </span>
                            </Tooltip>
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
                            <Icons.Accessibility className="w-4 h-4" title="Wheelchair Accessible" />
                          )}
                          {poi.hasPriorityLane && (
                            <Icons.UserCheck className="w-4 h-4 text-signal-blue" title="Priority Lane" />
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
