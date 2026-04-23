import { primitives } from './colors';

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
      shadowOpacity: 0.1,
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
      primary: primitives.solar[500],
      primaryVariant: primitives.solar[600],
      primarySurface: 'rgba(239, 179, 63, 0.1)',
      secondary: primitives.solar[400],
      secondaryVariant: primitives.solar[100],
    },
    bg: {
      main: primitives.pristine[50],
      surface: primitives.white,
      elevation: primitives.pristine[100],
    },
    text: {
      primary: primitives.pristine[900],
      secondary: primitives.slate[500],
      muted: primitives.pristine[500],
      inverse: primitives.white,
    },
    border: {
      subtle: primitives.pristine[200],
      strong: primitives.slate[400],
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(0, 0, 0, 0.05)',
      subtle: 'rgba(0, 0, 0, 0.06)',
      subtleBorder: 'rgba(0, 0, 0, 0.12)',
      tint: 'light',
    },
    status: {
      success: primitives.status.success,
      successSurface: 'rgba(16, 185, 129, 0.1)',
      error: primitives.status.error,
      errorSurface: 'rgba(239, 68, 68, 0.1)',
      warning: primitives.status.warning,
      info: primitives.status.info,
    },
    interactive: {
      pressed: 'rgba(0, 0, 0, 0.05)',
      disabled: primitives.slate[400],
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.4)',
      thin: 'rgba(0, 0, 0, 0.02)',
    },
    gradient: {
      auth: ['#FFFFFF', '#FFF9E5'] as const,
      premium: [primitives.white, primitives.solar[100]] as const,
      midnight: ['#FFFFFF', '#FDF5E6'] as const,
    },
  },
};

export const darkTheme: LatticeTheme = {
  ...baseTheme,
  dark: true,
  colors: {
    brand: {
      primary: primitives.solar[500],
      primaryVariant: primitives.solar[600],
      primarySurface: 'rgba(239, 179, 63, 0.15)',
      secondary: primitives.solar[400],
      secondaryVariant: primitives.solar[900],
    },
    bg: {
      main: primitives.midnight.base,
      surface: primitives.midnight.obsidian,
      elevation: primitives.midnight.zinc,
    },
    text: {
      primary: primitives.white,
      secondary: primitives.slate[400],
      muted: primitives.midnight.muted,
      inverse: primitives.pristine[900],
    },
    border: {
      subtle: primitives.midnight.border,
      strong: primitives.slate[500],
    },
    glass: {
      background: 'rgba(22, 22, 24, 0.7)',
      border: 'rgba(255, 255, 255, 0.12)',
      subtle: 'rgba(255, 255, 255, 0.08)',
      subtleBorder: 'rgba(255, 255, 255, 0.12)',
      tint: 'dark',
    },
    status: {
      success: primitives.status.success,
      successSurface: 'rgba(16, 185, 129, 0.15)',
      error: primitives.status.error,
      errorSurface: 'rgba(239, 68, 68, 0.15)',
      warning: primitives.status.warning,
      info: primitives.status.info,
    },
    interactive: {
      pressed: 'rgba(255, 255, 255, 0.1)',
      disabled: primitives.midnight.muted,
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.7)',
      thin: 'rgba(255, 255, 255, 0.03)',
    },
    gradient: {
      auth: [primitives.midnight.base, primitives.black] as const,
      premium: [primitives.white, primitives.solar[100]] as const,
      midnight: [primitives.slate[900], primitives.black] as const,
    },
  },
};

// Default export for backward compatibility during transition
export const theme = darkTheme;
export type Theme = LatticeTheme;


