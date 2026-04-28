import { colors } from '@app/theme';

export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = colors.neutral.dark.overlay;
export const NEUTRAL_MARKER_BORDER = colors.neutral.dark.elevated;

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  // Food & Drink
  restaurant: { icon: 'coffee', color: colors.semantic.dark.warning, label: 'Comida y Bebida' }, 
  food: { icon: 'coffee', color: colors.semantic.dark.warning, label: 'Comida y Bebida' },
  coffee: { icon: 'coffee', color: colors.semantic.dark.warning, label: 'Cafetería' },
  
  // Infrastructure
  parking: { icon: 'map-pin', color: colors.semantic.dark.info, label: 'Parking' }, 
  wc: { icon: 'user', color: colors.semantic.dark.info, label: 'Aseos' }, 
  toilet: { icon: 'user', color: colors.semantic.dark.info, label: 'Aseos' },
  restroom: { icon: 'user', color: colors.semantic.dark.info, label: 'Aseos' },
  
  // Event Specific
  grandstand: { icon: 'map', color: colors.semantic.dark.success, label: 'Tribuna' }, 
  medical: { icon: 'plus-square', color: colors.semantic.dark.error, label: 'Servicio Médico' }, 
  hospital: { icon: 'plus-square', color: colors.semantic.dark.error, label: 'Hospital' },
  gate: { icon: 'log-in', color: colors.brand.primary, label: 'Acceso' }, 
  entrance: { icon: 'log-in', color: colors.brand.primary, label: 'Acceso' },
  
  // Community & Info
  meetup_point: { icon: 'users', color: colors.brand.accent, label: 'Punto de Encuentro' }, 
  info: { icon: 'info', color: colors.brand.secondary, label: 'Información' }, 
  shop: { icon: 'shopping-bag', color: colors.category.tech, label: 'Tienda Oficial' }, 
  shopping: { icon: 'shopping-bag', color: colors.category.tech, label: 'Tienda Oficial' },
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
