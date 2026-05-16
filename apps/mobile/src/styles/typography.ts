import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

/**
 * Common text properties to fix Android rendering bugs:
 * 1. includeFontPadding: false prevents extra vertical space
 * 2. Tight letterSpacing on Android causes horizontal clipping with custom fonts
 */
const getPlatformStyles = (letterSpacing: number) => ({
  includeFontPadding: false,
  letterSpacing: isAndroid ? Math.max(letterSpacing, -0.2) : letterSpacing,
});

export const typography = {
  primary: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semibold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
    ...getPlatformStyles(0),
  },
  secondary: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
    ...getPlatformStyles(0),
  },
  sans: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    ...getPlatformStyles(0),
  },
  serif: {
    light: 'CormorantGaramond-Light',
    regular: 'CormorantGaramond-Regular',
    medium: 'CormorantGaramond-Medium',
    bold: 'CormorantGaramond-Bold',
    ...getPlatformStyles(0),
  },
} as const;

export const authStyles = {
  title: {
    fontFamily: 'CormorantGaramond-Light',
    fontSize: 48,
    lineHeight: 52,
    ...getPlatformStyles(-1),
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    lineHeight: 28,
    ...getPlatformStyles(0),
  },
} as const;

export const pageStyles = {
  title: {
    fontFamily: 'CormorantGaramond-Medium',
    fontSize: 32,
    ...getPlatformStyles(-1),
  },
  subtitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    textTransform: 'uppercase' as const,
    ...getPlatformStyles(1),
  },
} as const;

export default typography;
