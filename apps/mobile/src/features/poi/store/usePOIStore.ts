import { create } from 'zustand';
import { StandardUIPOI } from '../../../types/models/poi';

interface POIState {
  selectedPoiId: string | null;
  selectedPoi: StandardUIPOI | null;
  selectedCoords: number[] | null;
  isRemote: boolean;

  selectedEventId: string | number | null;
  userInsideEventId: string | number | null;
  activeCategoryFilters: string[];

  selectPoi: (poi: StandardUIPOI | null, shouldSyncUI?: boolean) => void;
  deselect: (shouldSyncUI?: boolean) => void;
  setRemote: (isRemote: boolean) => void;

  setSelectedEvent: (eventId: string | number | null, shouldSyncUI?: boolean) => void;
  setUserInsideEvent: (eventId: string | number | null) => void;
  toggleCategoryFilter: (category: string) => void;
  clearFilters: () => void;

  getFilteredPOIs: (allPOIs: StandardUIPOI[], zoom?: number) => StandardUIPOI[];
}

let isProcessingPOIAction = false;

/***
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

  selectPoi: (poi, shouldSyncUI = true) => {
    if (isProcessingPOIAction) return;

    //Update local state first
    if (!poi) {
      set({ selectedPoiId: null, selectedPoi: null, selectedCoords: null });
    } else {
      set({
        selectedPoiId: poi.id,
        selectedPoi: poi,
        selectedCoords: poi.coordinates,
      });
    }

    if (!shouldSyncUI) return;

    isProcessingPOIAction = true;
    //Then trigger cross-store effects
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      if (poi) {
        useMapUIStore.getState().setUIState(MapUIState.POI_DETAIL);
      } else if (useMapUIStore.getState().uiState === MapUIState.POI_DETAIL) {
        useMapUIStore.getState().setUIState(MapUIState.EXPLORING);
      }
    } catch (e) {
    } finally {
      isProcessingPOIAction = false;
    }
  },

  clearSelection: () => {
    set({
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
    });
  },

  deselect: (shouldSyncUI = true) => {
    if (isProcessingPOIAction) return;

    //Update local state first
    set({
      selectedPoi: null,
      selectedPoiId: null,
      selectedCoords: null,
      activeCategoryFilters: [],
    });

    if (!shouldSyncUI) return;

    isProcessingPOIAction = true;
    //Then trigger cross-store effects
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      const currentState = useMapUIStore.getState().uiState;

      //Force return to EXPLORING if we are deselecting
      if (currentState !== MapUIState.EXPLORING) {
        useMapUIStore.getState().setUIState(MapUIState.EXPLORING);
      }
    } catch (e) {
    } finally {
      isProcessingPOIAction = false;
    }
  },

  setRemote: (isRemote) => set({ isRemote }),

  setSelectedEvent: (selectedEventId, shouldSyncUI = true) => {
    if (isProcessingPOIAction) return;

    //Update local state first
    set({
      selectedEventId,
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
      activeCategoryFilters: [], //Clear filters when switching events
    });

    if (!shouldSyncUI) return;

    isProcessingPOIAction = true;
    //Then trigger cross-store effects
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      if (selectedEventId) {
        useMapUIStore.getState().setUIState(MapUIState.POI_DETAIL);
      }
    } catch (e) {
    } finally {
      isProcessingPOIAction = false;
    }
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
    const { selectedEventId, userInsideEventId, activeCategoryFilters, selectedPoiId } =
      usePOIStore.getState();

    //0. Navigation Mode Override
    try {
      //Access navigation state directly to avoid circular dependency
      const isNavigating =
        require('../../navigation/store/useNavigationStore').useNavigationStore.getState()
          .isNavigating;
      if (isNavigating) {
        //Only show the destination POI if one is selected
        return allPOIs.filter((p) => String(p.id) === String(selectedPoiId));
      }
    } catch (e) {
      //Fallback silently if store is not accessible
    }

    //1. Zoom-based visibility threshold (but always keep selected)
    if (zoom < 12.0 && !selectedPoiId) return [];

    //Filter logic
    const filtered = allPOIs.filter((p) => {
      //ALWAYS keep the selected POI
      if (selectedPoiId && String(p.id) === String(selectedPoiId)) return true;

      //Zoom threshold for others
      if (zoom < 12.0) return false;

      //Category filters
      if (activeCategoryFilters.length > 0) {
        const categoryMap: Record<string, string[]> = {
          services: ['services', 'info', 'toilet', 'wc', 'utility'],
          gastro: ['food', 'restaurant', 'gastro', 'bar', 'cafe', 'drinks'],
          parking: ['parking', 'garage', 'transport'],
          transport: ['transport', 'bus', 'train', 'shuttle'],
          emergency: ['emergency', 'medical', 'security', 'police', 'hospital'],
        };

        return activeCategoryFilters.some((filterId: string) => {
          const matchedCategories = categoryMap[filterId] || [filterId];
          return matchedCategories.includes(p.category.toLowerCase());
        });
      }

      //Default: filter events
      return p.category !== 'event';
    });

    return filtered;
  },
}));
