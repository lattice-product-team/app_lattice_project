import { colors } from '@app/theme';
import {
  Coffee,
  MapPin,
  User,
  Map,
  SquarePlus,
  LogIn,
  Users,
  Info,
  ShoppingBag,
  Music,
  Utensils,
  Laptop,
  Trophy,
  Calendar,
  LucideIcon,
} from 'lucide-react-native';

export interface CategoryMetadata {
  icon: LucideIcon;
  color: string;
  label: string;
  strokeWidth?: number;
}

export const NEUTRAL_MARKER_COLOR = colors.neutral.dark.overlay;
export const NEUTRAL_MARKER_BORDER = colors.neutral.dark.elevated;

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  // Food & Drink
  restaurant: {
    icon: Utensils,
    color: colors.semantic.dark.warning,
    label: 'Dining',
    strokeWidth: 2.5,
  },
  food: {
    icon: Utensils,
    color: colors.semantic.dark.warning,
    label: 'Gastronomy',
    strokeWidth: 2.5,
  },
  coffee: {
    icon: Coffee,
    color: colors.semantic.dark.warning,
    label: 'Coffee & Snacks',
    strokeWidth: 2.5,
  },

  // Infrastructure
  parking: {
    icon: MapPin,
    color: colors.semantic.dark.info,
    label: 'Parking',
    strokeWidth: 2.5,
  },
  wc: {
    icon: User,
    color: colors.semantic.dark.info,
    label: 'Restrooms',
    strokeWidth: 2.5,
  },
  toilet: {
    icon: User,
    color: colors.semantic.dark.info,
    label: 'Restrooms',
    strokeWidth: 2.5,
  },
  restroom: {
    icon: User,
    color: colors.semantic.dark.info,
    label: 'Restrooms',
    strokeWidth: 2.5,
  },

  // Event Specific
  grandstand: {
    icon: Map,
    color: colors.semantic.dark.success,
    label: 'Grandstand',
    strokeWidth: 2.5,
  },
  medical: {
    icon: SquarePlus,
    color: colors.semantic.dark.error,
    label: 'Medical Services',
    strokeWidth: 2.5,
  },
  hospital: {
    icon: SquarePlus,
    color: colors.semantic.dark.error,
    label: 'Hospital',
    strokeWidth: 2.5,
  },
  gate: {
    icon: LogIn,
    color: colors.brand.primary,
    label: 'Access Point',
    strokeWidth: 2.5,
  },
  entrance: {
    icon: LogIn,
    color: colors.brand.primary,
    label: 'Entrance',
    strokeWidth: 2.5,
  },

  // Community & Info
  meetup_point: {
    icon: Users,
    color: colors.brand.accent,
    label: 'Meetup Point',
    strokeWidth: 2.5,
  },
  info: {
    icon: Info,
    color: colors.brand.secondary,
    label: 'Information',
    strokeWidth: 2.5,
  },
  shop: {
    icon: ShoppingBag,
    color: colors.category.tech,
    label: 'Official Shop',
    strokeWidth: 2.5,
  },
  shopping: {
    icon: ShoppingBag,
    color: colors.category.tech,
    label: 'Shopping',
    strokeWidth: 2.5,
  },
  event_beacon: {
    icon: MapPin,
    color: colors.brand.primary,
    label: 'Event Hub',
    strokeWidth: 2.5,
  },
};

const EVENT_CATEGORY_MAP: Record<string, CategoryMetadata> = {
  music: {
    icon: Music,
    color: colors.brand.primary,
    label: 'Music',
    strokeWidth: 2.5,
  },
  food: {
    icon: Utensils,
    color: colors.brand.primary,
    label: 'Gastronomy',
    strokeWidth: 2.5,
  },
  tech: {
    icon: Laptop,
    color: colors.brand.primary,
    label: 'Technology',
    strokeWidth: 2.5,
  },
  sports: {
    icon: Trophy,
    color: colors.brand.primary,
    label: 'Sports',
    strokeWidth: 2.5,
  },
  generic: {
    icon: Calendar,
    color: colors.brand.primary,
    label: 'Event',
    strokeWidth: 2.5,
  },
};

export const DIRECT_ACCESS_CATEGORIES = ['gate', 'grandstand', 'parking'];

const DEFAULT_METADATA: CategoryMetadata = {
  icon: MapPin,
  color: colors.brand.primary,
  label: 'Point of Interest',
  strokeWidth: 2.5,
};

export const getCategoryMetadata = (category?: string): CategoryMetadata => {
  if (!category) return DEFAULT_METADATA;

  const normalized = category.toLowerCase().trim();

  // 1. Exact match
  if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];

  // 2. Fuzzy keyword matching for event-specific strings (e.g. "infrastructure_gate")
  if (normalized.includes('gate') || normalized.includes('entrance')) return CATEGORY_MAP.gate;
  if (
    normalized.includes('food') ||
    normalized.includes('restaurant') ||
    normalized.includes('drink')
  )
    return CATEGORY_MAP.restaurant;
  if (normalized.includes('wc') || normalized.includes('toilet') || normalized.includes('restroom'))
    return CATEGORY_MAP.wc;
  if (normalized.includes('parking')) return CATEGORY_MAP.parking;
  if (normalized.includes('info')) return CATEGORY_MAP.info;
  if (normalized.includes('medical') || normalized.includes('hospital'))
    return CATEGORY_MAP.medical;
  if (normalized.includes('shop') || normalized.includes('store')) return CATEGORY_MAP.shop;
  if (normalized.includes('grandstand') || normalized.includes('seat'))
    return CATEGORY_MAP.grandstand;

  return DEFAULT_METADATA;
};

export const getEventMetadata = (type?: string): CategoryMetadata => {
  if (!type) return EVENT_CATEGORY_MAP.generic;
  return EVENT_CATEGORY_MAP[type.toLowerCase()] || EVENT_CATEGORY_MAP.generic;
};

// Legacy support and direct accessors
export const getCategoryLabel = (category?: string): string => getCategoryMetadata(category).label;


/**
 * Generates a stable, vibrant color based on a string ID.
 * Useful for giving each event a distinct look.
 */
export const getStableColor = (id: string): string => {
  const eventColors = [
    '#FF3B30', // Red
    '#FF9500', // Orange
    '#FFCC00', // Yellow
    '#34C759', // Green
    '#007AFF', // Blue
    '#5856D6', // Indigo
    '#AF52DE', // Purple
    '#FF2D55', // Pink
    '#5AC8FA', // Light Blue
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % eventColors.length;
  return eventColors[index];
};

export const DEFAULT_POI_BANNER = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWUyOTNiIi8+PHN0b3CBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwZjE3MmEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNnKSIgcng9IjE2Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iIzFlMjkzYiIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTAwIDc1Yy0xMy44IDAtMjUgMTEuMi0yNSAyNSAwIDE4LjggMjUgNDAgMjUgNDBzMjUtMjEuMiAyNS00MGMwLTEzLjgtMTEuMi0yNS0yNS0yNXptMCAzNWMtNS41IDAtMTAtNC41LTEwLTEwczQuNS0xMCAxMC0xMCAxMCA0LjUgMTAgMTAtNC41IDEwLTEwIDEweiIgZmlsbD0iIzY0NzQ4YiIvPjwvc3ZnPg==`;

export const resolveBannerUrl = (url?: string | null): string => {
  if (
    !url ||
    url === 'null' ||
    (typeof url === 'string' && (url.trim() === '' || url.startsWith('PLACEHOLDER_')))
  ) {
    return DEFAULT_POI_BANNER;
  }
  return url;
};

