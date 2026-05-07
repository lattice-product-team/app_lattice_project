import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PermissionStatus } from '../types';
import { mmkvStorage, storage } from '../services/storage';

interface LocationState {
  coords: number[] | null;
  logicalCoords: number[] | null;
  avoidStairs: boolean;
  wheelchairAccess: boolean;
  avoidGrandstands: boolean;
  avoidSlopes: boolean;
  status: PermissionStatus;
  
  // Actions
  setLocation: (coords: number[] | null) => void;
  setLogicalLocation: (coords: number[] | null) => void;
  setStatus: (status: PermissionStatus) => void;
  updatePreferences: (prefs: Partial<{ 
    avoidStairs: boolean, 
    wheelchairAccess: boolean,
    avoidGrandstands: boolean,
    avoidSlopes: boolean
  }>) => void;
}

// Pre-hydrate from MMKV to ensure first render has coordinates
const getPersistedLocation = () => {
  try {
    const json = storage.getString('location-storage');
    if (json) {
      const parsed = JSON.parse(json);
      return {
        coords: parsed.state?.coords || null,
        logicalCoords: parsed.state?.logicalCoords || null,
      };
    }
  } catch (e) {
    console.warn('Failed to pre-hydrate location store:', e);
  }
  return { coords: null, logicalCoords: null };
};

const initialLocation = getPersistedLocation();

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...initialLocation,
      status: 'undetermined',
      avoidStairs: false,
      wheelchairAccess: false,
      avoidGrandstands: false,
      avoidSlopes: false,

      setLocation: (coords) => set({ coords }),
      setLogicalLocation: (logicalCoords) => set({ logicalCoords }),
      setStatus: (status) => set({ status }),
      updatePreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ 
        coords: state.coords, 
        logicalCoords: state.logicalCoords 
      }),
    }
  )
);
