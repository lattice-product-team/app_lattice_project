import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'lucide-react-native';
import Animated, {
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useMapUIStore, MapCameraMode } from '../../map/store/useMapUIStore';
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
  const { cameraMode, setCameraMode, triggerRecenter } = useMapUIStore();
  const { isNavigating } = useNavigationStore();

  const handleCenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // triggerRecenter now handles mode cycling and intelligent defaults
    triggerRecenter();
  };

  const rStyle = useAnimatedStyle(() => {
    const shouldShow = isNavigating && cameraMode === MapCameraMode.FREE;

    return {
      opacity: withTiming(shouldShow ? 1 : 0, { duration: 200 }),
      pointerEvents: shouldShow ? 'auto' : 'none',
      transform: [
        { translateX: withTiming(shouldShow ? 0 : -80) }, // Slide from left, not right!
        { scale: withTiming(shouldShow ? 1 : 0.8) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, { bottom: insets.bottom + 180 }, rStyle]}>
      <TouchableOpacity onPress={handleCenter} activeOpacity={0.8}>
        <View
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.bg.surface,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <Navigation
            size={18}
            color={theme.colors.text.primary}
            fill={theme.colors.text.primary}
          />
          <Text style={[styles.text, { color: theme.colors.text.primary }]}>Recenter</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    zIndex: 5000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
});
