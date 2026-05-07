import React, { useMemo } from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

// --- Extreme Safety: Dynamic Skia Loading ---
let Skia: any = null;
let Canvas: any = null;
let BackdropBlur: any = null;
let Fill: any = null;
let FractalNoise: any = null;
let Group: any = null;

try {
  // Use require to prevent crash at import time
  if (Platform.OS !== 'web') {
    const SkiaModule = require('@shopify/react-native-skia');
    Skia = SkiaModule.Skia;
    Canvas = SkiaModule.Canvas;
    BackdropBlur = SkiaModule.BackdropBlur;
    Fill = SkiaModule.Fill;
    FractalNoise = SkiaModule.FractalNoise;
    Group = SkiaModule.Group;
    
    // Test if Skia is actually functional
    if (Skia && typeof Skia.RuntimeEffect === 'undefined') {
      Skia = null; // Mark as unavailable
    }
  }
} catch (e) {
  // Skia failed to load, we will use Expo Blur fallback
}

interface SafeBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * SafeBlurView: High-fidelity Liquid Glass UI.
 * Multi-tier Fallback Strategy:
 * 1. Skia (Premium Liquid Glass)
 * 2. Expo Blur (Native Hardware-Accelerated Blur)
 * 3. Translucent View (Standard Fallback)
 */
export const SafeBlurView = React.forwardRef<View, SafeBlurViewProps>(({
  intensity = 80,
  tint = 'light',
  style,
  children
}, ref) => {
  // Only activate Skia if ALL required primitives are available
  const isSkiaAvailable = !!Canvas && !!BackdropBlur && !!Skia && !!FractalNoise;
  
  const blurSigma = typeof intensity === 'number' ? intensity / 6 : 15;
  
  const overlayColor = useMemo(() => {
    if (tint === 'dark') return 'rgba(15, 15, 18, 0.45)';
    return 'rgba(255, 255, 255, 0.35)';
  }, [tint]);

  const expoBlurTint = useMemo(() => {
    if (tint === 'dark') return 'dark';
    if (tint === 'light') return 'light';
    return 'default';
  }, [tint]);

  // Liquid Glass Effect Component (Skia)
  const SkiaEffect = () => {
    if (!isSkiaAvailable) return null;
    try {
      return (
        <Canvas style={StyleSheet.absoluteFill}>
          <Group>
            <BackdropBlur blur={blurSigma}>
              <Fill color={overlayColor.replace(/0\.\d+\)$/, '0.2)')} />
            </BackdropBlur>
            <Group opacity={0.03}>
               <FractalNoise freqX={0.05} freqY={0.05} octaves={2} />
            </Group>
          </Group>
        </Canvas>
      );
    } catch (err) {
      return null;
    }
  };

  return (
    <View ref={ref} style={[style, styles.container]}>
      {/* Background layer: Tiered Fallback */}
      {isSkiaAvailable ? (
        <SkiaEffect />
      ) : (
        <BlurView 
          intensity={intensity} 
          tint={expoBlurTint} 
          style={StyleSheet.absoluteFill} 
        />
      )}
      
      {/* Fallback for when even expo-blur is having issues (rare) */}
      {!isSkiaAvailable && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor, opacity: 0.2 }]} pointerEvents="none" />
      )}
      
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


