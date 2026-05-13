'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Checkbox } from '@heroui/react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  events: any[];
  visibleEventIds: Set<string>;
  toggleEventVisibility: (id: string) => void;
  radarEventIds: Set<string>;
  toggleRadar: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  events,
  visibleEventIds,
  toggleEventVisibility,
  radarEventIds,
  toggleRadar,
}) => {
  return (
    <aside
      className={cn(
        "z-30 bg-white/80 backdrop-blur-xl border-r border-chalk shadow-massive transition-all duration-500 flex flex-col overflow-hidden h-full shrink-0",
        "lg:relative fixed inset-y-0 left-0",
        isOpen ? 'w-[var(--sidebar-width)] translate-x-0' : 'w-0 -translate-x-full'
      )}
    >
      <div className="p-8 border-b border-chalk shrink-0 flex justify-between items-center w-[var(--sidebar-width)]">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gravel mb-1">Operative Context</p>
          <h2 className="waldenburg-display text-admin-xl text-obsidian">Control Panel</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <Icons.ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar w-[var(--sidebar-width)]">
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gravel mb-4 flex items-center gap-2">
            <Icons.Layers className="w-3 h-3" />
            Active Layers
          </h3>
          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-powder transition-all cursor-pointer group"
                onClick={() => toggleEventVisibility(event.id.toString())}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: event.primaryColor || '#000' }}
                  />
                  <span className="text-[11px] font-bold text-obsidian truncate max-w-[140px] uppercase tracking-tight">
                    {event.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={cn(
                      "h-7 w-7 flex items-center justify-center rounded-full transition-all",
                      radarEventIds.has(event.id.toString())
                        ? 'bg-ember text-white shadow-subtle'
                        : 'text-gravel hover:bg-chalk opacity-40 group-hover:opacity-100'
                    )}
                    onClick={(e) => toggleRadar(event.id.toString(), e)}
                    title="Radar Scan"
                  >
                    <Icons.Activity className="w-3.5 h-3.5" />
                  </button>
                  <Checkbox
                    isSelected={visibleEventIds.has(event.id.toString())}
                    aria-label={`Toggle ${event.name}`}
                    size="sm"
                    onValueChange={() => toggleEventVisibility(event.id.toString())}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Section */}
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gravel mb-4 flex items-center gap-2">
            <Icons.Navigation className="w-3 h-3" />
            Quick Navigation
          </h3>
          <nav className="space-y-1">
            {/* These could be passed as props if dynamic */}
            <SidebarNavItem icon={Icons.Grid} label="Dashboard" href="/admin" active />
            <SidebarNavItem icon={Icons.Calendar} label="Events" href="/admin/events" />
            <SidebarNavItem icon={Icons.MapPin} label="POIs" href="/admin/pois" />
            <SidebarNavItem icon={Icons.Users} label="Users" href="/admin/users" />
          </nav>
        </section>
      </div>
    </aside>
  );
};

const SidebarNavItem = ({ icon: Icon, label, href, active = false }: any) => (
  <a
    href={href}
    className={cn(
      "flex items-center gap-3 p-2.5 rounded-xl transition-all font-bold text-[11px] uppercase tracking-tight",
      active ? "bg-obsidian text-white shadow-subtle" : "text-gravel hover:bg-powder hover:text-obsidian"
    )}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </a>
);
