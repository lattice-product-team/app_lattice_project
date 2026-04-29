import { create } from 'zustand';
import { RouteGeoJSON } from '../../../types';

interface RouteMetadata {
  distance: number;
  duration: number;
  destinationName: string;
}

interface NavigationState {
  currentRoute: RouteGeoJSON | null;
  routeMetadata: RouteMetadata | null;
  isNavigating: boolean;
  
  // Actions
  setRoute: (route: RouteGeoJSON | null, metadata?: RouteMetadata | null) => void;
  setNavigating: (navigating: boolean) => void;
  clearNavigation: () => void;
}

/**
 * Specialized store for handling active navigation and route calculation states.
 */
export const useNavigationStore = create<NavigationState>((set) => ({
  currentRoute: null,
  routeMetadata: null,
  isNavigating: false,

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

  clearNavigation: () =>
    set({
      currentRoute: null,
      routeMetadata: null,
      isNavigating: false,
    }),
}));
