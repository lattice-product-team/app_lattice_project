import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ThemeGradientProps {
  variant?: 'auth' | 'brand' | 'surface' | 'midnight';
  showBlob?: boolean;
  blobColor?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Standardized Theme Gradient component.
 */
export const ThemeGradient = ({
  variant = 'auth',
  showBlob = false,
  blobColor,
  style,
  children,
}: ThemeGradientProps) => {
  const theme = useAppTheme();

  const primaryColor = theme.colors.brand.primary;

  const getGradientConfig = () => {
    switch (variant) {
      case 'brand':
        return {
          colors: theme.colors.gradient.brand,
          locations: [0, 0.6] as [number, number],
          defaultBlob: primaryColor,
        };
      case 'midnight':
        return {
          colors: theme.colors.gradient.midnight,
          locations: [0, 1] as [number, number],
          defaultBlob: primaryColor,
        };
      case 'surface':
        return {
          colors: [theme.colors.bg.surface, theme.colors.bg.main] as const,
          locations: [0, 1] as [number, number],
          defaultBlob: theme.colors.border.subtle,
        };
      case 'auth':
      default:
        return {
          colors: theme.colors.gradient.auth,
          locations: [0, 0.7] as [number, number],
          defaultBlob: primaryColor,
        };
    }
  };

  const config = getGradientConfig();
  const finalBlobColor = blobColor || config.defaultBlob;

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <LinearGradient
        colors={config.colors as any}
        locations={config.locations}
        style={StyleSheet.absoluteFill}
      />

      {showBlob && (
        <View
          pointerEvents="none"
          style={[
            styles.blobContainer,
            {
              shadowColor: finalBlobColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: theme.dark ? 0.4 : 0.2,
              shadowRadius: theme.dark ? 220 : 300,
              backgroundColor: finalBlobColor,
            },
          ]}
        />
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  blobContainer: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.1,
    ...Platform.select({
      android: {
        elevation: 20,
      },
    }),
  },
});
