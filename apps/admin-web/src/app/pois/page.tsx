"use client";

import React from "react";
import { Chip } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { usePOIs } from "@/hooks/use-admin-data";

export default function POIsPage() {
  const { pois, loading } = usePOIs();

  return (
    <div className="space-y-12 pb-24">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Points of Interest</p>
          <h1 className="waldenburg-display text-[48px] text-obsidian leading-[1.08] mb-4">
            Global Asset Registry.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Centralized management of stages, services, and amenities across all active event environments. 
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="primary" className="h-12 px-8">
            <Icons.Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Create Asset
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-chalk overflow-hidden shadow-subtle">
        <table className="min-w-full divide-y divide-chalk/50">
          <thead>
            <tr className="bg-powder/50">
              <th scope="col" className="text-left text-gravel uppercase text-[10px] font-black tracking-widest py-4 px-8">Asset Name</th>
              <th scope="col" className="text-left text-gravel uppercase text-[10px] font-black tracking-widest py-4 px-8">Category</th>
              <th scope="col" className="text-left text-gravel uppercase text-[10px] font-black tracking-widest py-4 px-8">Event Environment</th>
              <th scope="col" className="text-right text-gravel uppercase text-[10px] font-black tracking-widest py-4 px-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chalk/50 bg-white">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gravel animate-pulse font-medium uppercase text-[10px] tracking-widest">
                  Synchronizing Asset Registry…
                </td>
              </tr>
            ) : pois.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gravel font-medium uppercase text-[10px] tracking-widest">
                  No points of interest defined.
                </td>
              </tr>
            ) : (
              pois.map((poi: any) => (
                <tr key={poi.id} className="hover:bg-eggshell/50 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-signal-blue" aria-hidden="true" />
                      <span className="text-obsidian font-bold text-admin-base">{poi.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <Chip size="sm" variant="flat" className="bg-powder text-gravel font-bold uppercase text-[9px] tracking-widest px-3 border border-chalk/50">
                      {poi.category}
                    </Chip>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-gravel font-medium text-admin-sm tabular-nums">
                      {poi.eventName || "— Global —"}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="compact">Edit Asset</Button>
                      <Button variant="compact">Remove</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend Note */}
      <footer className="pt-8 border-t border-chalk/30">
        <p className="text-gravel text-[10px] font-medium opacity-50 uppercase tracking-widest">
          Lattice OS 2.1 — Asset Synchronization Active
        </p>
      </footer>
    </div>
  );
}
