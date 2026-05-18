import { create } from 'zustand';

interface OrientationState {
  heading: number;
  pitch: number;
  isLandscape: boolean;


  setHeading: (heading: number) => void;
  setPitch: (pitch: number) => void;
  setIsLandscape: (isLandscape: boolean) => void;
}

export const useOrientationStore = create<OrientationState>((set) => ({
  heading: 0,
  pitch: 0,
  isLandscape: false,

  setHeading: (heading) => set({ heading }),
  setPitch: (pitch) => set({ pitch }),
  setIsLandscape: (isLandscape) => set({ isLandscape }),
}));
