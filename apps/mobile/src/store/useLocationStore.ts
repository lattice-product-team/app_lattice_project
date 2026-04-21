import { create } from 'zustand';
import { PermissionStatus } from '../types';

interface LocationState {
  coords: number[] | null;
  logicalCoords: number[] | null;
  status: PermissionStatus;
  
  // Actions
  setLocation: (coords: number[] | null) => void;
  setLogicalLocation: (coords: number[] | null) => void;
  setStatus: (status: PermissionStatus) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coords: null,
  logicalCoords: null,
  status: 'undetermined',

  setLocation: (coords) => set({ coords }),
  setLogicalLocation: (logicalCoords) => set({ logicalCoords }),
  setStatus: (status) => set({ status }),
}));
