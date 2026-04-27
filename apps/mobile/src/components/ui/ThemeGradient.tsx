import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { useAuthStore } from '../../hooks/useAuthStore';

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
  const [isClient, setIsClient] = React.useState(false);
  const eventConfig = useAuthStore(state => state.eventConfig);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const primaryColor = isClient && eventConfig?.venue?.primaryColor 
    ? eventConfig.venue.primaryColor 
    : colors.primary;

  const getGradientConfig = () => {
    switch (variant) {
      case 'premium':
        return {
          colors: ['#4A2C3A', colors.background] as const, // Deep Wine to Black
          locations: [0, 0.6] as [number, number],
          defaultBlob: primaryColor,
        };
      case 'surface':
        return {
          colors: ['#2D2B2C', '#1C1B1C'] as const,
          locations: [0, 1] as [number, number],
          defaultBlob: '#FFFFFF',
        };
      case 'auth':
      default:
        return {
          colors: ['#2D2B2C', '#121212'] as const,
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
              shadowOpacity: 0.5,
              shadowRadius: 180, // Giant radius for maximum softness
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
