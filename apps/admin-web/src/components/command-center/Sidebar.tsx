'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Checkbox } from '@heroui/react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('./ThemeToggle').then((mod) => mod.ThemeToggle), {
  ssr: false,
});

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  events: any[];
  visibleEventIds: Set<string>;
  toggleEventVisibility: (id: string) => void;
  isolateEventVisibility: (id: string) => void;
  radarEventIds: Set<string>;
  toggleRadar: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  events,
  visibleEventIds,
  toggleEventVisibility,
  isolateEventVisibility,
  radarEventIds,
  toggleRadar,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <aside
      className={cn(
        'z-[200] bg-background border border-border shadow-massive flex flex-col overflow-hidden shrink-0',
        'fixed left-8 top-8 bottom-8 rounded-[2.5rem] transition-all duration-500',
        'animate-in slide-in-from-left duration-500',
        isOpen
          ? 'w-[var(--sidebar-width)] translate-x-0 opacity-100'
          : 'w-0 -translate-x-full opacity-0 pointer-events-none'
      )}
    >
      <div className="px-8 pt-[calc(var(--admin-safe-area)+1rem)] pb-8 border-b border-border/10 shrink-0 flex justify-between items-center w-[var(--sidebar-width)]">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-gravel mb-1">
            Operative Context
          </p>
          <h2 className="waldenburg-display text-admin-xl text-foreground">Control Panel</h2>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300 border border-border"
          title="Close Sidebar"
        >
          <Icons.ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar w-[var(--sidebar-width)]">
        {/* Search Section */}
        <section>
          <div className="bg-surface/40 border border-border/20 rounded-xl px-4 py-2 flex items-center gap-3 transition-all focus-within:border-foreground/20">
            <Icons.Search className="w-3.5 h-3.5 text-gravel opacity-50" />
            <input
              type="text"
              placeholder="Filter context..."
              defaultValue={searchParams.get('q') || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[11px] font-medium uppercase tracking-tight text-foreground placeholder:text-gravel/40"
            />
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-gravel mb-4 flex items-center gap-2">
            <Icons.Layers className="w-3 h-3" />
            Active Layers
          </h3>
          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'flex items-center justify-between p-2.5 rounded-xl hover:bg-elevated transition-all cursor-pointer group',
                  !visibleEventIds.has(event.id.toString()) && 'opacity-60 grayscale-[0.3]'
                )}
                onClick={() => isolateEventVisibility(event.id.toString())}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: event.primaryColor || '#000' }}
                    />
                    {new Date() >= new Date(event.startDate) &&
                      new Date() <= new Date(event.endDate) && (
                        <div
                          className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: event.primaryColor || '#000' }}
                        />
                      )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-medium text-foreground truncate max-w-[140px] uppercase tracking-tight">
                      {event.name}
                    </span>
                    <span
                      className={cn(
                        'text-[7px] font-medium uppercase tracking-[0.1em] mt-0.5',
                        new Date() >= new Date(event.startDate) &&
                          new Date() <= new Date(event.endDate)
                          ? 'text-emerald-500'
                          : new Date() > new Date(event.endDate)
                            ? 'text-gravel/40'
                            : 'text-amber-500/80'
                      )}
                    >
                      {new Date() >= new Date(event.startDate) &&
                      new Date() <= new Date(event.endDate)
                        ? '• Live Now'
                        : new Date() > new Date(event.endDate)
                          ? 'Completed'
                          : 'Scheduled'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={cn(
                      'h-7 w-7 flex items-center justify-center rounded-full transition-all',
                      radarEventIds.has(event.id.toString())
                        ? 'bg-ember text-white shadow-subtle'
                        : 'text-gravel hover:bg-border/50 opacity-40 group-hover:opacity-100'
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
      </div>

      {/* Sidebar Footer with Theme Toggle */}
      <div className="p-6 border-t border-border/10 flex items-center justify-between shrink-0 w-[var(--sidebar-width)]">
        <ThemeToggle />
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-medium uppercase tracking-widest text-gravel/60">
            Lattice OS
          </span>
          <span className="text-[7px] font-medium text-gravel/40 uppercase">v0.1.0-alpha</span>
        </div>
      </div>
    </aside>
  );
};
