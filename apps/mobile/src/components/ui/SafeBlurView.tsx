import React from 'react';
import { View, ViewStyle, StyleProp, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

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
  const fallbackColor = tint === 'dark' ? 'rgba(28, 27, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const useNativeBlur = true;

  // Internal animated props to bridge JS props to Native BlurView
  const animatedBlurProps = useAnimatedProps(() => {
    return {
      intensity: typeof intensity === 'number' ? intensity : (intensity as any)?.value ?? 95,
      tint: tint
    };
  });

  if (useNativeBlur && (Platform.OS === 'ios' || Platform.OS === 'android')) {
    try {
      return (
        <View ref={ref} style={[style, styles.container]}>
          <AnimatedBlurView 
            animatedProps={animatedBlurProps}
            style={StyleSheet.absoluteFill} 
          />
          {children}
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
      console.warn('[SafeBlurView] Native BlurView failed');
    }
  }

  return (
    <View ref={ref} style={[style, styles.container, { backgroundColor: fallbackColor }]}>
      {children}
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
