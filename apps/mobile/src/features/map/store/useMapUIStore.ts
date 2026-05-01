import { create } from 'zustand';

export enum MapUIState {
  EXPLORING = 'EXPLORING',
  POI_DETAIL = 'POI_DETAIL',
  NAVIGATING = 'NAVIGATING',
  SAVED_LIST = 'SAVED_LIST',
}

interface MapUIStore {
  uiState: MapUIState;
  recenterCount: number;
  isFollowingUser: boolean;
  lastCameraPosition: {
    center: [number, number];
    zoom: number;
    pitch: number;
  } | null;

  // Actions
  setUIState: (state: MapUIState) => void;
  triggerRecenter: () => void;
  setIsFollowingUser: (isFollowing: boolean) => void;
  setLastCameraPosition: (pos: { center: [number, number]; zoom: number; pitch: number }) => void;
}

/**
 * Specialized store for managing the Map's HUD and sheet visibility states.
 */
export const useMapUIStore = create<MapUIStore>((set) => ({
  uiState: MapUIState.EXPLORING,
  recenterCount: 0,
  isFollowingUser: true, // Por defecto seguimos al usuario al entrar
  lastCameraPosition: null,

  setUIState: (uiState) => set({ uiState }),
  
  triggerRecenter: () => set((state) => ({ 
    recenterCount: state.recenterCount + 1,
    isFollowingUser: true 
  })),

  setIsFollowingUser: (isFollowingUser) => set({ isFollowingUser }),

  setLastCameraPosition: (lastCameraPosition) => set({ lastCameraPosition }),
}));
