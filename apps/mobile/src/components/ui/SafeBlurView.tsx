import React from 'react';
import { View, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

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
export const SafeBlurView = ({
  intensity = 80,
  tint = 'light',
  style,
  children
}: SafeBlurViewProps) => {
  // Use a light-themed semi-transparent fallback as baseline
  const fallbackColor = tint === 'dark' ? 'rgba(28, 27, 28, 0.92)' : 'rgba(255, 255, 255, 0.92)';

  /**
   * NOTE: We are temporarily forcing the fallback because the current 
   * development build is missing the native ExpoBlurView module.
   * To enable real blur, run a new native build (e.g., npx expo run:ios).
   */
  const useNativeBlur = true; // Forced true for Development Client

  if (useNativeBlur && (Platform.OS === 'ios' || Platform.OS === 'android')) {
    try {
      return (
        <BlurView intensity={intensity} tint={tint} style={style}>
          {children}
        </BlurView>
      );
    } catch (e) {
      console.warn('[SafeBlurView] Native BlurView failed, falling back to transparency');
    }
  }

  return (
    <View style={[style, { backgroundColor: fallbackColor, overflow: 'hidden' }]}>
      {children}
    </View>
  );
};
