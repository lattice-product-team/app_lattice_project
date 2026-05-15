import { create } from 'zustand';
import { LatticeEvent } from '../../../types';

export enum ARFilterMode {
  CLOSEST_EVENT = 'CLOSEST_EVENT',
  SELECTED_EVENT = 'SELECTED_EVENT',
  SPECIFIC_PIN = 'SPECIFIC_PIN',
}

interface ARState {
  isVisible: boolean;
  filterMode: ARFilterMode;
  targetId: string | number | null;
  
  // Contextual Awareness
  currentEventContext: LatticeEvent | null;
  isWithinBoundary: boolean;

  // Actions
  openAR: (mode: ARFilterMode, id?: string | number) => void;
  closeAR: () => void;
  setContext: (event: LatticeEvent | null, withinBoundary: boolean) => void;
}

/**
 * Store to manage the global state of the Augmented Reality (AR) feature.
 * Controls visibility, filtering modes, and target subjects.
 */
export const useARStore = create<ARState>((set) => ({
  isVisible: false,
  filterMode: ARFilterMode.CLOSEST_EVENT,
  targetId: null,
  currentEventContext: null,
  isWithinBoundary: false,

  openAR: (mode, id = null) => {
    try {
      const { useMapUIStore, MapUIState } = require('./useMapUIStore');
      useMapUIStore.getState().setUIState(MapUIState.AR_EXPLORE);
    } catch (e) {}
    set({ 
      isVisible: true, 
      filterMode: mode, 
      targetId: id 
    });
  },

  closeAR: () => {
    try {
      const { useMapUIStore, MapUIState } = require('./useMapUIStore');
      if (useMapUIStore.getState().uiState === MapUIState.AR_EXPLORE) {
        useMapUIStore.getState().setUIState(MapUIState.EXPLORING);
      }
    } catch (e) {}
    set({ 
      isVisible: false, 
      targetId: null,
      currentEventContext: null,
      isWithinBoundary: false,
    });
  },

  setContext: (event, withinBoundary) =>
    set({
      currentEventContext: event,
      isWithinBoundary: withinBoundary,
    }),
}));
