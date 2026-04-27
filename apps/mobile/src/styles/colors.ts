/**
 * Core primitive colors for the Lattice Design System.
 * These are the raw values used to build semantic themes.
 */
export const primitives = {
  // Brand: Solar Gold
  solar: {
    50: '#FEF9E7',
    100: '#FDF1C2',
    400: '#F4C978',
    500: '#EFB33F', // Base
    600: '#D69B2F',
    900: '#9D731C',
  },

  // Neutrals: Pristine (Light)
  pristine: {
    50: '#F9F9FB',
    100: '#F2F2F7',
    200: '#E5E5E7',
    500: '#8E8E93',
    900: '#1C1B1C',
  },

  // Neutrals: Midnight (Dark)
  midnight: {
    base: '#0A0A0C',   // Main Background
    obsidian: '#161618', // Surface/Card
    zinc: '#27272A',     // Elevation
    border: 'rgba(255, 255, 255, 0.1)',
    muted: '#71717A',
  },

  // Support
  slate: {
    50: '#F8FAFC',
    400: '#94A3B8',
    500: '#64748B',
    800: '#1E293B',
    900: '#0F172A',
  },
  categories: {
    music: '#AF52DE',
    food: '#FF9500',
    tech: '#007AFF',
    sports: '#FF3B30',
    generic: '#EFB33F', // Solar Gold
  },

  // Status
  status: {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFCC00',
    info: '#007AFF',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * Legacy export for backward compatibility during migration.
 * @deprecated Use theme tokens instead.
 */
export const colors = {
  primary: primitives.solar[500],
  secondary: primitives.solar[400],
  background: primitives.midnight.base,
  navbar: primitives.midnight.obsidian,
  surface: primitives.midnight.obsidian,
  border: primitives.midnight.border,
  muted: primitives.midnight.muted,
  accent: primitives.solar[500],
  white: primitives.white,
  black: primitives.black,
  solar: primitives.solar,
  glass: 'rgba(10, 10, 12, 0.8)',
} as const;

export default colors;

