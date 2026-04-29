import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { typography } from '../../../styles/typography';

interface AdaptiveControlOverlayProps {
  sheetPosition: SharedValue<number>;
  onRecenter: () => void;
  onToggle3D: () => void;
  is3DActive: boolean;
  onOpenMapStyle?: () => void;
  onOpenBinoculars?: () => void;
}

/**
 * Floating controls that track the bottom sheet's position.
 * Implements the synchronized "Apple Maps" control layout.
 */
export const AdaptiveControlOverlay = ({
  sheetPosition,
  onRecenter,
  onToggle3D,
  is3DActive,
  onOpenMapStyle,
  onOpenBinoculars,
}: AdaptiveControlOverlayProps) => {
  const theme = useAppTheme();

  // Dynamic positioning logic: track the sheet top but with a safety offset
  const rOverlayStyle = useAnimatedStyle(() => ({
    // Positioned at top: 0, we translate it to the sheet position minus its height
    transform: [{ translateY: sheetPosition.value - 90 }],
  }));

  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, rOverlayStyle]}>
      <View pointerEvents="box-none" style={styles.content}>
        {/* Left Side: Binoculars */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onOpenBinoculars?.();
          }}
          style={({ pressed }) => [
            styles.circleButton,
            { backgroundColor: 'rgba(35, 35, 35, 0.9)' },
            pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] },
          ]}
        >
          <MaterialCommunityIcons name="binoculars" size={24} color="white" />
        </Pressable>

        {/* Right Side: Action Trident Controls */}
        <View pointerEvents="box-none" style={styles.rightControls}>
          {/* 3D Toggle */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onToggle3D();
            }}
            style={({ pressed }) => [
              styles.circleButton,
              { backgroundColor: is3DActive ? theme.colors.brand.primary : 'rgba(35, 35, 35, 0.9)' },
              pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] },
            ]}
          >
            <Text style={[styles.buttonText, { color: is3DActive ? 'black' : 'white' }]}>3D</Text>
          </Pressable>

          {/* Vertical Pill Group */}
          <View style={styles.verticalPill}>
            <SafeBlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onOpenMapStyle?.();
              }}
              style={({ pressed }) => [
                styles.pillAction,
                { borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
                pressed && { opacity: 0.6 }
              ]}
            >
              <MaterialCommunityIcons name="earth" size={24} color="white" />
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onRecenter();
              }}
              style={({ pressed }) => [
                styles.pillAction,
                pressed && { opacity: 0.6 }
              ]}
            >
              <Feather name="navigation" size={22} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 160, // Give it height so we can align to bottom
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Align all buttons to the bottom of this 160px container
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  rightControls: {
    alignItems: 'flex-end',
    gap: 12,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: typography.primary.bold,
  },
  verticalPill: {
    width: 48,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  pillAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
