import { create } from 'zustand';
import { RouteGeoJSON } from '../../../types';

export type TransportMode = 'driving' | 'walking';

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

  // Actions
  setRoute: (route: RouteGeoJSON | null, metadata?: RouteMetadata | null) => void;
  setNavigating: (navigating: boolean) => void;
  setPlanning: (isPlanning: boolean) => void;
  setTransportMode: (mode: TransportMode) => void;
  setNextInstruction: (instruction: Instruction | null) => void;
  setFetching: (isFetching: boolean) => void;
  clearNavigation: () => void;
}

/**
 * Specialized store for handling active navigation and route calculation states.
 * Updated to support turn-by-turn navigation data from Valhalla.
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
  },
  
  metadata: {
    driving: null,
    walking: null,
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
  setNextInstruction: (nextInstruction) => set({ nextInstruction }),
  setFetching: (isFetching) => set({ isFetching }),

  clearNavigation: () =>
    set({
      currentRoute: null,
      routeMetadata: null,
      routes: { driving: null, walking: null },
      metadata: { driving: null, walking: null },
      isNavigating: false,
      nextInstruction: null,
      isFetching: false,
    }),
}));
