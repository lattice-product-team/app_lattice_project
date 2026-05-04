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
    }),

  setRemote: (isRemote) => set({ isRemote }),

  setSelectedEvent: (selectedEventId) => set({ 
    selectedEventId,
    activeCategoryFilters: [] // Clear filters when switching events
  }),

  setUserInsideEvent: (userInsideEventId) => set({ userInsideEventId }),

  toggleCategoryFilter: (category) => set((state) => {
    const isAlreadyFiltered = state.activeCategoryFilters.includes(category);
    const nextFilters = isAlreadyFiltered
      ? state.activeCategoryFilters.filter((c) => c !== category)
      : [...state.activeCategoryFilters, category];
    
    return { activeCategoryFilters: nextFilters };
  }),

  clearFilters: () => set({ activeCategoryFilters: [] }),
  getFilteredPOIs: (allPOIs, zoom = 0) => {
    const { selectedEventId, userInsideEventId, activeCategoryFilters } = usePOIStore.getState();
    
    const activeEventId = selectedEventId || userInsideEventId;
    
    // 1. Selection-based logic (Highest Priority)
    // If an event is selected, we show its children NO MATTER the zoom.
    // This solves the "they only appear if I zoom in" issue.
    if (activeEventId) {
      let children = allPOIs.filter(poi => 
        poi.parentId !== undefined && 
        poi.parentId !== null && 
        String(poi.parentId) === String(activeEventId)
      );

      // If we are zoomed in very close (>17), we also show other POIs for context
      if (zoom >= 17.0) {
        const others = allPOIs.filter(poi => String(poi.parentId) !== String(activeEventId));
        children = [...children, ...others];
      }

      // Filter by category if active
      if (activeCategoryFilters.length > 0) {
        children = children.filter(poi => activeCategoryFilters.includes(poi.category));
      }

      return children;
    }

    // 2. Global zoom-based logic (When NO event is selected)
    // We use a slightly more lenient threshold (15.5 instead of 16.0) to allow for fade-in animations
    if (zoom < 15.5) return [];

    let filtered = allPOIs;
    
    // Filter by category if active
    if (activeCategoryFilters.length > 0) {
      filtered = filtered.filter(poi => activeCategoryFilters.includes(poi.category));
    }

    return filtered;
  },
}));
