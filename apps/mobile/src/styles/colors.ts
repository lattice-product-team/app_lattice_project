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
  background: primitives.pristine[50],
  navbar: primitives.white,
  surface: primitives.white,
  border: primitives.pristine[200],
  muted: primitives.pristine[500],
  accent: primitives.solar[500],
  white: primitives.white,
  black: primitives.pristine[900],
  solar: primitives.solar,
  glass: 'rgba(255, 255, 255, 0.7)',
} as const;

export default colors;

