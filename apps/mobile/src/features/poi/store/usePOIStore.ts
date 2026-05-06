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
    const { selectedEventId, userInsideEventId } = usePOIStore.getState();
    
    const activeEventId = selectedEventId || userInsideEventId;
    
    // 1. If an event is selected or we are inside one, show its children immediately
    // This allows the SymbolLayer to start fading them in as the camera moves.
    if (activeEventId) {
      return allPOIs.filter(poi => 
        poi.parentId !== undefined && 
        poi.parentId !== null && 
        String(poi.parentId) === String(activeEventId)
      );
    }

    // 2. Global zoom-based logic (When NO event is selected)
    // We lower the threshold to 14.5 to allow for a very early and subtle fade-in
    if (zoom < 14.5) return [];

    // Filter out events from the POI collection (they are handled by MarkerViews)
    return allPOIs.filter(p => p.category !== 'event');
  },
}));
