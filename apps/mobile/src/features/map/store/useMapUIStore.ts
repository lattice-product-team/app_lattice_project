import { create } from 'zustand';

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
  isProgrammaticMove: boolean;

  // Actions
  setUIState: (state: MapUIState) => void;
  setCameraMode: (mode: MapCameraMode) => void;
  setIsProgrammaticMove: (isMove: boolean) => void;
  triggerRecenter: () => void;
  triggerForceCenter: () => void;
  setInitialLoadComplete: (isComplete: boolean) => void;
  setLastCameraPosition: (pos: { center: [number, number]; zoom: number; pitch: number }) => void;
  setDiscoveryLocation: (loc: [number, number] | null) => void;
}

/**
 * Specialized store for managing the Map's HUD and sheet visibility states.
 */
export const useMapUIStore = create<MapUIStore>((set) => ({
  uiState: MapUIState.EXPLORING,
  cameraMode: MapCameraMode.FREE,
  recenterCount: 0,
  forceCenterCount: 0,
  isInitialLoadComplete: false,
  lastCameraPosition: null,
  discoveryLocation: null,
  isProgrammaticMove: false,

  setUIState: (uiState) => set({ uiState }),

  setCameraMode: (cameraMode) => set({ cameraMode }),

  setIsProgrammaticMove: (isProgrammaticMove) => set({ isProgrammaticMove }),

  triggerRecenter: () =>
    set((state) => ({
      recenterCount: state.recenterCount + 1,
      cameraMode: state.cameraMode === MapCameraMode.NAVIGATION ? MapCameraMode.NAVIGATION : MapCameraMode.FREE,
    })),

  triggerForceCenter: () =>
    set((state) => ({
      forceCenterCount: state.forceCenterCount + 1,
    })),

  setInitialLoadComplete: (isInitialLoadComplete) => set({ isInitialLoadComplete }),

  setLastCameraPosition: (lastCameraPosition) => set({ lastCameraPosition }),

  setDiscoveryLocation: (discoveryLocation) => set({ discoveryLocation }),
}));
