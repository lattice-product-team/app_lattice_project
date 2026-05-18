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
  FREE = 0, //UserTrackingMode.None
  FOLLOW = 1, //UserTrackingMode.Follow
  FOLLOW_WITH_HEADING = 2, //UserTrackingMode.FollowWithHeading
  FOLLOW_WITH_COURSE = 3, //UserTrackingMode.FollowWithCourse
}

export type MapCameraTriggerSource =
  | 'map_click'
  | 'list_click'
  | 'exploration'
  | 'recenter'
  | 'initial'
  | null;

interface MapUIStore {
  uiState: MapUIState;
  cameraMode: MapCameraMode;
  recenterCount: number;
  forceCenterCount: number;
  triggerSource: MapCameraTriggerSource;
  isInitialLoadComplete: boolean;
  lastCameraPosition: {
    center: [number, number];
    zoom: number;
    pitch: number;
  } | null;
  discoveryLocation: [number, number] | null;
  isProgrammaticMove: boolean;
  lastScreenMode: number;
  visibleBounds: number[][] | null;


  setUIState: (state: MapUIState) => void;
  setCameraMode: (mode: MapCameraMode) => void;
  setIsProgrammaticMove: (isMove: boolean) => void;
  triggerRecenter: (source?: MapCameraTriggerSource) => void;
  triggerForceCenter: (source?: MapCameraTriggerSource) => void;
  setTriggerSource: (source: MapCameraTriggerSource) => void;
  setInitialLoadComplete: (isComplete: boolean) => void;
  setLastCameraPosition: (pos: { center: [number, number]; zoom: number; pitch: number }) => void;
  setDiscoveryLocation: (loc: [number, number] | null) => void;
  setLastScreenMode: (mode: number) => void;
  setLastProcessedTarget: (target: string | null) => void;
  setVisibleBounds: (bounds: number[][] | null) => void;
}


let isProcessingSetUIState = false;

/***
 * Specialized store for managing the Map's HUD and sheet visibility states.
 */
export const useMapUIStore = create<MapUIStore>()(
  persist(
    (set, get) => ({
      uiState: MapUIState.EXPLORING,
      cameraMode: MapCameraMode.FREE,
      recenterCount: 0,
      forceCenterCount: 0,
      triggerSource: null,
      isInitialLoadComplete: false,
      lastCameraPosition: null,
      discoveryLocation: null,
      isProgrammaticMove: false,
      lastScreenMode: 0,
      lastProcessedTarget: null,
      visibleBounds: null,

      setUIState: (uiState) => {
        const current = get();
        if (current.uiState === uiState) return;

        //Force FREE camera when returning to exploration to stop any centering/locks
        const nextCameraMode =
          uiState === MapUIState.EXPLORING ? MapCameraMode.FREE : current.cameraMode;

        set({ uiState, cameraMode: nextCameraMode });

        //Atomic cleanup using direct calls instead of nested logic
        try {
          const { usePOIStore } = require('../../poi/store/usePOIStore');
          const { useNavigationStore } = require('../../navigation/store/useNavigationStore');

          if (uiState === MapUIState.EXPLORING) {
            usePOIStore.getState().deselect(false);
            useNavigationStore.getState().clearNavigation();
          }
        } catch (e) {
          console.warn('[MapUIStore] Async cleanup failed:', e);
        }
      },

      setCameraMode: (cameraMode) => set({ cameraMode }),

      setIsProgrammaticMove: (isProgrammaticMove) => set({ isProgrammaticMove }),

      triggerRecenter: (source = 'recenter') =>
        set((state) => ({
          recenterCount: state.recenterCount + 1,
          triggerSource: source,
        })),

      triggerForceCenter: (source = null) =>
        set((state) => ({
          forceCenterCount: state.forceCenterCount + 1,
          triggerSource: source,
        })),

      setTriggerSource: (triggerSource) => set({ triggerSource }),

      setInitialLoadComplete: (isComplete) => set({ isInitialLoadComplete: isComplete }),

      setLastCameraPosition: (lastCameraPosition) => set({ lastCameraPosition }),

      setDiscoveryLocation: (discoveryLocation) => set({ discoveryLocation }),

      setLastScreenMode: (lastScreenMode) => set({ lastScreenMode }),

      setLastProcessedTarget: (lastProcessedTarget) => set({ lastProcessedTarget }),
      setVisibleBounds: (visibleBounds) => set({ visibleBounds }),
    }),
    {
      name: 'map-ui-storage',
      storage: createJSONStorage(() => mmkvStorage),
      //Only persist relevant UI state, not volatile counts
      partialize: (state) => ({
        lastScreenMode: state.lastScreenMode,
        lastCameraPosition: state.lastCameraPosition,
        discoveryLocation: state.discoveryLocation,
        lastProcessedTarget: state.lastProcessedTarget,
      }),
    }
  )
);
