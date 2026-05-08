import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface AdaptiveControlOverlayProps {
  islandHeight: SharedValue<number>;
  islandState?: SharedValue<number>;
  bottomOffset: number;
  onRecenter: () => void;
  onToggle3D: () => void;
  is3DActive: boolean;
  onOpenBinoculars?: () => void;
  isVisible?: boolean;
}

/**
 * HUD with true space-between distribution and symmetrical sizing.
 */
export const AdaptiveControlOverlay = ({
  islandHeight,
  islandState,
  bottomOffset,
  onRecenter,
  onToggle3D,
  is3DActive,
  onOpenBinoculars,
  isVisible = true,
}: AdaptiveControlOverlayProps) => {
  const theme = useAppTheme();
  const iconColor = theme.colors.text.primary;

  const rOverlayStyle = useAnimatedStyle(() => {
    const baseOpacity = islandState
      ? interpolate(islandState.value, [0.5, 0.6], [1, 0], Extrapolation.CLAMP)
      : 1;

    const opacity = isVisible ? baseOpacity : 0;

    return {
      opacity,
      pointerEvents: opacity === 0 ? 'none' : 'auto',
      transform: [{ translateY: -(bottomOffset + islandHeight.value + 16) }],
    };
  });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, rOverlayStyle]}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
            borderWidth: 1,
            ...theme.shadows.soft,
          },
        ]}
      >
        {/* 1. 3D Toggle */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggle3D();
          }}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.text3D, { color: iconColor }]}>{is3DActive ? '2D' : '3D'}</Text>
        </Pressable>

        {/* 2. Recenter */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onRecenter();
          }}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
        >
          <Feather name="navigation" size={22} color={iconColor} />
        </Pressable>

        {/* 3. Binoculars */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onOpenBinoculars?.();
          }}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
        >
          <MaterialCommunityIcons name="binoculars" size={22} color={iconColor} />
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
  },
  pill: {
    width: 50,
    height: 150,
    borderRadius: 25,
    overflow: 'visible',
    // Border handled by SafeBlurView overlay
    // Distribution logic
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12, // Space from the top and bottom edges
  },
  action: {
    width: 44, // Consistent circular/square base
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text3D: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
