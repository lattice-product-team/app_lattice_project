import { primitives } from './colors';

export interface LatticeTheme {
  dark: boolean;
  colors: {
    brand: {
      primary: string;
      secondary: string;
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
      tint: 'light' | 'dark';
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
      secondary: primitives.solar[400],
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
      tint: 'light',
    },
  },
};

export const darkTheme: LatticeTheme = {
  ...baseTheme,
  dark: true,
  colors: {
    brand: {
      primary: primitives.solar[500],
      secondary: primitives.solar[400],
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
      background: 'rgba(22, 22, 24, 0.85)',
      border: 'rgba(255, 255, 255, 0.1)',
      tint: 'dark',
    },
  },
};

// Default export for backward compatibility during transition
export const theme = darkTheme;
export type Theme = LatticeTheme;


