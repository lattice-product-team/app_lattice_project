import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useMapUIStore } from '../../map/store/useMapUIStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

/**
 * CenteringButton: Appears only during navigation when the user has manually
 * panned away from the active course tracking.
 */
export const CenteringButton = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isFollowingUser, setIsFollowingUser } = useMapUIStore();
  const { isNavigating } = useNavigationStore();

  if (!isNavigating || isFollowingUser) return null;

  const handleCenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFollowingUser(true);
  };

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutRight}
      style={[styles.container, { bottom: insets.bottom + 120 }]}
    >
      <Pressable
        onPress={handleCenter}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.brand.primary,
            opacity: pressed ? 0.9 : 1,
            ...theme.shadows.soft,
          },
        ]}
      >
        <Feather name="navigation" size={20} color="white" />
        <Text style={styles.text}>CENTRAR</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    zIndex: 4000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.5,
  },
});
