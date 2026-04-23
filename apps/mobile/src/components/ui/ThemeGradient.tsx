import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { primitives } from '../../styles/colors';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface ThemeGradientProps {
  variant?: 'auth' | 'premium' | 'surface' | 'midnight';
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
  children 
}: ThemeGradientProps) => {
  const theme = useLatticeTheme();

  const getGradientConfig = () => {
    switch (variant) {
      case 'premium':
        return {
          colors: [primitives.white, primitives.solar[100]] as const,
          locations: [0, 0.9] as [number, number],
          defaultBlob: primitives.solar[500],
        };
      case 'midnight':
        return {
          colors: [primitives.slate[900], primitives.black] as const,
          locations: [0, 1] as [number, number],
          defaultBlob: primitives.solar[500],
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
          colors: theme.dark 
            ? [primitives.midnight.base, primitives.black] as const
            : ['#FFFFFF', '#FFF9E5'] as const, // Subtle warm cream/gold tint
          locations: [0, 1] as [number, number],
          defaultBlob: theme.dark ? theme.colors.brand.primary : '#FFEBB7', // Warmer blob for light mode
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
              shadowOpacity: 0.4,
              shadowRadius: 220,
              backgroundColor: finalBlobColor,
            }
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
      }
    })
  }
});

