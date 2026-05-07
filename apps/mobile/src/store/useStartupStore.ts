import { create } from 'zustand';

interface StartupStore {
  isDataReady: boolean;
  isMapReady: boolean;
  setDataReady: (ready: boolean) => void;
  setMapReady: (ready: boolean) => void;
}

/**
 * Global store to coordinate the premium splash screen transition.
 * Ensures data is fetched and native components are ready before reveal.
 */
export const useStartupStore = create<StartupStore>((set) => ({
  isDataReady: false,
  isMapReady: false,
  setDataReady: (isDataReady) => set({ isDataReady }),
  setMapReady: (isMapReady) => set({ isMapReady }),
}));
