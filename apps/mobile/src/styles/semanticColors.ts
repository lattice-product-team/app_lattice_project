import { colors as primitiveColors } from '@app/theme';
import { LatticeTheme } from './theme';

/**
 * Apple Maps inspired semantic colors for event categories.
 * Each color is chosen for its vibrancy and common map associations.
 */
export const getSemanticColors = (theme: LatticeTheme) => ({
  categories: {
    music: primitiveColors.category.music,
    food: primitiveColors.category.food,
    tech: primitiveColors.category.tech,
    services: primitiveColors.semantic[theme.dark ? 'dark' : 'light'].info,
    shopping: '#5856D6',    // Indigo (Merchandise)
    emergency: primitiveColors.semantic[theme.dark ? 'dark' : 'light'].error,
    parking: '#8E8E93',     // Gray (Transport/Parking)
    transport: '#5AC8FA',   // Light Blue (Shuttles)
    selected: theme.colors.brand.primary, // Active Selection
  },
  
  status: {
    success: primitiveColors.semantic[theme.dark ? 'dark' : 'light'].success,
    warning: primitiveColors.semantic[theme.dark ? 'dark' : 'light'].warning,
    error: primitiveColors.semantic[theme.dark ? 'dark' : 'light'].error,
    info: primitiveColors.semantic[theme.dark ? 'dark' : 'light'].info,
  },
  
  elevation: {
    card: theme.colors.bg.surface,
    overlay: theme.colors.glass.background,
  }
});

// Legacy export for backward compatibility
export const semanticColors = {
  categories: {
    music: primitiveColors.category.music,
    food: primitiveColors.category.food,
    tech: primitiveColors.category.tech,
    services: primitiveColors.semantic.dark.info,
    shopping: '#5856D6',
    emergency: primitiveColors.semantic.dark.error,
    parking: '#8E8E93',
    transport: '#5AC8FA',
    selected: primitiveColors.brand.primary,
  },
  status: {
    success: primitiveColors.semantic.dark.success,
    warning: primitiveColors.semantic.dark.warning,
    error: primitiveColors.semantic.dark.error,
    info: primitiveColors.semantic.dark.info,
  },
  elevation: {
    card: 'rgba(20, 20, 18, 0.8)',
    overlay: 'rgba(20, 20, 18, 0.4)',
  }
} as const;

export type SemanticCategory = keyof typeof semanticColors.categories;
export default semanticColors;

