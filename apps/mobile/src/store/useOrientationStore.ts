import { create } from 'zustand';

interface OrientationState {
  heading: number;
  isLandscape: boolean;
  
  // Actions
  setHeading: (heading: number) => void;
  setIsLandscape: (isLandscape: boolean) => void;
}

export const useOrientationStore = create<OrientationState>((set) => ({
  heading: 0,
  isLandscape: false,

  setHeading: (heading) => set({ heading }),
  setIsLandscape: (isLandscape) => set({ isLandscape }),
}));
