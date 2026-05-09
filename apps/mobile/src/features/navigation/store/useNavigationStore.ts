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
    set((state) => ({
      routes,
      metadata,
      isFetching: false,
      currentRoute: routes[state.transportMode],
      routeMetadata: metadata[state.transportMode],
    })),

  setTransportMode: (transportMode) =>
    set((state) => ({
      transportMode,
      currentRoute: state.routes[transportMode],
      routeMetadata: state.metadata[transportMode],
    })),

  setNavigating: (isNavigating) => set({ isNavigating }),
  setPlanning: (isPlanning) => set({ isPlanning }),
  
  startNavigation: () => set({ 
    isPlanning: false, 
    isNavigating: true 
  }),

  setNextInstruction: (nextInstruction) => set({ nextInstruction }),
  setFetching: (isFetching) => set({ isFetching }),

  clearNavigation: () =>
    set({
      currentRoute: null,
      routeMetadata: null,
      routes: { driving: null, walking: null, bicycle: null },
      metadata: { driving: null, walking: null, bicycle: null },
      isNavigating: false,
      nextInstruction: null,
      isFetching: false,
    }),
}));
