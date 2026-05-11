import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MapCameraMode } from '../store/useMapUIStore';
import Animated, {
  useAnimatedStyle,
  SharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Navigation, Binoculars } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface AdaptiveControlOverlayProps {
  onToggle3D: () => void;
  onRecenter: () => void;
  onOpenBinoculars?: () => void;
  is3DActive: boolean;
  uiLayer: SharedValue<number>;
  islandState: SharedValue<number>;
  isConnected?: boolean;
  cameraMode?: MapCameraMode;
  bottomOffset?: number;
}

export const AdaptiveControlOverlay = ({
  onToggle3D,
  onRecenter,
  onOpenBinoculars,
  is3DActive,
  uiLayer,
  islandState,
  isConnected = false,
  cameraMode = MapCameraMode.FREE,
  bottomOffset = 0,
}: AdaptiveControlOverlayProps) => {
  const theme = useAppTheme();
  const iconColor = theme.colors.text.primary;

  const rOverlayStyle = useAnimatedStyle(() => {
    // Option B: Fade-out if any overlay layer is active or island is full-screen
    const isLayerActive = uiLayer.value !== 0; // UILayer.BASE
    const isIslandFull = islandState.value > 0.8;
    const shouldHide = isLayerActive || isIslandFull;

    return {
      opacity: withTiming(shouldHide ? 0 : 1, { duration: 150 }),
      pointerEvents: shouldHide ? 'none' : 'auto',
      transform: [{ translateY: -bottomOffset - 12 }],
    };
  });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, rOverlayStyle]}>
      {/* 1. Top Vertical Pill (3D & Recenter) */}
      <View
        style={[
          styles.verticalPill,
          {
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
            marginBottom: 12,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggle3D();
          }}
          hitSlop={12}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.text3D, { color: iconColor }]}>{is3DActive ? '2D' : '3D'}</Text>
        </Pressable>

        <View style={[styles.horizontalDivider, { backgroundColor: theme.colors.glass.border }]} />

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onRecenter();
          }}
          hitSlop={12}
          style={({ pressed }) => [
            styles.action, 
            pressed && { opacity: 0.7 },
            cameraMode !== MapCameraMode.FREE && { 
              backgroundColor: theme.colors.brand.primary, 
              borderRadius: 22 
            }
          ]}
        >
          <Navigation 
            size={20} 
            color={cameraMode !== MapCameraMode.FREE ? 'white' : iconColor} 
            strokeWidth={2.2}
          />
          {isConnected && (
            <View 
              style={[
                styles.liveIndicator, 
                { backgroundColor: '#4ADE80', borderColor: theme.colors.bg.surface }
              ]} 
            />
          )}
        </Pressable>
      </View>

      {/* 2. Bottom Circle (AR / Binoculars) */}
      <View
        style={[
          styles.circle,
          {
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onOpenBinoculars?.();
          }}
          hitSlop={12}
          style={({ pressed }) => [styles.circleAction, pressed && { opacity: 0.7 }]}
        >
          <Binoculars size={20} color={iconColor} strokeWidth={2.2} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    zIndex: 1000,
    alignItems: 'center',
  },
  verticalPill: {
    width: 56, // Slightly wider
    borderRadius: 28,
    borderWidth: 1.5, // Thicker border for better visibility
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 56, // Slightly larger
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    width: 52, // Larger touch area
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleAction: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalDivider: {
    width: 20,
    height: 1,
    marginVertical: 2,
  },
  text3D: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
  liveIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
