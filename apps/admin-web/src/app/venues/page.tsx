"use client";

import React from 'react';
import { Chip, Spinner } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useVenues } from "@/hooks/use-admin-data";

export default function VenuesPage() {
  const { venues, loading, error } = useVenues();

  return (
    <div className="space-y-12 pb-24">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Venue Logistics</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Spatial orchestration of physical sites.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Manage capacity, entry protocols, and infrastructure status for all global venues in real-time.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Export Manifest</Button>
          <Button variant="primary">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Register Venue
          </Button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-admin-base font-medium">
          Failed to load venues: {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-chalk pb-4">
          <div className="flex items-center gap-3">
            <h2 className="waldenburg-display text-[24px] text-obsidian">Global Infrastructure</h2>
            <span className="bg-powder px-2 py-0.5 rounded text-[10px] font-black border border-chalk text-obsidian uppercase tracking-widest">
              {venues.length} Venues
            </span>
          </div>
          <div className="w-64">
             <Input placeholder="Filter registry..." variant="transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="h-96 flex items-center justify-center animate-pulse border border-chalk">
                <Spinner color="current" size="sm" />
              </Card>
            ))
          ) : (
            <>
              {venues.map((venue: any) => (
                <Card key={venue.id} className="p-0 overflow-hidden group border border-chalk hover:border-obsidian transition-colors hover:shadow-subtle-2">
                  <div className="aspect-video bg-powder/50 flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl opacity-20 grayscale group-hover:scale-110 transition-transform duration-500">🗺️</span>
                    <div className="absolute top-4 left-4">
                      <Chip 
                        variant="soft"
                        size="sm"
                        className="bg-obsidian text-eggshell text-[10px] font-black uppercase rounded-full"
                      >
                        Operational
                      </Chip>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="waldenburg-display text-admin-xl text-obsidian mb-1">{venue.name}</h3>
                    <p className="text-gravel text-admin-sm mb-8 font-medium">
                      {venue.locationName || "Location TBD"}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-chalk pt-6">
                      <div className="flex flex-col">
                         <span className="text-gravel text-[10px] uppercase font-black tracking-widest mb-1">Status</span>
                         <span className="text-admin-md font-bold text-obsidian capitalize">Live</span>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-gravel text-[10px] uppercase font-black tracking-widest mb-1">ID</span>
                         <span className="text-admin-md font-bold text-obsidian">#{venue.id}</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-4">
                      <Button variant="ghost" fullWidth className="text-admin-xs h-10">Manage Infrastructure</Button>
                    </div>
                  </div>
                </Card>
              ))}

              {venues.length === 0 && !loading && !error && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-gravel border border-dashed border-chalk rounded-2xl">
                  <p className="text-admin-base font-medium italic">No venues found in the operational database.</p>
                </div>
              )}
            </>
          )}

          {/* New Venue Placeholder */}
          <button className="border-2 border-dashed border-chalk rounded-[32px] min-h-75 flex flex-col items-center justify-center gap-4 hover:border-obsidian/30 hover:bg-powder/20 transition-all group">
            <div className="w-12 h-12 rounded-full border border-chalk flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icons.Plus className="text-gravel w-6 h-6" />
            </div>
            <p className="text-gravel text-admin-xs font-black uppercase tracking-widest">Register New Asset</p>
          </button>
        </div>
      </div>
    </div>
  );
}
