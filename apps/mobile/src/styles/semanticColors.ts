import { colors } from './colors';

/**
 * Apple Maps inspired semantic colors for event categories.
 * Each color is chosen for its vibrancy and common map associations.
 */
export const semanticColors = {
  categories: {
    music: '#AF52DE',       // Purple (Entertainment/Stages)
    food: '#FF9500',        // Orange (Dining/Drinks)
    services: '#007AFF',    // Blue (Info/Toilets/First Aid)
    shopping: '#5856D6',    // Indigo (Merchandise)
    emergency: '#FF3B30',   // Red (Danger/Emergency)
    parking: '#8E8E93',     // Gray (Transport/Parking)
    transport: '#5AC8FA',   // Light Blue (Shuttles)
    selected: colors.primary, // Solar Gold (Active Selection)
  },
  
  status: {
    success: '#34C759',     // iOS Green
    warning: '#FFCC00',     // iOS Yellow
    error: '#FF3B30',       // iOS Red
    info: '#007AFF',        // iOS Blue
  },
  
  elevation: {
    card: 'rgba(255, 255, 255, 0.8)',
    overlay: 'rgba(255, 255, 255, 0.4)',
  }
} as const;

export type SemanticCategory = keyof typeof semanticColors.categories;

export default semanticColors;
