import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { CircularActionButton } from '../../../components/ui/CircularActionButton';

interface SheetHeaderProps {
  title: string;
  subtitle: string;
  logoUrl?: string;
  bannerUrl?: string;
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
  bannerUrl,
  logoUrl,
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

    // 1. Initial color based on banner presence
    const baseColor = bannerUrl ? '#FFFFFF' : theme.colors.text.primary;
    
    // 2. Interpolate based on islandState (expansion)
    const expansionColor = interpolateColor(
      islandState.value,
      [0.34, 0.6],
      [baseColor, theme.colors.text.primary]
    );

    // 3. Interpolate based on scroll inside full view
    const textColor = interpolateColor(
      clampedScrollY.value,
      [0, 40],
      [expansionColor, theme.colors.text.primary]
    );

    const textShadowOpacity = interpolate(
      islandState.value,
      [0.34, 0.6],
      [bannerUrl ? 0.4 : 0, 0],
      Extrapolation.CLAMP
    );

    return {
      fontSize,
      color: textColor,
      transform: [{ translateY }],
      textShadowColor: `rgba(0,0,0,${textShadowOpacity})`,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    // Fade out and collapse subtitle
    const opacity = interpolate(clampedScrollY.value, [0, 40], [1, 0], Extrapolation.CLAMP);
    const height = interpolate(clampedScrollY.value, [0, 50], [18, 0], Extrapolation.CLAMP);
    const marginTop = interpolate(clampedScrollY.value, [0, 50], [2, 0], Extrapolation.CLAMP);

    const baseColor = bannerUrl ? 'rgba(255,255,255,0.9)' : theme.colors.text.secondary;
    
    const expansionColor = interpolateColor(
      islandState.value,
      [0.34, 0.6],
      [baseColor, theme.colors.text.secondary]
    );

    const textColor = interpolateColor(
      clampedScrollY.value,
      [0, 40],
      [expansionColor, theme.colors.text.secondary]
    );

    return {
      opacity,
      height,
      marginTop,
      color: textColor,
    };
  });

  const bannerStyle = useAnimatedStyle(() => {
    // 1. Fade out as it expands from MID to FULL
    const islandOpacity = interpolate(
      islandState.value,
      [0.34, 0.6], // Fade out early during expansion
      [1, 0],
      Extrapolation.CLAMP
    );

    // 2. Also keep the existing scroll-based fade out just in case
    const scrollOpacity = interpolate(clampedScrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP);
    
    const scale = interpolate(clampedScrollY.value, [-50, 0], [1.1, 1], Extrapolation.CLAMP);
    const translateY = interpolate(clampedScrollY.value, [0, 100], [0, -20], Extrapolation.CLAMP);

    return {
      opacity: islandOpacity * scrollOpacity,
      transform: [{ scale }, { translateY }],
    };
  });

  const thumbnailStyle = useAnimatedStyle(() => {
    // Fades in as we reach Level 3
    const opacity = interpolate(
      islandState.value,
      [0.8, 1.0],
      [0, 1],
      Extrapolation.CLAMP
    );

    // Also moves horizontally to make space for text
    const translateX = interpolate(
      islandState.value,
      [0.8, 1.0],
      [-20, 0],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      islandState.value,
      [0.8, 1.0],
      [0, 40],
      Extrapolation.CLAMP
    );

    const marginRight = interpolate(
      islandState.value,
      [0.8, 1.0],
      [0, 12],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width,
      marginRight,
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.outerContainer}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={backgroundStyle} />
        
        {bannerUrl && (
          <>
            <Animated.Image 
              source={{ uri: bannerUrl }}
              style={[StyleSheet.absoluteFill, styles.banner, bannerStyle]}
              resizeMode="cover"
            />
            <AnimatedLinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
              locations={[0, 0.4, 1]}
              style={[StyleSheet.absoluteFill, bannerStyle]}
            />
          </>
        )}

        {/* Top Actions Bar */}
        <View style={styles.topActions}>
          {onShare ? (
            <CircularActionButton 
              icon="Share"
              onPress={onShare} 
            />
          ) : (
            <View style={{ width: 44 }} />
          )}
          <View style={{ flex: 1 }} />
          <CircularActionButton 
            icon="X"
            onPress={onClose} 
          />
        </View>

        {/* Main Branding Section */}
        <View style={styles.content}>
          <Animated.View style={[styles.headerContentRow, { 
            flexDirection: 'row', 
            alignItems: 'center',
          }]}>
            {bannerUrl && (
              <Animated.Image 
                source={{ uri: bannerUrl }}
                style={[styles.thumbnail, thumbnailStyle]}
              />
            )}
            <View style={styles.textContainer}>
              <Animated.Text style={[styles.title, titleStyle]} numberOfLines={1}>
                {title}
              </Animated.Text>
              <Animated.Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
                {subtitle}
              </Animated.Text>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
      
      <AnimatedLinearGradient
        colors={[
          theme.colors.bg.surface,
          theme.colors.bg.surface + 'CC', // ~80% opacity
          theme.colors.bg.surface + '00'  // 0% opacity
        ]}
        locations={[0, 0.4, 1]}
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.primary.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  banner: {
    opacity: 0.6,
  },
  thumbnail: {
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerContentRow: {
    width: '100%',
    justifyContent: 'center',
  },
});
