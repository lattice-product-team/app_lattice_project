import { create } from 'zustand';
import { RouteGeoJSON } from '../../../types';

export type TransportMode = 'driving' | 'walking' | 'bicycle';

interface RouteMetadata {
  distance: number;
  duration: number;
  destinationName: string;
}

interface Instruction {
  text: string;
  distance: number;
  maneuverType: string;
}

interface NavigationState {
  currentRoute: RouteGeoJSON | null;
  routeMetadata: RouteMetadata | null;
  isNavigating: boolean;
  isPlanning: boolean;
  transportMode: TransportMode;
  nextInstruction: Instruction | null;
  isFetching: boolean;

  routes: {
    driving: RouteGeoJSON | null;
    walking: RouteGeoJSON | null;
    bicycle: RouteGeoJSON | null;
  };

  metadata: {
    driving: RouteMetadata | null;
    walking: RouteMetadata | null;
    bicycle: RouteMetadata | null;
  };

  // Actions
  setRoutes: (
    routes: { driving: RouteGeoJSON | null; walking: RouteGeoJSON | null; bicycle: RouteGeoJSON | null },
    metadata: { driving: RouteMetadata | null; walking: RouteMetadata | null; bicycle: RouteMetadata | null }
  ) => void;
  setNavigating: (navigating: boolean) => void;
  setPlanning: (isPlanning: boolean) => void;
  startNavigation: () => void;
  setTransportMode: (mode: TransportMode) => void;
  setNextInstruction: (instruction: Instruction | null) => void;
  setFetching: (isFetching: boolean) => void;
  clearNavigation: () => void;
}

/**
 * Specialized store for handling active navigation and route calculation states.
 */
export const useNavigationStore = create<NavigationState>((set) => ({
  currentRoute: null,
  routeMetadata: null,
  isNavigating: false,
  isPlanning: false,
  transportMode: 'walking',
  nextInstruction: null,
  isFetching: false,
  
  routes: {
    driving: null,
    walking: null,
    bicycle: null,
  },
  
  metadata: {
    driving: null,
    walking: null,
    bicycle: null,
  },

  setRoutes: (routes, metadata) =>
    set((state) => {
      // If current transport mode is not available in the new routes, 
      // try to find a fallback (driving is usually the most reliable)
      let newMode = state.transportMode;
      if (!routes[newMode]) {
        if (routes.driving) newMode = 'driving';
        else if (routes.walking) newMode = 'walking';
        else if (routes.bicycle) newMode = 'bicycle';
      }

      return {
        routes,
        metadata,
        isFetching: false,
        transportMode: newMode,
        currentRoute: routes[newMode],
        routeMetadata: metadata[newMode],
      };
    }),

  setTransportMode: (transportMode) =>
    set((state) => ({
      transportMode,
      currentRoute: state.routes[transportMode],
      routeMetadata: state.metadata[transportMode],
    })),

  setNavigating: (isNavigating) => {
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      if (isNavigating) useMapUIStore.getState().setUIState(MapUIState.NAVIGATING);
    } catch (e) {}
    set({ isNavigating });
  },
  setPlanning: (isPlanning) => {
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      if (isPlanning) useMapUIStore.getState().setUIState(MapUIState.PLANNING);
    } catch (e) {}
    set({ isPlanning });
  },
  
  startNavigation: () => {
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      useMapUIStore.getState().setUIState(MapUIState.NAVIGATING);
    } catch (e) {}
    set({ 
      isPlanning: false, 
      isNavigating: true 
    });
  },

  setNextInstruction: (nextInstruction) => set({ nextInstruction }),
  setFetching: (isFetching) => set({ isFetching }),

  clearNavigation: () => {
    try {
      const { useMapUIStore, MapUIState } = require('../../map/store/useMapUIStore');
      useMapUIStore.getState().setUIState(MapUIState.EXPLORING);
    } catch (e) {}
    set({
      currentRoute: null,
      routeMetadata: null,
      routes: { driving: null, walking: null, bicycle: null },
      metadata: { driving: null, walking: null, bicycle: null },
      isNavigating: false,
      isPlanning: false,
      nextInstruction: null,
      isFetching: false,
    });
  },
}));
