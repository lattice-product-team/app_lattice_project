import { create } from 'zustand';

export enum MapUIState {
  EXPLORING = 'EXPLORING',
  POI_DETAIL = 'POI_DETAIL',
  NAVIGATING = 'NAVIGATING',
}

interface MapUIStore {
  uiState: MapUIState;
  recenterCount: number;

  // Actions
  setUIState: (state: MapUIState) => void;
  triggerRecenter: () => void;
}

/**
 * Specialized store for managing the Map's HUD and sheet visibility states.
 */
export const useMapUIStore = create<MapUIStore>((set) => ({
  uiState: MapUIState.EXPLORING,
  recenterCount: 0,

  setUIState: (uiState) => set({ uiState }),
  
  triggerRecenter: () => set((state) => ({ recenterCount: state.recenterCount + 1 })),
}));
