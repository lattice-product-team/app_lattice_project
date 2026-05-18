'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AssetPanelProps {
  asset: any;
  onClose: () => void;
  onToggleRadar?: (e: React.MouseEvent) => void;
  isRadarActive?: boolean;
}

export const AssetPanel: React.FC<AssetPanelProps> = ({
  asset,
  onClose,
  onToggleRadar,
  isRadarActive,
}) => {
  const router = useRouter();

  const handleManage = () => {
    if (asset.category === 'EVENT' || !asset.category) {
      router.push(`/events?eventId=${asset.id}`);
    } else {
      router.push(`/pois?poiId=${asset.id}`);
    }
  };

  const handleTelemetry = (e: React.MouseEvent) => {
    if (onToggleRadar) {
      onToggleRadar(e);
    }
  };

  return (
    <Card className="absolute right-8 top-24 w-[380px] bg-surface border border-border/20 shadow-massive z-[150] flex flex-col animate-in slide-in-from-right duration-500 rounded-[2.5rem] overflow-hidden max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border/10 flex justify-between items-center bg-elevated/20">
        <div>
          <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-gravel block mb-1">
            {asset.category || 'Asset'}
          </span>
          <h2 className="waldenburg-display text-admin-xl text-foreground leading-tight">
            {asset.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-full hover:bg-elevated/50 transition-colors"
          onClick={onClose}
        >
          <Icons.X className="w-4 h-4 text-foreground" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Logistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-elevated/40 p-4 rounded-2xl border border-border/10">
            <p className="text-[8px] font-medium uppercase tracking-widest text-gravel mb-1.5">
              Event
            </p>
            <p className="text-[11px] font-medium text-foreground uppercase truncate">
              {asset.eventName || 'Global Ops'}
            </p>
          </div>
          <div className="bg-elevated/40 p-4 rounded-2xl border border-border/10">
            <p className="text-[8px] font-medium uppercase tracking-widest text-gravel mb-1.5">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-medium text-success uppercase tracking-wider">
                {asset.status || 'Live'}
              </span>
            </div>
          </div>
        </div>

        {/* Location Detail */}
        <div className="space-y-2">
          <p className="text-[8px] font-medium uppercase tracking-widest text-gravel px-1">
            Primary Location
          </p>
          <div className="bg-elevated/40 p-4 rounded-2xl border border-border/10 flex items-start gap-3">
            <Icons.Maximize className="w-3.5 h-3.5 text-gravel shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-foreground leading-relaxed">
              {asset.address || 'Coordinates resolved to operative zone'}
            </p>
          </div>
        </div>

        {/* Load / Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <p className="text-[8px] font-medium uppercase tracking-widest text-gravel">
              Operational Load
            </p>
            <span className="text-[10px] font-medium text-foreground">{asset.load || '45'}%</span>
          </div>
          <div className="h-1 bg-border/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-1000 ease-out"
              style={{ width: `${asset.load || 45}%` }}
            />
          </div>
        </div>

        {asset.description && (
          <div className="space-y-2">
            <p className="text-[8px] font-medium uppercase tracking-widest text-gravel px-1">
              Intel Notes
            </p>
            <p className="text-[11px] text-gravel leading-relaxed font-medium">
              {asset.description}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-8 py-6 flex gap-3 bg-elevated/20 border-t border-border/10">
        <button
          onClick={handleTelemetry}
          className={cn(
            'flex-1 h-11 rounded-xl text-[10px] font-medium uppercase tracking-[0.15em] border border-border/20 transition-all active:scale-95 shadow-sm',
            isRadarActive
              ? 'bg-signal-blue text-white border-signal-blue shadow-lg scale-105'
              : 'bg-elevated/50 text-foreground hover:bg-elevated'
          )}
        >
          {isRadarActive ? 'Radar Active' : 'Telemetry'}
        </button>
        <Button
          onClick={handleManage}
          className="flex-1 h-11 rounded-xl bg-foreground text-background text-[10px] font-medium uppercase tracking-[0.15em] hover:opacity-90 active:scale-95 transition-all shadow-massive"
        >
          Manage
        </Button>
      </div>
    </Card>
  );
};
