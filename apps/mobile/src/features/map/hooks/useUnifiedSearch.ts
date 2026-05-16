import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { geoService } from '../../../services/geoService';
import { normalizePOI } from '../../poi/adapters/poiAdapter';

export interface SearchResult {
  id: string | number;
  name: string;
  type: 'event' | 'poi';
  category?: string;
  categoryLabel?: string;
  imageUrl?: string;
  description?: string;
  coordinates?: [number, number];
  raw: any;
}

/**
 * useUnifiedSearch: Advanced multi-parameter search for Events and POIs.
 * Supports keyword matching across titles, descriptions, and categories.
 */
export const useUnifiedSearch = (query: string) => {
  // 1. Fetch Events
  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['events', 'search-global'],
    queryFn: () => geoService.getEvents(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. Fetch POIs
  const { data: poisData, isLoading: loadingPois } = useQuery({
    queryKey: ['pois', 'search-global'],
    queryFn: () => geoService.getPOIs(),
    staleTime: 1000 * 60 * 5,
  });

  const searchResults = useMemo(() => {
    // Normalization
    const normalizedEvents: SearchResult[] = events.map(e => ({
      id: `event-${e.id}`,
      name: e.name,
      type: 'event',
      category: e.type,
      categoryLabel: e.type,
      imageUrl: e.imageUrl,
      description: e.description || '',
      coordinates: e.center?.coordinates,
      raw: e,
    }));

    const normalizedPois: SearchResult[] = (poisData?.features || []).map(f => {
      const poi = normalizePOI(f);
      return {
        id: `poi-${poi.id}`,
        name: poi.displayName,
        type: 'poi',
        category: poi.category,
        categoryLabel: poi.categoryLabel,
        imageUrl: poi.images?.[0],
        description: poi.description || '',
        coordinates: poi.coordinates as [number, number],
        raw: poi,
      };
    });

    const allResults = [...normalizedEvents, ...normalizedPois];

    if (!query || query.trim() === '') {
      return allResults;
    }

    const searchLower = query.toLowerCase().trim();
    const terms = searchLower.split(/\s+/).filter(t => t.length > 0);

    return allResults.filter(result => {
      const name = result.name.toLowerCase();
      const desc = result.description?.toLowerCase() || '';
      const cat = result.category?.toLowerCase() || '';
      const catLabel = result.categoryLabel?.toLowerCase() || '';

      // "Intelligent" matching: check if ALL terms appear in ANY of the fields
      return terms.every(term => 
        name.includes(term) || 
        desc.includes(term) || 
        cat.includes(term) || 
        catLabel.includes(term)
      );
    }).sort((a, b) => {
      // Ranking: Exact name matches first, then startsWith
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      const aExact = aName === searchLower;
      const bExact = bName === searchLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aName.startsWith(searchLower);
      const bStarts = bName.startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return aName.localeCompare(bName);
    });
  }, [query, events, poisData]);

  return {
    results: searchResults,
    allEvents: events,
    loading: loadingEvents || loadingPois,
  };
};
