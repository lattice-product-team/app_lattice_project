import { create } from 'zustand';
import { ProfileState, UserProfile } from '../types';

const MOCK_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'Alex Rivera',
  email: 'alex@lattice.app',
  bio: 'Explorador urbano y amante de los festivales. Buscando siempre la próxima joya escondida en la ciudad.',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  stats: {
    eventsAttended: 12,
    savedEvents: 8,
    latticePoints: 450,
  },
  medals: [
    {
      id: 'medal_1',
      title: 'Pionero',
      description: 'Asistió al primer evento del año',
      icon: 'trophy',
      earnedAt: '2024-01-15',
      isLocked: false,
    },
    {
      id: 'medal_2',
      title: 'Noctámbulo',
      description: 'Asistió a 5 eventos nocturnos',
      icon: 'weather-night',
      earnedAt: '2024-03-10',
      isLocked: false,
    },
    {
      id: 'medal_3',
      title: 'Explorador Pro',
      description: 'Descubrió 10 nuevos lugares',
      icon: 'map-marker-star',
      isLocked: true,
    },
  ],
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: MOCK_PROFILE,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  updateBio: (bio) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, bio } : null,
    })),
}));
