import { create } from 'zustand';
import { RouteGeoJSON } from '../../../types';

export type TransportMode = 'driving' | 'walking' | 'cycling';

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

  // Actions
  setRoute: (route: RouteGeoJSON | null, metadata?: RouteMetadata | null) => void;
  setNavigating: (navigating: boolean) => void;
  setPlanning: (isPlanning: boolean) => void;
  setTransportMode: (mode: TransportMode) => void;
  setNextInstruction: (instruction: Instruction | null) => void;
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

  setNavigating: (isNavigating) => set({ isNavigating }),

  setPlanning: (isPlanning) => set({ isPlanning }),

  setTransportMode: (transportMode) => set({ transportMode }),

  setNextInstruction: (nextInstruction) => set({ nextInstruction }),

  clearNavigation: () =>
    set({
      currentRoute: null,
      routeMetadata: null,
      isNavigating: false,
      nextInstruction: null,
    }),
}));
