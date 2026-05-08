import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface AdaptiveControlOverlayProps {
  onToggle3D: () => void;
  onRecenter: () => void;
  onOpenBinoculars?: () => void;
  is3DActive: boolean;
  isVisible: boolean;
  islandState?: SharedValue<number>;
  bottomOffset?: number;
}

export const AdaptiveControlOverlay = ({
  onToggle3D,
  onRecenter,
  onOpenBinoculars,
  is3DActive,
  isVisible,
  islandState,
  bottomOffset = 0,
}: AdaptiveControlOverlayProps) => {
  const theme = useAppTheme();
  const iconColor = theme.colors.text.primary;

  const rOverlayStyle = useAnimatedStyle(() => {
    // Internal visibility logic to avoid React render warnings
    const isIslandHidden = islandState ? islandState.value < 0.8 : true;
    const finalVisible = isVisible && isIslandHidden;

    return {
      opacity: withTiming(finalVisible ? 1 : 0, { duration: 150 }),
      pointerEvents: finalVisible ? 'auto' : 'none',
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
          style={({ pressed }) => [
            styles.action, 
            pressed && { opacity: 0.7 },
            { backgroundColor: theme.colors.brand.primary, borderRadius: 22 }
          ]}
        >
          <Feather name="navigation" size={20} color={iconColor} />
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
          style={({ pressed }) => [styles.circleAction, pressed && { opacity: 0.7 }]}
        >
          <MaterialCommunityIcons name="binoculars" size={20} color={iconColor} />
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
    width: 52,
    borderRadius: 26,
    borderWidth: 1,
    paddingVertical: 12, // Increased for more space
    alignItems: 'center',
    gap: 8, // Added gap between items
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    width: 44,
    height: 44,
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
});
