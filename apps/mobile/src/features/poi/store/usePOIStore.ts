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
  getFilteredPOIs: (allPOIs: StandardUIPOI[]) => StandardUIPOI[];
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

  getFilteredPOIs: (allPOIs) => {
    const { selectedEventId, userInsideEventId, activeCategoryFilters } = usePOIStore.getState();
    
    // Effective event ID to show POIs for (Selected or Current physical location)
    const activeEventId = selectedEventId || userInsideEventId;
    
    // 1. Filter by parent event if selected OR user is inside
    let filtered = activeEventId 
      ? allPOIs.filter(poi => String(poi.parentId) === String(activeEventId))
      : allPOIs.filter(poi => !poi.parentId); // Show top-level POIs if no event active

    // 2. Filter by category if active
    if (activeCategoryFilters.length > 0) {
      filtered = filtered.filter(poi => activeCategoryFilters.includes(poi.category));
    }

    return filtered;
  },
}));
