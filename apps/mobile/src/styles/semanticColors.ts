import { primitives } from './colors';
import { LatticeTheme } from './theme';

/**
 * Apple Maps inspired semantic colors for event categories.
 * Each color is chosen for its vibrancy and common map associations.
 */
export const getSemanticColors = (theme: LatticeTheme) => ({
  categories: {
    music: '#AF52DE',       // Purple (Entertainment/Stages)
    food: '#FF9500',        // Orange (Dining/Drinks)
    services: '#007AFF',    // Blue (Info/Toilets/First Aid)
    shopping: '#5856D6',    // Indigo (Merchandise)
    emergency: '#FF3B30',   // Red (Danger/Emergency)
    parking: '#8E8E93',     // Gray (Transport/Parking)
    transport: '#5AC8FA',   // Light Blue (Shuttles)
    selected: theme.colors.brand.primary, // Solar Gold (Active Selection)
  },
  
  status: {
    success: '#34C759',     // iOS Green
    warning: '#FFCC00',     // iOS Yellow
    error: '#FF3B30',       // iOS Red
    info: '#007AFF',        // iOS Blue
  },
  
  elevation: {
    card: theme.colors.bg.surface,
    overlay: theme.colors.glass.background,
  }
});

// Legacy export for backward compatibility
export const semanticColors = {
  categories: {
    music: '#AF52DE',
    food: '#FF9500',
    services: '#007AFF',
    shopping: '#5856D6',
    emergency: '#FF3B30',
    parking: '#8E8E93',
    transport: '#5AC8FA',
    selected: primitives.solar[500],
  },
  status: {
    success: '#34C759',
    warning: '#FFCC00',
    error: '#FF3B30',
    info: '#007AFF',
  },
  elevation: {
    card: 'rgba(255, 255, 255, 0.8)',
    overlay: 'rgba(255, 255, 255, 0.4)',
  }
} as const;

export type SemanticCategory = keyof typeof semanticColors.categories;
export default semanticColors;

