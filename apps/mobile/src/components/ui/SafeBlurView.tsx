import React, { useMemo } from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface SafeBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * SafeBlurView: High-fidelity Glass UI using Expo Blur.
 * Standardized for the Lattice design system.
 */
export const SafeBlurView = React.forwardRef<View, SafeBlurViewProps>(({
  intensity = 80,
  tint = 'light',
  style,
  children
}, ref) => {
  const safeIntensity = useMemo(() => {
    // Android optimization: High intensity blur is extremely expensive on Android
    if (Platform.OS === 'android') {
      return Math.min(intensity, 30); // Cap at 30 for performance
    }
    return intensity;
  }, [intensity]);

  const overlayColor = useMemo(() => {
    if (tint === 'dark') return 'rgba(15, 15, 18, 0.45)';
    return 'rgba(255, 255, 255, 0.35)';
  }, [tint]);

  const fallbackOpacity = useMemo(() => {
    // Increase opacity on Android to compensate for lower blur intensity
    return Platform.OS === 'android' ? 0.7 : 0.2;
  }, []);

  const expoBlurTint = useMemo(() => {
    if (tint === 'dark') return 'dark';
    if (tint === 'light') return 'light';
    return 'default';
  }, [tint]);

  return (
    <View ref={ref} style={[style, styles.container]}>
      {/* Background layer: Expo Blur */}
      <BlurView 
        intensity={safeIntensity} 
        tint={expoBlurTint} 
        style={StyleSheet.absoluteFill} 
      />
      
      {/* Fallback overlay for extra depth */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor, opacity: fallbackOpacity }]} pointerEvents="none" />
      
      {/* Specular shine (CSS-like) */}
      <View style={[StyleSheet.absoluteFill, styles.shineLayer]} pointerEvents="none" />
      
      {children}
      
      {/* Border overlay */}
      <View 
        pointerEvents="none" 
        style={[
          StyleSheet.absoluteFill, 
          styles.borderOverlay,
          { 
            borderColor: (style as any)?.borderColor || (tint === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
            borderRadius: (style as any)?.borderRadius || 0,
            borderWidth: (style as any)?.borderWidth || 1,
          }
        ]} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  shineLayer: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 0,
  },
  borderOverlay: {
    borderStyle: 'solid',
    zIndex: 999,
  },
});
