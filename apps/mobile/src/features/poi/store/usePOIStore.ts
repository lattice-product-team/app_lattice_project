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
    
    // Effective event ID to show POIs for (Selected or Current physical location)
    const activeEventId = selectedEventId || userInsideEventId;
    
    // 1. Zoom-based logic
    // If we are zoomed out and no event is selected, show nothing (Events are handled by separate loop)
    if (!activeEventId && zoom < 16.0) return [];

    // 2. Selection-based logic
    // If an event is active, we PRIORITIZE its children.
    // If we are zoomed in very close (>17), we show everything to allow context.
    let filtered = allPOIs;
    if (activeEventId && zoom < 17.0) {
      filtered = allPOIs.filter(poi => 
        poi.parentId !== undefined && 
        poi.parentId !== null && 
        String(poi.parentId) === String(activeEventId)
      );
    }

    // 3. Filter by category if active
    if (activeCategoryFilters.length > 0) {
      filtered = filtered.filter(poi => activeCategoryFilters.includes(poi.category));
    }

    return filtered;
  },
}));
