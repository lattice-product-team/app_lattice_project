import { colors } from '@app/theme';

export interface CategoryMetadata {
  icon: string;
  iconFamily: 'feather' | 'material';
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = colors.neutral.dark.overlay;
export const NEUTRAL_MARKER_BORDER = colors.neutral.dark.elevated;

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  // Food & Drink
  restaurant: {
    icon: 'coffee',
    iconFamily: 'feather',
    color: colors.semantic.dark.warning,
    label: 'Comida y Bebida',
  },
  food: {
    icon: 'coffee',
    iconFamily: 'feather',
    color: colors.semantic.dark.warning,
    label: 'Comida y Bebida',
  },
  coffee: {
    icon: 'coffee',
    iconFamily: 'feather',
    color: colors.semantic.dark.warning,
    label: 'Cafetería',
  },

  // Infrastructure
  parking: {
    icon: 'map-pin',
    iconFamily: 'feather',
    color: colors.semantic.dark.info,
    label: 'Parking',
  },
  wc: { icon: 'user', iconFamily: 'feather', color: colors.semantic.dark.info, label: 'Aseos' },
  toilet: { icon: 'user', iconFamily: 'feather', color: colors.semantic.dark.info, label: 'Aseos' },
  restroom: {
    icon: 'user',
    iconFamily: 'feather',
    color: colors.semantic.dark.info,
    label: 'Aseos',
  },

  // Event Specific
  grandstand: {
    icon: 'map',
    iconFamily: 'feather',
    color: colors.semantic.dark.success,
    label: 'Tribuna',
  },
  medical: {
    icon: 'plus-square',
    iconFamily: 'feather',
    color: colors.semantic.dark.error,
    label: 'Servicio Médico',
  },
  hospital: {
    icon: 'plus-square',
    iconFamily: 'feather',
    color: colors.semantic.dark.error,
    label: 'Hospital',
  },
  gate: { icon: 'log-in', iconFamily: 'feather', color: colors.brand.primary, label: 'Acceso' },
  entrance: { icon: 'log-in', iconFamily: 'feather', color: colors.brand.primary, label: 'Acceso' },

  // Community & Info
  meetup_point: {
    icon: 'users',
    iconFamily: 'feather',
    color: colors.brand.accent,
    label: 'Punto de Encuentro',
  },
  info: {
    icon: 'info',
    iconFamily: 'feather',
    color: colors.brand.secondary,
    label: 'Información',
  },
  shop: {
    icon: 'shopping-bag',
    iconFamily: 'feather',
    color: colors.category.tech,
    label: 'Tienda Oficial',
  },
  shopping: {
    icon: 'shopping-bag',
    iconFamily: 'feather',
    color: colors.category.tech,
    label: 'Tienda Oficial',
  },
};

const EVENT_CATEGORY_MAP: Record<string, CategoryMetadata> = {
  music: {
    icon: 'music-note',
    iconFamily: 'material',
    color: colors.brand.primary,
    label: 'Música',
  },
  food: {
    icon: 'food-fork-drink',
    iconFamily: 'material',
    color: colors.brand.primary,
    label: 'Comida',
  },
  tech: {
    icon: 'laptop',
    iconFamily: 'material',
    color: colors.brand.primary,
    label: 'Tecnología',
  },
  sports: {
    icon: 'trophy',
    iconFamily: 'material',
    color: colors.brand.primary,
    label: 'Deportes',
  },
  generic: {
    icon: 'calendar-star',
    iconFamily: 'material',
    color: colors.brand.primary,
    label: 'Evento',
  },
};

export const DIRECT_ACCESS_CATEGORIES = ['gate', 'grandstand', 'parking'];

const DEFAULT_METADATA: CategoryMetadata = {
  icon: 'map-pin',
  iconFamily: 'feather',
  color: colors.brand.primary,
  label: 'Punto de Interés',
};

export const getCategoryMetadata = (category?: string): CategoryMetadata => {
  if (!category) return DEFAULT_METADATA;
  
  const normalized = category.toLowerCase().trim();
  
  // 1. Exact match
  if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];
  
  // 2. Fuzzy keyword matching for event-specific strings (e.g. "infrastructure_gate")
  if (normalized.includes('gate') || normalized.includes('entrance')) return CATEGORY_MAP.gate;
  if (normalized.includes('food') || normalized.includes('restaurant') || normalized.includes('drink')) return CATEGORY_MAP.restaurant;
  if (normalized.includes('wc') || normalized.includes('toilet') || normalized.includes('restroom')) return CATEGORY_MAP.wc;
  if (normalized.includes('parking')) return CATEGORY_MAP.parking;
  if (normalized.includes('info')) return CATEGORY_MAP.info;
  if (normalized.includes('medical') || normalized.includes('hospital')) return CATEGORY_MAP.medical;
  if (normalized.includes('shop') || normalized.includes('store')) return CATEGORY_MAP.shop;
  if (normalized.includes('grandstand') || normalized.includes('seat')) return CATEGORY_MAP.grandstand;
  
  return DEFAULT_METADATA;
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
    SlidersHorizontal: 'sliders',
    Search: 'search',
    X: 'x',
    Utensils: 'coffee',
    SquareP: 'map-pin',
    ShoppingBag: 'shopping-bag',
    Accessibility: 'user',
    Stadium: 'map',
    MapPin: 'map-pin',
    'door-open': 'log-in',
    'stadium-variant': 'map',
    'medical-bag': 'plus-square',
    'account-group': 'users',
  };
  return map[name] || name.toLowerCase();
};
