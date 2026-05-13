'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface AssetPanelProps {
  asset: any;
  onClose: () => void;
}

export const AssetPanel: React.FC<AssetPanelProps> = ({ asset, onClose }) => {
  return (
    <Card className="absolute right-8 top-[var(--admin-safe-area)] w-[380px] bg-white/40 backdrop-blur-xl border border-white/20 shadow-massive z-20 flex flex-col animate-in slide-in-from-right duration-500 rounded-[2.5rem] overflow-hidden max-h-[calc(100vh-var(--admin-safe-area)-4rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/10">
        <div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gravel block mb-1">
            {asset.category || 'Asset'}
          </span>
          <h2 className="waldenburg-display text-admin-xl text-obsidian leading-tight">
            {asset.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-full hover:bg-white/20 transition-colors"
          onClick={onClose}
        >
          <Icons.X className="w-4 h-4 text-obsidian" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Logistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 p-4 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase tracking-widest text-gravel mb-1.5">Event</p>
            <p className="text-[11px] font-bold text-obsidian uppercase truncate">
              {asset.eventName || 'Global Ops'}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase tracking-widest text-gravel mb-1.5">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-success uppercase tracking-wider">{asset.status || 'Live'}</span>
            </div>
          </div>
        </div>

        {/* Location Detail */}
        <div className="space-y-2">
          <p className="text-[8px] font-black uppercase tracking-widest text-gravel px-1">Primary Location</p>
          <div className="bg-white/20 p-4 rounded-2xl border border-white/10 flex items-start gap-3">
            <Icons.Maximize className="w-3.5 h-3.5 text-gravel shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-obsidian leading-relaxed">
              {asset.address || 'Coordinates resolved to operative zone'}
            </p>
          </div>
        </div>

        {/* Load / Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-gravel">Operational Load</p>
            <span className="text-[10px] font-black text-obsidian">45%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-obsidian transition-all duration-1000 ease-out" style={{ width: '45%' }} />
          </div>
        </div>

        {asset.description && (
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-widest text-gravel px-1">Intel Notes</p>
            <p className="text-[11px] text-gravel leading-relaxed font-medium">
              {asset.description}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-8 py-6 flex gap-3 bg-white/10 border-t border-white/10">
        <Button variant="outline" className="flex-1 h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-white/20 bg-white/5 hover:bg-white/20 transition-all">
          Telemetry
        </Button>
        <Button className="flex-1 h-11 rounded-xl bg-obsidian text-white text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all shadow-subtle">
          Manage
        </Button>
      </div>
    </Card>
  );
};
