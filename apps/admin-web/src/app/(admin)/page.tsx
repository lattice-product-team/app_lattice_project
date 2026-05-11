'use client';

import React, { useState, useMemo } from 'react';
import { Spinner } from '@heroui/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStats, useEvents, useEventStats } from '@/hooks/use-admin-data';
import { Sparkline } from '@/components/sparkline';
import { cn } from '@/lib/utils';

interface Event {
  id: string | number;
  name: string;
  description?: string;
}

export default function Dashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { events, loading: eventsLoading } = useEvents();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedEvent, _setSelectedEvent] = useState<string>('');
  const { stats: eventStats, loading: eventStatsLoading } = useEventStats(selectedEvent);

  const loading = statsLoading || eventsLoading;

  const activeEvent = useMemo(
    () => events.find((e: Event) => e.id.toString() === selectedEvent) || events[0],
    [selectedEvent, events]
  );

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-eggshell h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
          <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-admin-xs">
            Initializing Operations Center…
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-16 px-8 py-12 pb-24">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-3xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">
            Global Operations Center
          </p>
          <h1 className="waldenburg-display text-[56px] text-obsidian leading-[1] mb-8 text-pretty">
            Architecting real-time event operations with restraint.
          </h1>
        </div>
      </header>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Live Users*',
            value: stats?.liveUsers?.toLocaleString() ?? '0',
            trend: '+12%',
            data: [10, 45, 30, 70, 50, 90, 85],
          },
          {
            label: 'Active Events',
            value: stats?.activeEvents ?? '0',
            data: [2, 3, 2, 4, 3, 3, 3],
          },
          { label: 'System Capacity*', value: stats?.totalCapacity?.toLocaleString() ?? '0', data: [120, 120, 120, 120, 120, 120, 120] },
          { label: 'Active Alerts*', value: stats?.activeAlerts ?? '0', dark: true, alert: true },
        ].map((m, i) => (
          <Card
            key={i}
            className={cn('relative overflow-hidden', m.dark && 'bg-obsidian text-eggshell')}
          >
            <p
              className={cn(
                'text-admin-xs font-bold uppercase tracking-widest mb-6',
                m.dark ? 'text-eggshell/50' : 'text-gravel'
              )}
            >
              {m.label}
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-admin-xl font-bold tabular-nums">{m.value}</h3>
                {m.trend && (
                  <span className="text-[10px] font-black tracking-tighter opacity-60">
                    {m.trend}
                  </span>
                )}
              </div>
              {!m.alert && <Sparkline data={m.data} color={m.dark ? 'white' : 'black'} />}
              {m.alert && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-ember animate-ping" aria-hidden="true" />
                  <span className="text-[10px] font-black uppercase text-ember">Critical</span>
                </div>
              )}
            </div>
            {/* Background Texture Effect */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
              aria-hidden="true"
            />
          </Card>
        ))}
      </div>

      {/* Active Event Showcase */}
      {activeEvent && (
        <Card className="p-0 overflow-hidden border border-chalk shadow-subtle-3">
          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
            <div className="lg:col-span-3 p-16 flex flex-col justify-center bg-white relative overflow-hidden">
              {/* Ambient Background Glow */}
              <div
                className="absolute -top-24 -left-24 w-64 h-64 bg-signal-blue/5 rounded-full blur-3xl"
                aria-hidden="true"
              />

              <div className="flex items-center gap-3 mb-8 relative">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-signal-blue" aria-hidden="true" />
                  <div
                    className="absolute inset-0 w-2 h-2 rounded-full bg-signal-blue animate-ping opacity-75"
                    aria-hidden="true"
                  />
                </div>
                <span className="pill-label text-admin-xs text-obsidian">Live Environment</span>
              </div>

              <h2 className="waldenburg-display text-[48px] text-obsidian mb-6 leading-[1.1]">
                {activeEvent.name}
              </h2>
              <p className="text-gravel text-admin-md leading-relaxed mb-10 max-w-lg">
                {activeEvent.description ||
                  'Comprehensive operational oversight for this event environment. Type-first monitoring and severe yet warm control systems.'}
              </p>

              <div className="flex gap-4">
                <Button variant="primary" className="h-12 px-8" as="a" href={`/map?eventId=${activeEvent.id}`}>
                  View Map
                </Button>
                <Button variant="ghost" className="h-12 px-8" as="a" href="/events">
                  Event Settings
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2 p-16 bg-powder/40 flex flex-col justify-between border-l border-chalk relative">
              {/* Noise Overlay */}
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"
                aria-hidden="true"
              />

              <div className="space-y-12 relative">
                <div>
                  <p className="text-gravel text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">
                    Estimated Capacity*
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-admin-xl font-bold text-obsidian tabular-nums">
                      {eventStats?.estimatedCapacity?.toLocaleString() ?? 'Synchronizing…'}
                    </h3>
                    {eventStatsLoading && (
                      <Spinner size="sm" color="current" className="opacity-20" />
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-gravel text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">
                    Inflow Velocity*
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-admin-xl font-bold text-obsidian tabular-nums">
                      {eventStats?.entryRate ?? '0'}
                      <span className="text-admin-xs font-medium ml-1">/min</span>
                    </h3>
                  </div>
                </div>

                <div className="pt-8 border-t border-chalk/50">
                  <p className="text-gravel text-admin-xs font-bold uppercase tracking-widest mb-6 opacity-40">
                    Personnel Status*
                  </p>
                  <div className="space-y-5">
                    {['Security Alpha', 'Medical Unit B', 'Operations Core'].map((staff, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-help">
                        <span className="text-obsidian text-admin-base font-medium group-hover:translate-x-1 transition-transform">
                          {staff}
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-success shadow-hairline"
                            aria-hidden="true"
                          />
                          <span className="text-[10px] font-black tracking-widest text-obsidian uppercase">
                            Online
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[9px] text-gravel uppercase font-black tracking-[0.2em] opacity-30">
                  Lattice OS 2.1 — Signal Stable
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <footer className="pt-8 border-t border-chalk/30">
        <p className="text-gravel text-[10px] font-medium opacity-50 uppercase tracking-widest">
          * Simulated telemetry for demonstration purposes. Real-time sensor integration pending.
        </p>
      </footer>
    </div>
  );
}
