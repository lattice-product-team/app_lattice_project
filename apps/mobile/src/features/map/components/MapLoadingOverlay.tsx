import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  Easing
} from 'react-native-reanimated';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { AppLoadingView } from '../../../components/ui/AppLoadingView';

interface MapLoadingOverlayProps {
  isVisible: boolean;
}

export const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({ isVisible }) => {
  const theme = useAppTheme();
  
  // Animation values
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    if (!isVisible) {
      // Exit animation: Smooth fade out and slight scale up
      containerOpacity.value = withTiming(0, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      containerScale.value = withTiming(1.05, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    } else {
      containerOpacity.value = withTiming(1, { duration: 300 });
      containerScale.value = withTiming(1, { duration: 300 });
    }
  }, [isVisible]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
    pointerEvents: containerOpacity.value < 0.1 ? 'none' : 'auto' as any,
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <AppLoadingView />
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
