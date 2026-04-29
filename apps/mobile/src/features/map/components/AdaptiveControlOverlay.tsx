import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { typography } from '../../../styles/typography';

interface AdaptiveControlOverlayProps {
  islandHeight: SharedValue<number>;
  bottomOffset: number;
  onRecenter: () => void;
  onToggle3D: () => void;
  is3DActive: boolean;
  onOpenBinoculars?: () => void;
}

/**
 * Professional floating controls synchronized with the growing island.
 * Vertical stack on the right: 3D -> Recenter -> Binoculars.
 */
export const AdaptiveControlOverlay = ({
  islandHeight,
  bottomOffset,
  onRecenter,
  onToggle3D,
  is3DActive,
  onOpenBinoculars,
}: AdaptiveControlOverlayProps) => {
  const theme = useAppTheme();

  // The controls sit right above the island's current top position
  const rOverlayStyle = useAnimatedStyle(() => {
    // Top of island = screen_height - bottomOffset - current_height
    // We want the controls to be slightly above that
    const translateY = - (bottomOffset + islandHeight.value + 16);
    
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, rOverlayStyle]}>
      <View pointerEvents="box-none" style={styles.content}>
        <View style={styles.verticalPill}>
          <SafeBlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
          
          {/* 1. 3D Toggle */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onToggle3D();
            }}
            style={({ pressed }) => [
              styles.pillAction,
              { borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
              is3DActive && { backgroundColor: theme.colors.brand.primary },
              pressed && { opacity: 0.7 }
            ]}
          >
            <Text style={[styles.buttonText, { color: is3DActive ? 'black' : 'white' }]}>3D</Text>
          </Pressable>

          {/* 2. Recenter Button */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRecenter();
            }}
            style={({ pressed }) => [
              styles.pillAction,
              { borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
              pressed && { opacity: 0.6 }
            ]}
          >
            <Feather name="navigation" size={20} color="white" />
          </Pressable>

          {/* 3. Binoculars (AR) */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onOpenBinoculars?.();
            }}
            style={({ pressed }) => [
              styles.pillAction,
              pressed && { opacity: 0.6 }
            ]}
          >
            <MaterialCommunityIcons name="binoculars" size={22} color="white" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  verticalPill: {
    width: 50,
    height: 150,
    borderRadius: 25,
    backgroundColor: 'rgba(30, 30, 30, 0.45)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    flexDirection: 'column',
    alignItems: 'stretch', // Force actions to take full width
  },
  pillAction: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
    color: 'white',
    textAlign: 'center',
    width: '100%',
  },
});
