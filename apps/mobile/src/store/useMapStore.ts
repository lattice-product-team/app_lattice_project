import { create } from 'zustand';
import { RouteGeoJSON } from '../types';
import { UIPOI } from '../types/models/poi';

export enum MapUIState {
  EXPLORING = 'EXPLORING',
  POI_DETAIL = 'POI_DETAIL',
  NAVIGATING = 'NAVIGATING',
}

interface RouteMetadata {
  distance: number;
  duration: number;
  destinationName: string;
}

interface MapState {
  uiState: MapUIState;
  selectedPoiId: string | null;
  selectedPoi: UIPOI | null;
  selectedCoords: number[] | null;
  recenterCount: number;
  currentRoute: RouteGeoJSON | null;
  routeMetadata: RouteMetadata | null;
  isNavigating: boolean;

  // Actions
  selectPoi: (poi: any) => void;
  setRoute: (route: RouteGeoJSON | null, metadata?: RouteMetadata | null) => void;
  setNavigating: (navigating: boolean) => void;
  deselect: () => void;
  triggerRecenter: () => void;
  setUIState: (state: MapUIState) => void;
}

export const useMapStore = create<MapState>((set) => ({
  uiState: MapUIState.EXPLORING,
  selectedPoiId: null,
  selectedPoi: null,
  selectedCoords: null,
  recenterCount: 0,
  currentRoute: null,
  routeMetadata: null,
  isNavigating: false,

  selectPoi: (poi: any) => {
    if (!poi) return;

    const isObj = typeof poi === 'object' && poi !== null;
    const id = isObj ? String(poi.id || '') : String(poi);
    const coords = isObj ? poi.geometry?.coordinates || null : null;
    const fullPoi = isObj && (poi.name || poi.label) ? (poi as UIPOI) : null;

    set((state) => {
      // Avoid redundant state updates if same POI is selected
      if (state.selectedPoiId === id) return state;
      
      return {
        uiState: MapUIState.POI_DETAIL,
        selectedPoiId: id,
        selectedPoi: fullPoi,
        selectedCoords: coords,
        isNavigating: false,
      };
    });
  },

  setRoute: (route, metadata = null) =>
    set({
      currentRoute: route,
      routeMetadata:
        metadata ||
        (route?.properties
          ? {
              distance: route.properties.distance,
              duration: route.properties.durationEstimate,
              destinationName: '',
            }
          : null),
    }),

  setNavigating: (nav) =>
    set((state) => ({
      isNavigating: nav,
      uiState: nav
        ? MapUIState.NAVIGATING
        : state.selectedPoiId
          ? MapUIState.POI_DETAIL
          : MapUIState.EXPLORING,
    })),

  deselect: () =>
    set({
      uiState: MapUIState.EXPLORING,
      selectedPoiId: null,
      selectedPoi: null,
      selectedCoords: null,
      currentRoute: null,
      routeMetadata: null,
      isNavigating: false,
    }),

  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),

  setUIState: (uiState) => set({ uiState }),
}));
