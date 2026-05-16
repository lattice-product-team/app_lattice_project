import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import MapLibreGL from '@maplibre/maplibre-react-native';
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
  FREE = 0, // UserTrackingMode.None
  FOLLOW = 1, // UserTrackingMode.Follow
  FOLLOW_WITH_HEADING = 2, // UserTrackingMode.FollowWithHeading
  FOLLOW_WITH_COURSE = 3, // UserTrackingMode.FollowWithCourse
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
  setLastProcessedTarget: (target: string | null) => void;
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
      lastProcessedTarget: null,

      setUIState: (uiState) => {
        if (isProcessingSetUIState) return;

        const currentState = get().uiState;
        if (currentState === uiState) return;

        isProcessingSetUIState = true;
        try {
          // Update state first. Force FREE camera when returning to exploration to stop any centering/locks.
          const cameraMode =
            uiState === MapUIState.EXPLORING ? MapCameraMode.FREE : get().cameraMode;
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
        set((state) => {
          const { useNavigationStore } = require('../../navigation/store/useNavigationStore');
          const { isNavigating, transportMode } = useNavigationStore.getState();
          let nextMode: MapCameraMode;

          if (isNavigating) {
            // Navigation context: Default to COURSE (Where I go) for driving, HEADING (Where I look) for walking
            // If already in one of those, toggle to the other.
            if (state.cameraMode === MapCameraMode.FOLLOW_WITH_COURSE) {
              nextMode = MapCameraMode.FOLLOW_WITH_HEADING; // Donde apunto
            } else if (state.cameraMode === MapCameraMode.FOLLOW_WITH_HEADING) {
              nextMode = MapCameraMode.FOLLOW_WITH_COURSE; // Donde voy
            } else {
              // Not following yet: Pick the best default for the transport mode
              nextMode = transportMode === 'driving' ? MapCameraMode.FOLLOW_WITH_COURSE : MapCameraMode.FOLLOW_WITH_HEADING;
            }
          } else {
            // Exploring context: simple follow vs free cycle
            if (state.cameraMode === MapCameraMode.FREE) {
              nextMode = MapCameraMode.FOLLOW;
            } else if (state.cameraMode === MapCameraMode.FOLLOW) {
              nextMode = MapCameraMode.FOLLOW_WITH_HEADING;
            } else if (state.cameraMode === MapCameraMode.FOLLOW_WITH_HEADING) {
              nextMode = MapCameraMode.FOLLOW_WITH_COURSE;
            } else {
              nextMode = MapCameraMode.FREE;
            }
          }

          return {
            recenterCount: state.recenterCount + 1,
            cameraMode: nextMode,
          };
        }),

      triggerForceCenter: () =>
        set((state) => ({
          forceCenterCount: state.forceCenterCount + 1,
        })),

      setInitialLoadComplete: (isComplete) => set({ isInitialLoadComplete: isComplete }),

      setLastCameraPosition: (lastCameraPosition) => set({ lastCameraPosition }),

      setDiscoveryLocation: (discoveryLocation) => set({ discoveryLocation }),

      setLastScreenMode: (lastScreenMode) => set({ lastScreenMode }),

      setLastProcessedTarget: (lastProcessedTarget) => set({ lastProcessedTarget }),
    }),
    {
      name: 'map-ui-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist relevant UI state, not volatile counts
      partialize: (state) => ({
        lastScreenMode: state.lastScreenMode,
        lastCameraPosition: state.lastCameraPosition,
        discoveryLocation: state.discoveryLocation,
        lastProcessedTarget: state.lastProcessedTarget,
      }),
    }
  )
);
