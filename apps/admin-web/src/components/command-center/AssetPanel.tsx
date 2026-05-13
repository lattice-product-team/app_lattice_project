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
    <Card className="absolute right-8 top-32 bottom-32 w-80 bg-white/95 backdrop-blur-md border-chalk shadow-massive z-20 flex flex-col animate-in slide-in-from-right duration-300 rounded-[2rem] overflow-hidden">
      <div className="p-8 border-b border-chalk flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gravel mb-1">
            {asset.category || 'Asset'}
          </p>
          <h2 className="waldenburg-display text-admin-xl text-obsidian leading-tight">
            {asset.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          onClick={onClose}
        >
          <Icons.X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-8 space-y-10 overflow-y-auto custom-scrollbar">
        <div className="space-y-5">
          <div className="flex items-center gap-4 text-gravel">
            <div className="w-8 h-8 rounded-full bg-powder flex items-center justify-center shrink-0">
              <Icons.MapPin className="w-4 h-4" />
            </div>
            <span className="text-admin-sm font-bold text-obsidian uppercase tracking-tight">
              {asset.eventName || 'Operational Area'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gravel">
            <div className="w-8 h-8 rounded-full bg-powder flex items-center justify-center shrink-0">
              <Icons.Maximize className="w-4 h-4" />
            </div>
            <span className="text-admin-xs leading-tight font-medium uppercase tracking-tighter">
              {asset.address || 'Coordinates resolved'}
            </span>
          </div>
        </div>

        <div className="bg-powder/40 p-6 rounded-3xl space-y-4 border border-chalk/50 shadow-subtle">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-obsidian">
            <span>Occupancy</span>
            <span className="text-signal-blue">{asset.status || 'Live'}</span>
          </div>
          <div className="h-1.5 bg-chalk rounded-full overflow-hidden">
            <div className="h-full bg-obsidian" style={{ width: '45%' }} />
          </div>
          <p className="text-[9px] text-gravel/60 text-center font-black uppercase tracking-widest">Last Update: 2m ago</p>
        </div>

        {asset.description && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
              Logistics Note
            </p>
            <p className="text-admin-sm text-obsidian leading-relaxed font-medium">
              {asset.description}
            </p>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-chalk grid grid-cols-2 gap-3 bg-powder/20">
        <Button variant="ghost" size="sm" className="h-11 text-[10px] font-black uppercase tracking-widest">
          Telemetry
        </Button>
        <Button variant="primary" size="sm" className="h-11 text-[10px] font-black uppercase tracking-widest">
          Manage
        </Button>
      </div>
    </Card>
  );
};
