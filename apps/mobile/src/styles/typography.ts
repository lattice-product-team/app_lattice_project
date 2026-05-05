export const typography = {
  // Legacy
  primary: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semibold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
  },
  secondary: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
  },
  // ElevenLabs
  sans: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  serif: {
    light: 'CormorantGaramond-Light',
    regular: 'CormorantGaramond-Regular',
    medium: 'CormorantGaramond-Medium',
    bold: 'CormorantGaramond-Bold',
  }
} as const;

export const authStyles = {
  title: {
    fontFamily: 'CormorantGaramond-Light',
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    lineHeight: 28,
  }
} as const;

export const pageStyles = {
  title: {
    fontFamily: 'CormorantGaramond-Medium',
    fontSize: 32,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  }
} as const;

export default typography;
