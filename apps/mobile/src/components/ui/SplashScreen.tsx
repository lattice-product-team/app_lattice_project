import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const theme = useAppTheme();
  const gradientPos = useSharedValue(0);

  useEffect(() => {
    // Continuous subtle background movement
    gradientPos.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          gradientPos.value,
          [0, 1],
          [-SCREEN_WIDTH * 0.2, SCREEN_WIDTH * 0.2]
        ),
      },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      {/* Subtle Moving Background */}
      <Animated.View style={[styles.backgroundWrapper, animatedGradientStyle]}>
        <LinearGradient
          colors={
            theme.dark
              ? [theme.colors.bg.main, '#1A1A18', '#0D0D0C', '#141412', theme.colors.bg.main]
              : ['#ffffff', '#d0e3ff', '#eaeaee', '#faf2e5', '#ffffff']
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Main Branding (Instant) */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH * 2,
    left: -SCREEN_WIDTH * 0.5,
  },
  gradient: {
    flex: 1,
  },
  logoContainer: {
    width: 220, // Increased size
    height: 220,
    zIndex: 10,
    // Soft shadow to lift the yellow icon
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
