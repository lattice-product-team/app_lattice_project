import { colors as primitiveColors } from '@app/theme';

export interface LatticeTheme {
  dark: boolean;
  colors: {
    brand: {
      primary: string;
      primaryVariant: string;
      primarySurface: string;
      secondary: string;
      secondaryVariant: string;
    };
    bg: {
      main: string;
      surface: string;
      elevation: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      subtle: string;
      strong: string;
    };
    glass: {
      background: string;
      border: string;
      subtle: string;
      subtleBorder: string;
      tint: 'light' | 'dark';
    };
    status: {
      success: string;
      successSurface: string;
      error: string;
      errorSurface: string;
      warning: string;
      info: string;
    };
    interactive: {
      pressed: string;
      disabled: string;
    };
    overlay: {
      modal: string;
      thin: string;
    };
    gradient: {
      auth: readonly string[];
      premium: readonly string[];
      midnight: readonly string[];
    };
  };
  spacing: typeof baseTheme.spacing;
  borderRadius: typeof baseTheme.borderRadius;
  shadows: typeof baseTheme.shadows;
}

const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    }
  }
};

export const lightTheme: LatticeTheme = {
  ...baseTheme,
  dark: false,
  colors: {
    brand: {
      primary: primitiveColors.brand.primary,
      primaryVariant: primitiveColors.brand.accent,
      primarySurface: 'rgba(226, 176, 66, 0.1)',
      secondary: primitiveColors.brand.secondary,
      secondaryVariant: 'rgba(226, 176, 66, 0.05)',
    },
    bg: {
      main: primitiveColors.neutral.light.base,
      surface: primitiveColors.neutral.light.surface,
      elevation: primitiveColors.neutral.light.elevated,
    },
    text: {
      primary: '#000000', 
      secondary: '#3A3A3C',
      muted: '#8E8E93', // Apple standard muted grey
      inverse: '#FFFFFF',
    },
    border: {
      subtle: primitiveColors.neutral.light['border-low'],
      strong: primitiveColors.neutral.light['border-med'],
    },
    glass: {
      background: 'rgba(248, 248, 246, 0.92)', // Milky white from Apple Maps
      border: 'rgba(0, 0, 0, 0.04)',
      subtle: 'rgba(0, 0, 0, 0.03)',
      subtleBorder: 'rgba(0, 0, 0, 0.05)',
      tint: 'light',
    },
    status: {
      success: primitiveColors.semantic.light.success,
      successSurface: 'rgba(22, 163, 74, 0.1)',
      error: primitiveColors.semantic.light.error,
      errorSurface: 'rgba(220, 38, 38, 0.1)',
      warning: primitiveColors.semantic.light.warning,
      info: primitiveColors.semantic.light.info,
    },
    interactive: {
      pressed: 'rgba(0, 0, 0, 0.05)',
      disabled: '#D1D1CF',
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.4)',
      thin: 'rgba(0, 0, 0, 0.02)',
    },
    gradient: {
      auth: ['#FFFFFF', '#FFF9E5'] as const,
      premium: ['#FFFFFF', primitiveColors.brand.accent] as const,
      midnight: ['#FFFFFF', '#FDF5E6'] as const,
    },
  },
};

export const darkTheme: LatticeTheme = {
  ...baseTheme,
  dark: true,
  colors: {
    brand: {
      primary: primitiveColors.brand.primary,
      primaryVariant: primitiveColors.brand.deep,
      primarySurface: 'rgba(226, 176, 66, 0.15)',
      secondary: primitiveColors.brand.secondary,
      secondaryVariant: 'rgba(226, 176, 66, 0.2)',
    },
    bg: {
      main: primitiveColors.neutral.dark.base,
      surface: primitiveColors.neutral.dark.surface,
      elevation: primitiveColors.neutral.dark.elevated,
    },
    text: {
      primary: '#FCFCFA',
      secondary: '#999997',
      muted: '#666664',
      inverse: '#1A1A19',
    },
    border: {
      subtle: primitiveColors.neutral.dark['border-low'],
      strong: primitiveColors.neutral.dark['border-med'],
    },
    glass: {
      background: 'rgba(20, 20, 18, 0.7)',
      border: 'rgba(255, 255, 255, 0.12)',
      subtle: 'rgba(255, 255, 255, 0.15)',
      subtleBorder: 'rgba(255, 255, 255, 0.2)',
      tint: 'dark',
    },
    status: {
      success: primitiveColors.semantic.dark.success,
      successSurface: 'rgba(39, 196, 104, 0.15)',
      error: primitiveColors.semantic.dark.error,
      errorSurface: 'rgba(229, 72, 77, 0.15)',
      warning: primitiveColors.semantic.dark.warning,
      info: primitiveColors.semantic.dark.info,
    },
    interactive: {
      pressed: 'rgba(255, 255, 255, 0.1)',
      disabled: '#333331',
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.7)',
      thin: 'rgba(255, 255, 255, 0.03)',
    },
    gradient: {
      auth: [primitiveColors.neutral.dark.base, '#000000'] as const,
      premium: ['#FFFFFF', primitiveColors.brand.accent] as const,
      midnight: [primitiveColors.neutral.dark.elevated, '#000000'] as const,
    },
  },
};

// Default export for backward compatibility during transition
export const theme = darkTheme;
export type Theme = LatticeTheme;


