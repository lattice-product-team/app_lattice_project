export const colors = {
  brand: {
    primary: '#F8D548',
    secondary: '#D9B735',
    accent: '#FAEA8B',
    deep: '#B89A2D',
  },
  neutral: {
    light: {
      base: '#FCFCFA',
      surface: '#F4F4F2',
      elevated: '#EBEBE8',
      overlay: '#E1E1DE',
      'border-low': 'rgba(0, 0, 0, 0.05)',
      'border-med': 'rgba(0, 0, 0, 0.12)',
    },
    dark: {
      base: '#0A0A09',
      surface: '#141412',
      elevated: '#1C1C1A',
      overlay: '#262624',
      'border-low': 'rgba(255, 255, 255, 0.05)',
      'border-med': 'rgba(255, 255, 255, 0.12)',
    },
  },
  semantic: {
    light: {
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },
    dark: {
      success: '#27C468',
      warning: '#F2A03D',
      error: '#E5484D',
      info: '#54A6FF',
    },
  },
  category: {
    music: '#8E5DCF',
    food: '#D97706',
    tech: '#4F46E5',
  },
} as const;

export type Colors = typeof colors;
