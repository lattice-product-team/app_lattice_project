import { create } from 'zustand';
import { PermissionStatus } from '../types';

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

export const useLocationStore = create<LocationState>((set) => ({
  coords: null,
  logicalCoords: null,
  status: 'undetermined',
  avoidStairs: false,
  wheelchairAccess: false,
  avoidGrandstands: false,
  avoidSlopes: false,

  setLocation: (coords) => set({ coords }),
  setLogicalLocation: (logicalCoords) => set({ logicalCoords }),
  setStatus: (status) => set({ status }),
  updatePreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
}));
