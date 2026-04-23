import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';

interface ThemeGradientProps {
  variant?: 'auth' | 'premium' | 'surface';
  showBlob?: boolean;
  blobColor?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Standardized Theme Gradient component.
 * Uses pure expo-linear-gradient with StyleSheet.absoluteFill for maximum 
 * cross-platform compatibility and performance.
 * 
 * Includes a native-optimized "Blob/Glow" effect using shadowRadius (iOS).
 * REFINED: Uses a tiny center with minimal opacity to create a giant 
 * soft glow without visible hard edges.
 */
export const ThemeGradient = ({ 
  variant = 'auth', 
  showBlob = false,
  blobColor,
  style, 
  children 
}: ThemeGradientProps) => {
  const getGradientConfig = () => {
    switch (variant) {
      case 'premium':
        return {
          colors: ['#FFFFFF', '#FDF1C2'] as const, // White to Pale Gold
          locations: [0, 0.9] as [number, number],
          defaultBlob: colors.primary,
        };
      case 'surface':
        return {
          colors: ['#FFFFFF', '#F9F9FB'] as const,
          locations: [0, 1] as [number, number],
          defaultBlob: '#E5E5E7',
        };
      case 'auth':
      default:
        return {
          colors: ['#FFFFFF', '#F0F0F5'] as const,
          locations: [0, 0.8] as [number, number],
          defaultBlob: colors.primary,
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
    width: 60, // Much smaller to hide the solid center
    height: 60,
    borderRadius: 30,
    opacity: 0.1, // Very low opacity so the center is nearly invisible
    ...Platform.select({
      android: {
        elevation: 20,
      }
    })
  }
});
