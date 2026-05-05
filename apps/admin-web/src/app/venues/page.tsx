"use client";

import React from 'react';
import { Chip } from "@heroui/react";
import { Icons } from "@/components/icons";
import { ElevenButton } from "@/components/ui/eleven-button";
import { ElevenCard } from "@/components/ui/eleven-card";

export default function VenuesPage() {
  return (
    <div className="space-y-12 pb-24">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-[14px] font-medium mb-2 uppercase tracking-widest">Venue Management</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Physical locations and operational boundaries.
          </h1>
          <p className="text-gravel text-[16px] leading-relaxed">
            Configure spatial parameters, gate telemetry, and point-of-interest hierarchies across your global infrastructure.
          </p>
        </div>
        <ElevenButton variant="primary" startContent={<Icons.Plus className="w-4 h-4" />}>
          Create New Venue
        </ElevenButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Mock Venue Card */}
        <ElevenCard className="p-0 overflow-hidden group border-1 border-chalk hover:border-obsidian transition-colors">
          <div className="aspect-video bg-powder/50 flex items-center justify-center relative overflow-hidden">
            <span className="text-4xl opacity-20 grayscale group-hover:scale-110 transition-transform duration-500">🗺️</span>
            <div className="absolute top-4 left-4">
              <Chip 
                variant="flat"
                size="sm"
                className="bg-obsidian text-eggshell text-[10px] font-black uppercase rounded-full"
              >
                Active
              </Chip>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="waldenburg-display text-[24px] text-obsidian mb-1">Circuit de Barcelona</h3>
            <p className="text-gravel text-[13px] mb-8 font-medium">Montmeló, Spain • 4.6km track</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-chalk pt-6">
              <div className="flex flex-col">
                 <span className="text-gravel text-[10px] uppercase font-black tracking-widest mb-1">Events</span>
                 <span className="text-[16px] font-bold text-obsidian">12 active</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-gravel text-[10px] uppercase font-black tracking-widest mb-1">POIs</span>
                 <span className="text-[16px] font-bold text-obsidian">154</span>
              </div>
            </div>
            
            <div className="mt-8 pt-4">
              <ElevenButton variant="ghost" fullWidth className="text-[12px] h-10">Configure Spatial Data</ElevenButton>
            </div>
          </div>
        </ElevenCard>

        {/* Empty Placeholder */}
        <div className="border border-dashed border-chalk rounded-2xl flex flex-col items-center justify-center p-12 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:bg-powder/30 group">
          <div className="w-12 h-12 rounded-full border border-chalk flex items-center justify-center mb-4 group-hover:bg-obsidian group-hover:text-eggshell transition-all">
            <Icons.Plus className="w-5 h-5" />
          </div>
          <p className="font-bold text-[12px] uppercase tracking-widest text-gravel">Register Venue</p>
        </div>
      </div>
    </div>
  );
}
