import React from 'react';
import { View, ViewStyle, StyleProp, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface SafeBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * SafeBlurView uses native expo-blur for high-fidelity frosted glass effects.
 * It provides a consistent aesthetic across iOS and Android.
 */
export const SafeBlurView = React.forwardRef<View, SafeBlurViewProps>(({
  intensity = 80,
  tint = 'light',
  style,
  children
}, ref) => {
  // Use a light-themed semi-transparent fallback as baseline
  const fallbackColor = tint === 'dark' ? 'rgba(28, 27, 28, 0.92)' : 'rgba(255, 255, 255, 0.92)';

  const useNativeBlur = true; // Forced true for Development Client

  if (useNativeBlur && (Platform.OS === 'ios' || Platform.OS === 'android')) {
    try {
      return (
        <View ref={ref} style={[style, styles.container]}>
          <AnimatedBlurView 
            intensity={intensity} 
            tint={tint} 
            style={StyleSheet.absoluteFill} 
          />
          {children}
          {/* Border Overlay */}
          <View 
            pointerEvents="none" 
            style={[
              StyleSheet.absoluteFill, 
              styles.borderOverlay,
              { 
                borderColor: (style as any)?.borderColor,
                borderRadius: (style as any)?.borderRadius || 0,
                borderWidth: (style as any)?.borderWidth ? 1 : 0,
              }
            ]} 
          />
        </View>
      );
    } catch (e) {
      console.warn('[SafeBlurView] Native BlurView failed, falling back to transparency');
    }
  }

  return (
    <View ref={ref} style={[style, styles.container, { backgroundColor: fallbackColor }]}>
      {children}
      {/* Border Overlay Fallback */}
      <View 
        pointerEvents="none" 
        style={[
          StyleSheet.absoluteFill, 
          styles.borderOverlay,
          { 
            borderColor: (style as any)?.borderColor,
            borderRadius: (style as any)?.borderRadius || 0,
            borderWidth: (style as any)?.borderWidth ? 1 : 0,
          }
        ]} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    // We remove border styles from the main container in the actual usage
  },
  borderOverlay: {
    borderStyle: 'solid',
    zIndex: 999,
  },
});
