import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { AppLoadingView } from '../../../components/ui/AppLoadingView';
import { useStartupStore } from '../../../store/useStartupStore';

interface MapLoadingOverlayProps {
  isVisible: boolean;
}

export const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({ isVisible }) => {
  const theme = useAppTheme();
  const isMapReady = useStartupStore((s) => s.isMapReady);
  const wasReadyOnce = useRef(false);

  if (isMapReady && !wasReadyOnce.current) {
    wasReadyOnce.current = true;
  }

  // Animation values
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    if (!isVisible) {
      // Exit animation: Faster fade out to sync with global splash
      containerOpacity.value = withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      containerScale.value = withTiming(1.02, {
        duration: 600,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      containerOpacity.value = withTiming(1, { duration: 300 });
      containerScale.value = withTiming(1, { duration: 300 });
    }
  }, [isVisible]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
    pointerEvents: containerOpacity.value < 0.1 ? 'none' : ('auto' as any),
  }));

  // During the very first load, we don't show the spinner because the global splash covers it.
  // We only keep the background color to prevent any potential flash-through.
  const showSpinner = wasReadyOnce.current || !isVisible;

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: theme.colors.bg.main }, animatedContainerStyle]}
    >
      {showSpinner && <AppLoadingView />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
  },
});
