'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Checkbox } from '@heroui/react';
import { AdminMap } from '@/components/map/admin-map';
import { useEvents, usePOIs } from '@/hooks/use-admin-data';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

interface BaseAsset {
  id: string | number;
  name: string;
  category?: string;
  eventName?: string;
  address?: string;
  status?: string;
  description?: string;
}

export default function GlobalOperationsPage() {
  const searchParams = useSearchParams();
  const { events, loading: eventsLoading } = useEvents();
  const { pois, loading: poisLoading } = usePOIs();

  const [visibleEventIds, setVisibleEventIds] = useState<Set<string>>(new Set());
  const [radarEventIds, setRadarEventIds] = useState<Set<string>>(new Set());
  const [radarData, setRadarData] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<BaseAsset | null>(null);
  const [mapInitialView, setMapInitialView] = useState({ longitude: 2.2575, latitude: 41.5641, zoom: 15 });

  const processedParams = React.useRef<string | null>(null);

  // Poll for telemetry data
  useEffect(() => {
    if (radarEventIds.size === 0) {
      setRadarData(null);
      return;
    }

    const fetchTelemetry = async () => {
      try {
        const results = await Promise.all(
          Array.from(radarEventIds).map(async (id) => {
            const res = await fetch(`/api/v1/geo/locations?eventId=${id}`);
            if (!res.ok) return null;
            return res.json();
          })
        );

        const allFeatures = results
          .filter(Boolean)
          .flatMap((data: any) => data.features || []);

        setRadarData({
          type: 'FeatureCollection',
          features: allFeatures,
        });
      } catch (error) {
        console.error('Error fetching telemetry:', error);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, [radarEventIds]);

  // Handle initial focus from URL (poiId or eventId)
  useEffect(() => {
    if (eventsLoading || poisLoading) return;

    const poiId = searchParams.get('poiId');
    const eventId = searchParams.get('eventId');
    const paramKey = `${poiId}-${eventId}`;

    // Only run if params have changed and are not null
    if ((poiId || eventId) && processedParams.current !== paramKey) {
      if (poiId && pois.length > 0) {
        const poi = pois.find((p: any) => p.id.toString() === poiId);
        if (poi) {
          processedParams.current = paramKey;
          // 1. Ensure the event it belongs to is visible
          if (poi.eventId) {
            setVisibleEventIds((prev) => {
              if (prev.has(poi.eventId.toString())) return prev;
              return new Set([...Array.from(prev), poi.eventId.toString()]);
            });
          }
          // 2. Select it to open detail panel
          setSelectedAsset(poi);
          // 3. Center map on it
          if (poi.geometry?.coordinates) {
            setMapInitialView({
              longitude: poi.geometry.coordinates[0],
              latitude: poi.geometry.coordinates[1],
              zoom: 18,
            });
          }
        }
      } else if (eventId && events.length > 0) {
        const event = events.find((e: any) => e.id.toString() === eventId);
        if (event) {
          processedParams.current = paramKey;
          setVisibleEventIds((prev) => {
            if (prev.has(event.id.toString())) return prev;
            return new Set([...Array.from(prev), event.id.toString()]);
          });
          setSelectedAsset(event);
          if (event.center?.coordinates) {
            setMapInitialView({
              longitude: event.center.coordinates[0],
              latitude: event.center.coordinates[1],
              zoom: 16,
            });
          }
        }
      }
    }
  }, [searchParams, events, pois, eventsLoading, poisLoading]);

  // Initialize visibility when events load (only if no specific filters)
  useEffect(() => {
    if (events.length > 0 && visibleEventIds.size === 0 && !searchParams.get('eventId') && !searchParams.get('poiId')) {
      const timerId = setTimeout(() => {
        setVisibleEventIds(new Set(events.map((e) => e.id.toString())));
      }, 0);
      return () => clearTimeout(timerId);
    }
  }, [events, visibleEventIds.size, searchParams]);

  const toggleEventVisibility = (id: string) => {
    const next = new Set(visibleEventIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleEventIds(next);
  };

  const toggleRadar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(radarEventIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRadarEventIds(next);
  };

  const filteredEvents = useMemo(
    () => events.filter((e) => visibleEventIds.has(e.id.toString())),
    [events, visibleEventIds]
  );

  const filteredPois = useMemo(
    () => pois.filter((p) => visibleEventIds.has(p.eventId?.toString())),
    [pois, visibleEventIds]
  );

  if (eventsLoading || poisLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-eggshell h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
          <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-admin-xs">
            Loading Global Operations...
          </p>
        </div>
      </div>
    );

  return (
    <div className="relative w-full h-screen bg-eggshell overflow-hidden">
      {/* Full-screen Map */}
      <div className="absolute inset-0 z-0">
        <AdminMap
          mode="GLOBAL_VIEW"
          initialViewState={mapInitialView}
          events={filteredEvents}
          pois={filteredPois}
          onAssetClick={setSelectedAsset}
          radarData={radarData}
        />
      </div>

      {/* Floating Header - Shifted down to clear nav */}
      <div className="absolute top-24 left-12 z-10 pointer-events-none">
        <Card className="p-4 bg-white/80 backdrop-blur-md border-chalk shadow-subtle pointer-events-auto max-w-sm">
          <p className="text-gravel text-[9px] font-black uppercase tracking-[0.2em] mb-1">
            Operational Awareness
          </p>
          <h1 className="waldenburg-display text-[22px] text-obsidian leading-none">
            Global Asset Map.
          </h1>
        </Card>
      </div>

      {/* Event Layers Panel - Shifted down to clear header */}
      <Card className="absolute left-12 top-52 w-64 bg-white/80 backdrop-blur-md p-4 border-chalk shadow-subtle z-10">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-gravel mb-3 border-b border-chalk pb-2">
          Active Layers
        </h3>
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event: any) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-powder/50 transition-colors cursor-pointer"
              onClick={() => toggleEventVisibility(event.id.toString())}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: event.primaryColor || '#000' }}
                />
                <span className="text-[11px] font-bold text-obsidian truncate max-w-[140px]">
                  {event.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 rounded-full transition-colors ${
                    radarEventIds.has(event.id.toString())
                      ? 'bg-ember/20 text-ember hover:bg-ember/30'
                      : 'text-gravel hover:bg-powder'
                  }`}
                  onClick={(e) => toggleRadar(event.id.toString(), e)}
                  title="Toggle Radar"
                >
                  <Icons.Activity className="w-3.5 h-3.5" />
                </Button>
                <Checkbox
                  isSelected={visibleEventIds.has(event.id.toString())}
                  aria-label={`Toggle ${event.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Asset Detail Panel - Shifted down to clear nav */}
      {selectedAsset && (
        <Card className="absolute right-12 top-24 bottom-12 w-80 bg-white/95 backdrop-blur-md border-chalk shadow-massive z-20 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-chalk flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gravel mb-1">
                {selectedAsset.category || 'Asset'}
              </p>
              <h2 className="waldenburg-display text-admin-xl text-obsidian leading-tight">
                {selectedAsset.name}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSelectedAsset(null)}
            >
              <Icons.X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gravel">
                <Icons.MapPin className="w-4 h-4" />
                <span className="text-admin-sm font-medium">
                  {selectedAsset.eventName || 'Operational Area'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gravel">
                <Icons.Maximize className="w-4 h-4" />
                <span className="text-admin-xs leading-tight">
                  {selectedAsset.address || 'Coordinates resolved'}
                </span>
              </div>
            </div>

            <div className="bg-powder/30 p-4 rounded-xl space-y-3 border border-chalk">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-obsidian">
                <span>Occupancy</span>
                <span>{selectedAsset.status || 'Live'}</span>
              </div>
              <div className="h-2 bg-chalk rounded-full overflow-hidden">
                <div className="h-full bg-obsidian" style={{ width: '45%' }} />
              </div>
              <p className="text-[10px] text-gravel text-center italic">Updated 2 mins ago</p>
            </div>

            {selectedAsset.description && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gravel">
                  Description
                </p>
                <p className="text-admin-sm text-obsidian leading-relaxed">
                  {selectedAsset.description}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-chalk grid grid-cols-2 gap-3">
            <Button variant="ghost" size="sm" className="text-admin-xs">
              View Telemetry
            </Button>
            <Button variant="primary" size="sm" className="text-admin-xs">
              Manage Asset
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
