import { create } from 'zustand';
import { StandardUIPOI } from '../../../types/models/poi';

interface POIState {
  selectedPoiId: string | null;
  selectedPoi: StandardUIPOI | null;
  selectedCoords: number[] | null;
  isRemote: boolean;

  // Hierarchical state
  selectedEventId: string | number | null;
  userInsideEventId: string | number | null;
  activeCategoryFilters: string[];

  // Actions
  selectPoi: (poi: StandardUIPOI | null) => void;
  deselect: () => void;
  setRemote: (isRemote: boolean) => void;

  // Hierarchy Actions
  setSelectedEvent: (eventId: string | number | null) => void;
  setUserInsideEvent: (eventId: string | number | null) => void;
  toggleCategoryFilter: (category: string) => void;
  clearFilters: () => void;

  // Helpers
  getFilteredPOIs: (allPOIs: StandardUIPOI[], zoom?: number) => StandardUIPOI[];
}

/**
 * Specialized store for managing POI selection and interaction states.
 */
export const usePOIStore = create<POIState>((set) => ({
  selectedPoiId: null,
  selectedPoi: null,
  selectedCoords: null,
  isRemote: false,
  selectedEventId: null,
  userInsideEventId: null,
  activeCategoryFilters: [],

  selectPoi: (poi) => {
    if (!poi) {
      set({ selectedPoiId: null, selectedPoi: null, selectedCoords: null });
      return;
    }

    set({
      selectedPoiId: poi.id,
      selectedPoi: poi,
      selectedCoords: poi.coordinates,
    });
  },

  deselect: () =>
    set({
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
      selectedEventId: null,
    }),

  setRemote: (isRemote) => set({ isRemote }),

  setSelectedEvent: (selectedEventId) =>
    set({
      selectedEventId,
      activeCategoryFilters: [], // Clear filters when switching events
    }),

  setUserInsideEvent: (userInsideEventId) => set({ userInsideEventId }),

  toggleCategoryFilter: (category) =>
    set((state) => {
      const isAlreadyFiltered = state.activeCategoryFilters.includes(category);
      const nextFilters = isAlreadyFiltered
        ? state.activeCategoryFilters.filter((c) => c !== category)
        : [...state.activeCategoryFilters, category];

      return { activeCategoryFilters: nextFilters };
    }),

  clearFilters: () => set({ activeCategoryFilters: [] }),
  getFilteredPOIs: (allPOIs, zoom = 0) => {
    const { selectedEventId, userInsideEventId, activeCategoryFilters } = usePOIStore.getState();

    // 1. Basic zoom threshold
    if (zoom < 13.0) return [];

    let filtered = allPOIs.filter((p) => p.category !== 'event');

    // 2. Apply category filters if active
    if (activeCategoryFilters.length > 0) {
      // Map dashboard IDs to actual POI categories
      const categoryMapping: Record<string, string[]> = {
        gastro: ['food', 'restaurant', 'coffee', 'gastro'],
        sport: ['sport', 'stadium', 'grandstand', 'sports'],
        music: ['music', 'concert', 'stage'],
        culture: ['culture', 'museum', 'art', 'palette'],
        night: ['night', 'bar', 'club', 'ocio'],
      };

      filtered = filtered.filter((poi) => {
        return activeCategoryFilters.some((filterId) => {
          const mappedCategories = categoryMapping[filterId] || [filterId];
          return mappedCategories.includes(poi.category);
        });
      });
    }

    return filtered;
  },
}));
