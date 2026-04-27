export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = 'rgba(255, 255, 255, 0.15)'; // Neutral glass-like color
export const NEUTRAL_MARKER_BORDER = 'rgba(255, 255, 255, 0.3)';

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'food-fork-drink', color: '#D9B99B', label: 'Food & Drinks' }, 
  food: { icon: 'food-fork-drink', color: '#D9B99B', label: 'Food & Drinks' },
  parking: { icon: 'parking', color: '#9BA9D9', label: 'Parking Area' }, 
  shop: { icon: 'shopping', color: '#C19BD9', label: 'Official Store' }, 
  shopping: { icon: 'shopping', color: '#C19BD9', label: 'Official Store' },
  wc: { icon: 'toilet', color: '#9BD9D9', label: 'Restrooms' }, 
  toilet: { icon: 'toilet', color: '#9BD9D9', label: 'Restrooms' },
  restroom: { icon: 'toilet', color: '#9BD9D9', label: 'Restrooms' },
  grandstand: { icon: 'stadium-variant', color: '#B4D99B', label: 'Grandstand' }, 
  medical: { icon: 'medical-bag', color: '#D99B9B', label: 'Medical Point' }, 
  hospital: { icon: 'hospital-building', color: '#D99B9B', label: 'Hospital' },
  gate: { icon: 'door-open', color: '#9592C4', label: 'Entrance Gate' }, 
  entrance: { icon: 'door-open', color: '#9592C4', label: 'Entrance Gate' },
  meetup_point: { icon: 'account-group', color: '#9BC5C3', label: 'Meetup Point' }, 
  info: { icon: 'information', color: '#D9D99B', label: 'Information' }, 
};

const EVENT_CATEGORY_MAP: Record<string, CategoryMetadata> = {
  music: { icon: 'music-note', color: '#AF52DE', label: 'Música' },
  food: { icon: 'food-fork-drink', color: '#FF9500', label: 'Comida' },
  tech: { icon: 'laptop', color: '#007AFF', label: 'Tecnología' },
  sports: { icon: 'trophy', color: '#FF3B30', label: 'Deportes' },
  generic: { icon: 'calendar-star', color: '#EFB33F', label: 'Evento' },
};

export const DIRECT_ACCESS_CATEGORIES = ['gate', 'grandstand', 'parking'];

const DEFAULT_METADATA: CategoryMetadata = {
  icon: 'map-pin',
  color: '#8E8E93',
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
