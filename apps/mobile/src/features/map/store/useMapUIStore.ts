import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../../services/storage';

export enum MapUIState {
  EXPLORING = 'EXPLORING',
  POI_DETAIL = 'POI_DETAIL',
  PLANNING = 'PLANNING',
  NAVIGATING = 'NAVIGATING',
  SAVED_LIST = 'SAVED_LIST',
  AR_EXPLORE = 'AR_EXPLORE',
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
  isProgrammaticMove: boolean;
  lastScreenMode: number;

  // Actions
  setUIState: (state: MapUIState) => void;
  setCameraMode: (mode: MapCameraMode) => void;
  setIsProgrammaticMove: (isMove: boolean) => void;
  triggerRecenter: () => void;
  triggerForceCenter: () => void;
  setInitialLoadComplete: (isComplete: boolean) => void;
  setLastCameraPosition: (pos: { center: [number, number]; zoom: number; pitch: number }) => void;
  setDiscoveryLocation: (loc: [number, number] | null) => void;
  setLastScreenMode: (mode: number) => void;
}

// Recursion guard for cross-store synchronization
let isProcessingSetUIState = false;

/**
 * Specialized store for managing the Map's HUD and sheet visibility states.
 */
export const useMapUIStore = create<MapUIStore>()(
  persist(
    (set, get) => ({
      uiState: MapUIState.EXPLORING,
      cameraMode: MapCameraMode.FREE,
      recenterCount: 0,
      forceCenterCount: 0,
      isInitialLoadComplete: false,
      lastCameraPosition: null,
      discoveryLocation: null,
      isProgrammaticMove: false,
      lastScreenMode: 0,

      setUIState: (uiState) => {
        if (isProcessingSetUIState) return;
        
        const currentState = get().uiState;
        if (currentState === uiState) return;

        isProcessingSetUIState = true;
        try {
          // Update state first. Force FREE camera when returning to exploration to stop any centering/locks.
          const cameraMode = uiState === MapUIState.EXPLORING ? MapCameraMode.FREE : get().cameraMode;
          set({ uiState, cameraMode });

          // Cross-store cleanup to ensure only one mode is "active" across the app
          const { usePOIStore } = require('../../poi/store/usePOIStore');
          const { useNavigationStore } = require('../../navigation/store/useNavigationStore');

          if (uiState === MapUIState.EXPLORING) {
            usePOIStore.getState().deselect(false);
            useNavigationStore.getState().clearNavigation();
          } else if (uiState === MapUIState.NAVIGATING) {
            usePOIStore.getState().deselect(false);
          } else if (uiState === MapUIState.POI_DETAIL) {
            useNavigationStore.getState().clearNavigation();
          }
        } catch (e) {
          console.warn('[MapUIStore] Cross-store cleanup failed:', e);
        } finally {
          isProcessingSetUIState = false;
        }
      },

      setCameraMode: (cameraMode) => set({ cameraMode }),

      setIsProgrammaticMove: (isProgrammaticMove) => set({ isProgrammaticMove }),

      triggerRecenter: () =>
        set((state) => ({
          recenterCount: state.recenterCount + 1,
          cameraMode:
            state.cameraMode === MapCameraMode.NAVIGATION
              ? MapCameraMode.NAVIGATION
              : MapCameraMode.FREE,
        })),

      triggerForceCenter: () =>
        set((state) => ({
          forceCenterCount: state.forceCenterCount + 1,
        })),

      setInitialLoadComplete: (isComplete) => set({ isInitialLoadComplete: isComplete }),

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
