export const colors = {
  primary: '#EFB33F', // Solar Gold (Brand)
  secondary: '#F4C978', // Mellow Amber (Secondary actions)
  background: '#F9F9FB', // Pristine Background
  navbar: '#FFFFFF',
  surface: '#FFFFFF', // Clean Surface
  border: '#E5E5E7', // Soft Border
  muted: '#8E8E93', // iOS Muted Text
  accent: '#EFB33F',
  white: '#FFFFFF',
  black: '#1C1B1C', // High Contrast Text
  
  // Solar Palette Hierarchy
  solar: {
    50: '#FEF9E7',
    100: '#FDF1C2',
    400: '#F4C978',
    500: '#EFB33F', // Base
    600: '#D69B2F',
    900: '#9D731C', // Text on yellow
  },
  
  // Support Palette
  slate: {
    50: '#F8FAFC',
    400: '#94A3B8',
    500: '#64748B',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  glass: 'rgba(255, 255, 255, 0.7)', // Frosted Glass
} as const;

export default colors;
