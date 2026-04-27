export const colors = {
  primary: '#907783', // Magic Gem
  background: '#1D1C1D', // Dynamic Black
  navbar: '#1D1C1D',
  border: '#2D2B2C',
  surface: '#2D2B2C', // Warm Onyx variant
  muted: '#6D6A6B', // Boat Anchor
  accent: '#F6F6F6', // Cascading White
  glass: 'rgba(255, 255, 255, 0.05)',
  white: '#F6F6F6',
  black: '#1D1C1D',
  secondary: '#6D6A6B',
  steel: '#5C5A59', // Forged Steel
  wine: {
    500: '#4A2C3A', // Deep Wine (Base)
    400: '#907783', // Magic Gem (Highlight)
    600: '#3A222E', // Darker Wine
    900: '#1C1B1C', // Very Dark
  },
  slate: {
    400: '#9CA3AF',
    500: '#6B7280',
    700: '#374151',
    800: '#1F2937',
    900: '#0F172A',
  },
  categories: {
    music: '#AF52DE',
    food: '#FF9500',
    tech: '#007AFF',
    sports: '#FF3B30',
    generic: '#EFB33F', // Solar Gold
  }
} as const;

export default colors;
