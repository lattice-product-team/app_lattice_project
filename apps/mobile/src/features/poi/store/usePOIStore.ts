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
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      if (poi) {
        useMapUIStore.getState().setUIState(MapUIState.POI_DETAIL);
      } else if (useMapUIStore.getState().uiState === MapUIState.POI_DETAIL) {
        useMapUIStore.getState().setUIState(MapUIState.EXPLORING);
      }
    } catch (e) {}

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

  clearSelection: () => {
    set({ 
      selectedPoiId: null, 
      selectedPoi: null, 
      selectedCoords: null 
    });
  },

  deselect: () => {
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      const currentState = useMapUIStore.getState().uiState;
      
      // ONLY trigger state change if we are coming from a detail mode
      if (currentState === MapUIState.POI_DETAIL || currentState === MapUIState.PLANNING) {
        useMapUIStore.getState().setUIState(MapUIState.EXPLORING);
      }
    } catch (e) {}
    
    set({ 
      selectedPoi: null, 
      selectedPoiId: null, 
      selectedCoords: null,
      activeCategoryFilters: [] 
    });
  },

  setRemote: (isRemote) => set({ isRemote }),

  setSelectedEvent: (selectedEventId) => {
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      if (selectedEventId) {
        useMapUIStore.getState().setUIState(MapUIState.POI_DETAIL);
      }
    } catch (e) {}
    set({
      selectedEventId,
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
      activeCategoryFilters: [], // Clear filters when switching events
    });
  },

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
    const { selectedEventId, userInsideEventId, activeCategoryFilters, selectedPoiId } = usePOIStore.getState();

    // 0. Navigation Mode Override
    try {
      // Access navigation state directly to avoid circular dependency
      const isNavigating = require('../../navigation/store/useNavigationStore').useNavigationStore.getState().isNavigating;
      if (isNavigating) {
        // Only show the destination POI if one is selected
        return allPOIs.filter(p => p.id === selectedPoiId);
      }
    } catch (e) {
      // Fallback silently if store is not accessible
    }

    // 1. Zoom-based visibility threshold
    if (zoom < 12.0) return [];

    // 2. Category Filtering Logic
    if (activeCategoryFilters.length > 0) {
      // Mapping from dashboard IDs to POI/Event categories
      const categoryMap: Record<string, string[]> = {
        services: ['services', 'info', 'toilet', 'wc', 'utility'],
        gastro: ['food', 'restaurant', 'gastro', 'bar', 'cafe', 'drinks'],
        parking: ['parking', 'garage', 'transport'],
        transport: ['transport', 'bus', 'train', 'shuttle'],
        emergency: ['emergency', 'medical', 'security', 'police', 'hospital'],
      };

      return allPOIs.filter((p) => {
        // Always show the explicitly selected POI
        if (p.id === usePOIStore.getState().selectedPoiId) return true;

        // Check if the POI's category matches any of the active filters
        return activeCategoryFilters.some((filterId: string) => {
          const matchedCategories = categoryMap[filterId] || [filterId];
          return matchedCategories.includes(p.category.toLowerCase());
        });
      });
    }

    // 3. Default: Filter out events from the POI collection (they are handled by MarkerViews)
    return allPOIs.filter((p) => p.category !== 'event');
  },
}));
