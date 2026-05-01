import { create } from 'zustand';
import { ProfileState, UserProfile } from '../types';

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  updateBio: (bio) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, bio } : null,
    })),
}));
