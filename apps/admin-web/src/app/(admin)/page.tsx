'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AdminMap } from '@/components/map/admin-map';
import { useEvents, usePOIs } from '@/hooks/use-admin-data';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/command-center/Sidebar';
import { CommandDock } from '@/components/command-center/CommandDock';
import { AssetPanel } from '@/components/command-center/AssetPanel';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const processedParams = React.useRef<string | null>(null);

  // Filtering events based on search
  const filteredEventsForList = useMemo(() => {
    if (!searchTerm) return events;
    return events.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [events, searchTerm]);

  // Center map on search result if unique
  useEffect(() => {
    if (searchTerm && filteredEventsForList.length === 1) {
      const event = filteredEventsForList[0];
      if (event.center?.coordinates) {
        setMapInitialView({
          longitude: event.center.coordinates[0],
          latitude: event.center.coordinates[1],
          zoom: 16,
        });
        setSelectedAsset(event);
      }
    }
  }, [searchTerm, filteredEventsForList]);

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

    if ((poiId || eventId) && processedParams.current !== paramKey) {
      if (poiId && pois.length > 0) {
        const poi = pois.find((p: any) => p.id.toString() === poiId);
        if (poi) {
          processedParams.current = paramKey;
          if (poi.eventId) {
            setVisibleEventIds((prev) => {
              if (prev.has(poi.eventId.toString())) return prev;
              return new Set([...Array.from(prev), poi.eventId.toString()]);
            });
          }
          setSelectedAsset(poi);
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

  // Initialize visibility when events load
  useEffect(() => {
    if (events.length > 0 && visibleEventIds.size === 0 && !searchParams.get('eventId') && !searchParams.get('poiId')) {
      setVisibleEventIds(new Set(events.map((e) => e.id.toString())));
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

  const activeEventsOnMap = useMemo(
    () => events.filter((e) => visibleEventIds.has(e.id.toString())),
    [events, visibleEventIds]
  );

  const activePoisOnMap = useMemo(
    () => pois.filter((p) => visibleEventIds.has(p.eventId?.toString())),
    [pois, visibleEventIds]
  );

  if (eventsLoading || poisLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-eggshell h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
          <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-admin-xs">
            Loading Command Center...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen w-full bg-eggshell overflow-hidden -mt-[var(--admin-safe-area)]">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        events={filteredEventsForList}
        visibleEventIds={visibleEventIds}
        toggleEventVisibility={toggleEventVisibility}
        radarEventIds={radarEventIds}
        toggleRadar={toggleRadar}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <CommandDock 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 relative overflow-hidden">
          <AdminMap
            mode="GLOBAL_VIEW"
            initialViewState={mapInitialView}
            events={activeEventsOnMap}
            pois={activePoisOnMap}
            onAssetClick={setSelectedAsset}
            radarData={radarData}
          />

          {selectedAsset && (
            <AssetPanel 
              asset={selectedAsset}
              onClose={() => setSelectedAsset(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
