import React from 'react';
import { Text, ActivityIndicator, ViewStyle, StyleProp, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  PressableProps,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { typography } from '../../styles/typography';
import { useAppTheme } from '../../hooks/useAppTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PremiumButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'surface' | 'apple' | 'google' | 'dark';
  icon?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * High-end interactive button with pill shape and Apple/Google inspired aesthetics.
 */
export const PremiumButton = ({
  onPress,
  label,
  variant = 'primary',
  icon,
  isLoading = false,
  disabled = false,
  className = '',
  style,
}: PremiumButtonProps) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const { responsive } = theme.motion.physics;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, responsive);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, responsive);
  };

  const handlePress = () => {
    if (disabled || isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [theme.colors.brand.primary, theme.colors.brand.primary] as const;
      case 'apple':
      case 'dark':
        return ['#000000', '#000000'] as const;
      case 'google':
        return ['#FFFFFF', '#FFFFFF'] as const;
      case 'glass':
        return [theme.colors.glass.background, theme.colors.glass.background] as const;
      default:
        return null;
    }
  };

  const getContainerStyle = () => {
    const base: ViewStyle = {
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 24,
    };

    if (variant === 'outline') {
      return { ...base, borderWidth: 1, borderColor: theme.colors.border.strong };
    }
    if (variant === 'google') {
      return { ...base, borderWidth: 1, borderColor: '#E5E5E5' };
    }
    if (variant === 'dark') {
      return { ...base, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' };
    }
    if (variant === 'glass') {
      return { ...base, borderWidth: 1, borderColor: theme.colors.glass.border };
    }
    return base;
  };

  const getTextStyle = () => {
    const base = {
      fontSize: 15,
      fontFamily: typography.sans.semibold,
      letterSpacing: -0.2,
    };

    switch (variant) {
      case 'primary':
        return { ...base, color: '#000000' };
      case 'apple':
      case 'dark':
        return { ...base, color: '#FFFFFF' };
      case 'google':
        return { ...base, color: '#000000' };
      case 'outline':
      case 'glass':
        return { ...base, color: theme.colors.text.primary };
      default:
        return { ...base, color: theme.colors.text.primary };
    }
  };

  const gradientColors = getGradientColors();
  const textColor = getTextStyle().color;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[animatedStyle, style]}
      className={`${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <View style={getContainerStyle()} className="overflow-hidden">
        {gradientColors && (
          <LinearGradient colors={gradientColors as any} style={StyleSheet.absoluteFill} />
        )}

        {isLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View className="flex-row items-center justify-center">
            {variant === 'apple' && (
              <FontAwesome5
                name="apple"
                size={18}
                color={textColor}
                style={{ marginRight: 10, marginBottom: 2 }}
              />
            )}
            {variant === 'google' && (
              <View style={{ marginRight: 10 }}>
                <FontAwesome5 name="google" size={16} color="#4285F4" />
              </View>
            )}
            {icon && !['apple', 'google'].includes(variant) && (
              <MaterialCommunityIcons
                name={icon as any}
                size={20}
                color={textColor}
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={getTextStyle()}>{label}</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};
