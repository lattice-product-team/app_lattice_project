"use client";

import React from 'react';
import { Button, Card, Chip } from "@heroui/react";
import { Icons } from "@/components/icons";

export default function VenuesPage() {
  return (
    <div>
      <header className="flex justify-between items-center mb-10 pt-12 px-6">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="light" className="text-white/70">
            <Icons.Sidebar className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Venues</h1>
            <p className="text-white/30 text-xs font-medium mt-0.5">Manage physical locations and boundaries.</p>
          </div>
        </div>
        <Button 
          color="primary"
          className="rounded-full font-medium"
          startContent={<Icons.Plus className="w-4 h-4" />}
        >
          Create Venue
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Mock Venue Card */}
        <Card 
          className="bg-surface border border-white/5 hover:border-white/10 shadow-none rounded-3xl p-2 transition-all group"
        >
          <div className="p-3">
            <div className="w-full h-40 bg-white/5 rounded-2xl mb-6 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <span className="text-5xl">🗺️</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <Chip 
                  variant="flat"
                  color="success"
                  size="sm"
                  className="font-medium"
                >
                  Active
                </Chip>
              </div>
            </div>
            
            <div className="px-3 pb-4">
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">Circuit de Barcelona</h3>
              <p className="text-xs text-white/30 mb-8 font-medium">Montmeló, Spain • 4.6km track</p>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex flex-col">
                   <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Events</span>
                   <span className="text-sm font-bold text-white/80">12 active</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">POIs</span>
                   <span className="text-sm font-bold text-white/40">154</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Empty Placeholder */}
        <div className="border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:bg-white/5 group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-all">
            <Icons.Plus className="w-6 h-6" />
          </div>
          <p className="font-medium text-xs text-white/50">Create New Venue</p>
        </div>
      </div>
    </div>
  );
}
