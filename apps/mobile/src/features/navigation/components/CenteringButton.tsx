import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Navigation } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutRight, useAnimatedStyle, withTiming } from 'react-native-reanimated';
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
interface CenteringButtonProps {
  uiLayer: Animated.SharedValue<number>;
}

export const CenteringButton = ({ uiLayer }: CenteringButtonProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isFollowingUser, setIsFollowingUser } = useMapUIStore();
  const { isNavigating } = useNavigationStore();

  const handleCenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFollowingUser(true);
  };

  const rStyle = useAnimatedStyle(() => {
    const isLayerActive = uiLayer.value !== 0; // UILayer.BASE
    const shouldShow = isNavigating && !isFollowingUser && !isLayerActive;

    return {
      opacity: withTiming(shouldShow ? 1 : 0, { duration: 150 }),
      pointerEvents: shouldShow ? 'auto' : 'none',
      transform: [{ translateX: withTiming(shouldShow ? 0 : 50) }],
    };
  });

  return (
    <Animated.View
      style={[styles.container, { bottom: insets.bottom + 160 }, rStyle]}
    >
      <Pressable
        onPress={handleCenter}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.brand.primary,
            opacity: pressed ? 0.9 : 1,
            shadowColor: theme.colors.brand.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 10,
          },
        ]}
      >
        <Navigation size={22} color="#000000" strokeWidth={2.5} />
        <Text style={[styles.text, { color: '#000000' }]}>CENTRAR</Text>
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
