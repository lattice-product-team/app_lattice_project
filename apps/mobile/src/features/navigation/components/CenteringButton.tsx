import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { Navigation } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutRight, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useMapUIStore } from '../../map/store/useMapUIStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { Button } from '../../../components/ui/Button';

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
      <Button
        onPress={handleCenter}
        label="VOLVER"
        leftIcon={<Navigation size={18} color="#000000" strokeWidth={3} />}
        style={{
          backgroundColor: theme.colors.brand.primary,
          height: 44,
          borderRadius: 22,
          paddingHorizontal: 20,
        }}
        labelStyle={{
          color: '#000000',
          fontSize: 13,
          letterSpacing: 1,
        }}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontFamily: typography.primary.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
