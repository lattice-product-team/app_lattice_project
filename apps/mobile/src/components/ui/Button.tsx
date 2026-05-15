import React from 'react';
import {
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
  StyleSheet,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { typography } from '../../styles/typography';
import { useAppTheme } from '../../hooks/useAppTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'subdued' | 'tertiary' | 'ghost';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<ViewStyle>;
}

/**
 * Standardized Button component with 4 variants (8 states total with Light/Dark mode).
 * Uses Pressable from react-native-gesture-handler for better Android support inside sheets.
 */
export const Button = ({
  onPress,
  label,
  variant = 'primary',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  style,
  labelStyle,
}: ButtonProps) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const { responsive } = theme.motion.physics;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, responsive);
    opacity.value = withSpring(0.9, responsive);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, responsive);
    opacity.value = withSpring(1, responsive);
  };

  const handlePress = () => {
    if (disabled || isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getVariantStyles = () => {
    const isDark = theme.dark;
    
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.brand.primary,
          },
          text: {
            color: theme.colors.text.inverse,
          },
          icon: theme.colors.text.inverse,
        };
      case 'subdued':
        return {
          container: {
            backgroundColor: theme.colors.brand.primarySurface,
          },
          text: {
            color: isDark ? theme.colors.brand.primary : theme.colors.text.primary,
          },
          icon: isDark ? theme.colors.brand.primary : theme.colors.text.primary,
        };
      case 'tertiary':
        return {
          container: {
            backgroundColor: isDark 
              ? '#2C2C2E' // Dark Surface/Elevation
              : '#F2F2F7', // Light Gray 6
          },
          text: {
            color: theme.colors.text.primary,
          },
          icon: theme.colors.text.primary,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: theme.colors.brand.primary,
          },
          icon: theme.colors.brand.primary,
        };
      default:
        return {
          container: { backgroundColor: theme.colors.brand.primary },
          text: { color: theme.colors.text.inverse },
          icon: theme.colors.text.inverse,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[styles.base, variantStyles.container, animatedStyle, style]}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text 
            style={[
              styles.labelText, 
              variantStyles.text, 
              labelStyle
            ]}
          >
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 20, // Modern pill-ish but not full circle as per image
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 16,
    fontFamily: typography.sans.bold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
});
