export interface Medal {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name or image URL
  earnedAt?: string;
  isLocked: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  stats: {
    eventsAttended: number;
    savedEvents: number;
    latticePoints: number;
  };
  medals: Medal[];
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  updateBio: (bio: string) => void;
}
