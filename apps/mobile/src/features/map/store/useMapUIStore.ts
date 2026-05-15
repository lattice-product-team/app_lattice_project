import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../../services/storage';

export enum MapUIState {
  EXPLORING = 'EXPLORING',
  POI_DETAIL = 'POI_DETAIL',
  NAVIGATING = 'NAVIGATING',
  SAVED_LIST = 'SAVED_LIST',
}

export enum MapCameraMode {
  FREE = 'FREE',
  NAVIGATION = 'NAVIGATION',
}

interface MapUIStore {
  uiState: MapUIState;
  cameraMode: MapCameraMode;
  recenterCount: number;
  forceCenterCount: number;
  isInitialLoadComplete: boolean;
  lastCameraPosition: {
    center: [number, number];
    zoom: number;
    pitch: number;
  } | null;
  discoveryLocation: [number, number] | null;
  lastScreenMode: number; // 0: Explore, 1: Map

  // Actions
  setUIState: (state: MapUIState) => void;
  setCameraMode: (mode: MapCameraMode) => void;
  triggerRecenter: () => void;
  triggerForceCenter: () => void;
  setInitialLoadComplete: (isComplete: boolean) => void;
  setLastCameraPosition: (pos: { center: [number, number]; zoom: number; pitch: number }) => void;
  setDiscoveryLocation: (loc: [number, number] | null) => void;
  setLastScreenMode: (mode: number) => void;
}

/**
 * Specialized store for managing the Map's HUD and sheet visibility states.
 */
export const useMapUIStore = create<MapUIStore>()(
  persist(
    (set) => ({
      uiState: MapUIState.EXPLORING,
      cameraMode: MapCameraMode.FREE,
      recenterCount: 0,
      forceCenterCount: 0,
      isInitialLoadComplete: false,
      lastCameraPosition: null,
      discoveryLocation: null,
      lastScreenMode: 0, // Default to Explore as requested for new sessions if not set

      setUIState: (uiState) => set({ uiState }),

      setCameraMode: (cameraMode) => set({ cameraMode }),

      triggerRecenter: () =>
        set((state) => ({
          recenterCount: state.recenterCount + 1,
          cameraMode: MapCameraMode.FREE,
        })),

      triggerForceCenter: () =>
        set((state) => ({
          forceCenterCount: state.forceCenterCount + 1,
        })),

      setInitialLoadComplete: (isInitialLoadComplete) => set({ isInitialLoadComplete }),

      setLastCameraPosition: (lastCameraPosition) => set({ lastCameraPosition }),

      setDiscoveryLocation: (discoveryLocation) => set({ discoveryLocation }),

      setLastScreenMode: (lastScreenMode) => set({ lastScreenMode }),
    }),
    {
      name: 'map-ui-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist relevant UI state, not volatile counts
      partialize: (state) => ({
        lastScreenMode: state.lastScreenMode,
        lastCameraPosition: state.lastCameraPosition,
        discoveryLocation: state.discoveryLocation,
      }),
    }
  )
);

