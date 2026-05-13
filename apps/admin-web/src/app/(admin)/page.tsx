'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AdminMap } from '@/components/map/admin-map';
import { useEvents, usePOIs } from '@/hooks/use-admin-data';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/command-center/Sidebar';
import { AssetPanel } from '@/components/command-center/AssetPanel';
import { useSidebar } from '@/hooks/use-sidebar';

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
  const { isOpen: isSidebarOpen, close: closeSidebar } = useSidebar();

  const [visibleEventIds, setVisibleEventIds] = useState<Set<string>>(new Set());
  const [radarEventIds, setRadarEventIds] = useState<Set<string>>(new Set());
  const [radarData, setRadarData] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<BaseAsset | null>(null);
  const [mapInitialView, setMapInitialView] = useState({ longitude: 2.2575, latitude: 41.5641, zoom: 15 });
  
  const searchTerm = searchParams.get('q') || '';
  const processedParams = React.useRef<string | null>(null);
  const lastCenteredAssetId = React.useRef<string | null>(null);

  // Filtering events based on search
  const filteredEventsForList = useMemo(() => {
    if (!searchTerm) return events;
    return events.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [events, searchTerm]);

  // Clear selection when search is emptied
  useEffect(() => {
    if (!searchTerm && !searchParams.get('eventId') && !searchParams.get('poiId')) {
      setSelectedAsset(null);
    }
  }, [searchTerm, searchParams]);

  const activeEventBoundary = useMemo(() => {
    // If a specific asset is selected, focus on its boundary
    if (selectedAsset && (selectedAsset as any).boundary) {
      return {
        type: 'Feature',
        geometry: (selectedAsset as any).boundary,
        properties: {}
      };
    }
    
    // If no specific asset but we have multiple events and it's initial load/no search,
    // we can create a combined boundary to fit all events.
    if (!searchTerm && !selectedAsset && events.length > 0 && !searchParams.get('eventId') && !searchParams.get('poiId')) {
      // Simple combined bbox logic: create a feature that encompasses all event centers
      const allCoords = events
        .map(e => e.center?.coordinates)
        .filter(Boolean) as [number, number][];
      
      if (allCoords.length > 1) {
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [allCoords] // This is a hack to get AdminMap's getBBox to work with centers
          },
          properties: { isGlobalFit: true }
        };
      }
    }
    return null;
  }, [selectedAsset, events, searchTerm, searchParams]);

  // Center map on search result if unique
  useEffect(() => {
    if (searchTerm && filteredEventsForList.length === 1) {
      const event = filteredEventsForList[0];
      const eventId = event.id.toString();

      // Only auto-center if this is a new result we haven't centered on yet
      if (lastCenteredAssetId.current !== eventId) {
        setSelectedAsset(event);
        lastCenteredAssetId.current = eventId;
        
        // Only set initial view if no boundary is available (boundary-fitting happens in AdminMap)
        if (!event.boundary && event.center?.coordinates) {
          setMapInitialView({
            longitude: event.center.coordinates[0],
            latitude: event.center.coordinates[1],
            zoom: 16,
          });
        }
      }
    } else if (!searchTerm) {
      // Reset tracking when search is cleared to allow re-centering if searching again
      lastCenteredAssetId.current = null;
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

  // Center map on selected asset (especially for POIs which don't have boundaries)
  useEffect(() => {
    if (selectedAsset) {
      const isPoi = (selectedAsset as any).geometry?.type === 'Point' || (selectedAsset as any).category && (selectedAsset as any).category !== 'EVENT';
      const coords = (selectedAsset as any).geometry?.coordinates || (selectedAsset as any).center?.coordinates;
      
      if (isPoi && coords) {
        setMapInitialView({
          longitude: coords[0],
          latitude: coords[1],
          zoom: 18,
        });
      }
    }
  }, [selectedAsset]);

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
          if (!event.boundary && event.center?.coordinates) {
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

  const isolateEventVisibility = (id: string) => {
    const event = events.find((e) => e.id.toString() === id);
    
    // If only this one is visible, show all. Otherwise, isolate this one.
    if (visibleEventIds.size === 1 && visibleEventIds.has(id)) {
      setVisibleEventIds(new Set(events.map((e) => e.id.toString())));
      setSelectedAsset(null);
    } else {
      setVisibleEventIds(new Set([id]));
      if (event) setSelectedAsset(event);
    }
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
    <div className="flex h-screen w-full bg-eggshell overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        events={filteredEventsForList}
        visibleEventIds={visibleEventIds}
        toggleEventVisibility={toggleEventVisibility}
        isolateEventVisibility={isolateEventVisibility}
        radarEventIds={radarEventIds}
        toggleRadar={toggleRadar}
      />

      <main className="flex-1 relative min-w-0">
        <AdminMap
          mode="GLOBAL_VIEW"
          initialViewState={mapInitialView}
          events={activeEventsOnMap}
          pois={activePoisOnMap}
          onAssetClick={setSelectedAsset}
          selectedAssetId={selectedAsset?.id}
          activeEventBoundary={activeEventBoundary}
          radarData={radarData}
        />

        {selectedAsset && (
          <AssetPanel 
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onToggleRadar={(e) => toggleRadar(selectedAsset.id.toString(), e)}
            isRadarActive={radarEventIds.has(selectedAsset.id.toString())}
          />
        )}
      </main>
    </div>
  );
}
