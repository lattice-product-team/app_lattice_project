import { create } from 'zustand';

export enum ARFilterMode {
  CLOSEST_EVENT = 'CLOSEST_EVENT',
  SELECTED_EVENT = 'SELECTED_EVENT',
  SPECIFIC_PIN = 'SPECIFIC_PIN',
}

interface ARState {
  isVisible: boolean;
  filterMode: ARFilterMode;
  targetId: string | number | null;
  
  // Actions
  openAR: (mode: ARFilterMode, id?: string | number) => void;
  closeAR: () => void;
}

/**
 * Store to manage the global state of the Augmented Reality (AR) feature.
 * Controls visibility, filtering modes, and target subjects.
 */
export const useARStore = create<ARState>((set) => ({
  isVisible: false,
  filterMode: ARFilterMode.CLOSEST_EVENT,
  targetId: null,

  openAR: (mode, id = null) => 
    set({ 
      isVisible: true, 
      filterMode: mode, 
      targetId: id 
    }),

  closeAR: () => 
    set({ 
      isVisible: false, 
      targetId: null 
    }),
}));
