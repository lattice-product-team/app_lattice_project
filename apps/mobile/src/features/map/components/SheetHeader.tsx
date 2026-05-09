import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  useDerivedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface SheetHeaderProps {
  title: string;
  subtitle: string;
  logoUrl?: string;
  categoryIcon?: string;
  onClose: () => void;
  onShare?: () => void;
  scrollY: Animated.SharedValue<number>;
  islandState: Animated.SharedValue<number>;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const SheetHeader = ({
  title,
  subtitle,
  onClose,
  onShare,
  scrollY,
  islandState,
}: SheetHeaderProps) => {
  const theme = useAppTheme();
  
  // Create a stabilized scroll value that ignores negative bounces
  // and only operates when the sheet is fully expanded
  const clampedScrollY = useDerivedValue(() => {
    if (islandState.value < 0.98) return 0;
    return Math.max(0, scrollY.value);
  });

  const containerStyle = useAnimatedStyle(() => {
    // Shrink vertical padding as we scroll
    const paddingTop = interpolate(clampedScrollY.value, [0, 80], [12, 8], Extrapolation.CLAMP);
    const paddingBottom = interpolate(clampedScrollY.value, [0, 80], [20, 8], Extrapolation.CLAMP);
    
    return {
      paddingTop,
      paddingBottom,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    // Fades in a solid background when scrolling
    const opacity = interpolate(
      clampedScrollY.value,
      [0, 40],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.bg.surface,
      opacity: opacity,
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(clampedScrollY.value, [0, 40], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -64,
      height: 64,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    // Scale font size from 26 to 19
    const fontSize = interpolate(
      clampedScrollY.value,
      [0, 80],
      [26, 19],
      Extrapolation.CLAMP
    );
    
    // Move up slightly to center better when compact
    const translateY = interpolate(
      clampedScrollY.value,
      [0, 80],
      [0, 2],
      Extrapolation.CLAMP
    );

    return {
      fontSize,
      transform: [{ translateY }],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    // Fade out and collapse subtitle
    const opacity = interpolate(clampedScrollY.value, [0, 40], [1, 0], Extrapolation.CLAMP);
    const height = interpolate(clampedScrollY.value, [0, 50], [18, 0], Extrapolation.CLAMP);
    const marginTop = interpolate(clampedScrollY.value, [0, 50], [2, 0], Extrapolation.CLAMP);

    return {
      opacity,
      height,
      marginTop,
    };
  });

  return (
    <View style={styles.outerContainer}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={backgroundStyle} />
        
        {/* Top Actions Bar */}
        <View style={styles.topActions}>
          <Pressable 
            onPress={onShare} 
            style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          >
            <Feather name="upload" size={20} color="white" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable 
            onPress={onClose} 
            style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          >
            <Feather name="x" size={20} color="white" />
          </Pressable>
        </View>

        {/* Main Branding Section */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Animated.Text style={[styles.title, titleStyle]} numberOfLines={1}>
              {title}
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
              {subtitle}
            </Animated.Text>
          </View>
        </View>
      </Animated.View>
      
      <AnimatedLinearGradient
        colors={[
          theme.colors.bg.surface,
          'rgba(0,0,0,0.4)',
          'transparent'
        ]}
        locations={[0, 0.3, 1]}
        style={gradientStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 100,
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 4,
    zIndex: 10,
  },
  actionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.primary.bold,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
