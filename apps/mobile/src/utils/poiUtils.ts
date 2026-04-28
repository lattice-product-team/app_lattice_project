import { colors } from '@app/theme';

export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = colors.neutral.dark.overlay;
export const NEUTRAL_MARKER_BORDER = colors.neutral.dark.elevated;

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'food-fork-drink', color: colors.semantic.dark.warning, label: 'Food & Drinks' }, 
  food: { icon: 'food-fork-drink', color: colors.semantic.dark.warning, label: 'Food & Drinks' },
  parking: { icon: 'parking', color: colors.semantic.dark.info, label: 'Parking Area' }, 
  shop: { icon: 'shopping', color: colors.category.tech, label: 'Official Store' }, 
  shopping: { icon: 'shopping', color: colors.category.tech, label: 'Official Store' },
  wc: { icon: 'toilet', color: colors.semantic.dark.info, label: 'Restrooms' }, 
  toilet: { icon: 'toilet', color: colors.semantic.dark.info, label: 'Restrooms' },
  restroom: { icon: 'toilet', color: colors.semantic.dark.info, label: 'Restrooms' },
  grandstand: { icon: 'stadium-variant', color: colors.semantic.dark.success, label: 'Grandstand' }, 
  medical: { icon: 'medical-bag', color: colors.semantic.dark.error, label: 'Medical Point' }, 
  hospital: { icon: 'hospital-building', color: colors.semantic.dark.error, label: 'Hospital' },
  gate: { icon: 'door-open', color: colors.brand.primary, label: 'Entrance Gate' }, 
  entrance: { icon: 'door-open', color: colors.brand.primary, label: 'Entrance Gate' },
  meetup_point: { icon: 'account-group', color: colors.brand.accent, label: 'Meetup Point' }, 
  info: { icon: 'information', color: colors.brand.secondary, label: 'Information' }, 
};

const EVENT_CATEGORY_MAP: Record<string, CategoryMetadata> = {
  music: { icon: 'music-note', color: colors.category.music, label: 'Música' },
  food: { icon: 'food-fork-drink', color: colors.category.food, label: 'Comida' },
  tech: { icon: 'laptop', color: colors.category.tech, label: 'Tecnología' },
  sports: { icon: 'trophy', color: colors.semantic.dark.error, label: 'Deportes' },
  generic: { icon: 'calendar-star', color: colors.brand.primary, label: 'Evento' },
};

export const DIRECT_ACCESS_CATEGORIES = ['gate', 'grandstand', 'parking'];

const DEFAULT_METADATA: CategoryMetadata = {
  icon: 'map-pin',
  color: colors.neutral.dark.overlay,
  label: 'Point of Interest',
};

export const getCategoryMetadata = (category?: string): CategoryMetadata => {
  if (!category) return DEFAULT_METADATA;
  return CATEGORY_MAP[category.toLowerCase()] || DEFAULT_METADATA;
};

export const getEventMetadata = (type?: string): CategoryMetadata => {
  if (!type) return EVENT_CATEGORY_MAP.generic;
  return EVENT_CATEGORY_MAP[type.toLowerCase()] || EVENT_CATEGORY_MAP.generic;
};

// Legacy support and direct accessors
export const getCategoryIcon = (category?: string): string => getCategoryMetadata(category).icon;
export const getCategoryColor = (category?: string): string => getCategoryMetadata(category).color;
export const getCategoryLabel = (category?: string): string => getCategoryMetadata(category).label;

/**
 * Maps legacy or multi-framework icon names to Feather names.
 */
export const mapIconName = (name: string): string => {
  const map: Record<string, string> = {
    'SlidersHorizontal': 'sliders',
    'Search': 'search',
    'X': 'x',
    'Utensils': 'coffee',
    'SquareP': 'map-pin',
    'ShoppingBag': 'shopping-bag',
    'Accessibility': 'user',
    'Stadium': 'map',
    'MapPin': 'map-pin',
    'door-open': 'log-in',
    'stadium-variant': 'map',
    'medical-bag': 'plus-square',
    'account-group': 'users'
  };
  return map[name] || name.toLowerCase();
};
