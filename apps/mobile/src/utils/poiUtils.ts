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
  LucideIcon
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
    label: 'Comida y Bebida',
    strokeWidth: 2.5,
  },
  food: {
    icon: Utensils,
    color: colors.semantic.dark.warning,
    label: 'Comida y Bebida',
    strokeWidth: 2.5,
  },
  coffee: {
    icon: Coffee,
    color: colors.semantic.dark.warning,
    label: 'Cafetería',
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
    label: 'Aseos',
    strokeWidth: 2.5,
  },
  toilet: { 
    icon: User, 
    color: colors.semantic.dark.info, 
    label: 'Aseos',
    strokeWidth: 2.5,
  },
  restroom: {
    icon: User,
    color: colors.semantic.dark.info,
    label: 'Aseos',
    strokeWidth: 2.5,
  },

  // Event Specific
  grandstand: {
    icon: Map,
    color: colors.semantic.dark.success,
    label: 'Tribuna',
    strokeWidth: 2.5,
  },
  medical: {
    icon: SquarePlus,
    color: colors.semantic.dark.error,
    label: 'Servicio Médico',
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
    label: 'Acceso',
    strokeWidth: 2.5,
  },
  entrance: { 
    icon: LogIn, 
    color: colors.brand.primary, 
    label: 'Acceso',
    strokeWidth: 2.5,
  },

  // Community & Info
  meetup_point: {
    icon: Users,
    color: colors.brand.accent,
    label: 'Punto de Encuentro',
    strokeWidth: 2.5,
  },
  info: {
    icon: Info,
    color: colors.brand.secondary,
    label: 'Información',
    strokeWidth: 2.5,
  },
  shop: {
    icon: ShoppingBag,
    color: colors.category.tech,
    label: 'Tienda Oficial',
    strokeWidth: 2.5,
  },
  shopping: {
    icon: ShoppingBag,
    color: colors.category.tech,
    label: 'Tienda Oficial',
    strokeWidth: 2.5,
  },
  event_beacon: {
    icon: MapPin,
    color: colors.brand.primary,
    label: 'Evento',
    strokeWidth: 2.5,
  },
};

const EVENT_CATEGORY_MAP: Record<string, CategoryMetadata> = {
  music: {
    icon: Music,
    color: colors.brand.primary,
    label: 'Música',
    strokeWidth: 2.5,
  },
  food: {
    icon: Utensils,
    color: colors.brand.primary,
    label: 'Comida',
    strokeWidth: 2.5,
  },
  tech: {
    icon: Laptop,
    color: colors.brand.primary,
    label: 'Tecnología',
    strokeWidth: 2.5,
  },
  sports: {
    icon: Trophy,
    color: colors.brand.primary,
    label: 'Deportes',
    strokeWidth: 2.5,
  },
  generic: {
    icon: Calendar,
    color: colors.brand.primary,
    label: 'Evento',
    strokeWidth: 2.5,
  },
};

export const DIRECT_ACCESS_CATEGORIES = ['gate', 'grandstand', 'parking'];

const DEFAULT_METADATA: CategoryMetadata = {
  icon: MapPin,
  color: colors.brand.primary,
  label: 'Punto de Interés',
  strokeWidth: 2.5,
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
export const getCategoryIcon = (category?: string): LucideIcon => getCategoryMetadata(category).icon;
export const getCategoryColor = (category?: string): string => getCategoryMetadata(category).color;
export const getCategoryLabel = (category?: string): string => getCategoryMetadata(category).label;
