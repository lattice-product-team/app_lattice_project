import React from 'react';
import { 
  Pressable, 
  Text, 
  ActivityIndicator, 
  ViewStyle, 
  StyleProp,
  View,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '../../styles/typography';

interface PremiumButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'white';
  icon?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string; // Kept for tailwind class logic outside
  style?: StyleProp<ViewStyle>;
}

/**
 * High-end interactive button with standardized gradients.
 * Explicitly uses LinearGradient without interop for maximum robustness.
 */
export const PremiumButton = ({
  onPress,
  label,
  variant = 'primary',
  icon,
  isLoading = false,
  disabled = false,
  className = '',
  style
}: PremiumButtonProps) => {
  const handlePress = () => {
    if (disabled || isLoading) return;
    Haptics.impactAsync(
      variant === 'primary' 
        ? Haptics.ImpactFeedbackStyle.Medium 
        : Haptics.ImpactFeedbackStyle.Light
    );
    onPress();
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [colors.primary, colors.solar[600]] as const;
      case 'secondary':
        return [colors.secondary, '#E5E5E7'] as const;
      case 'glass':
        return ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)'] as const;
      case 'white':
        return ['#FFFFFF', '#F9F9FB'] as const;
      default:
        return null;
    }
  };

  const getSecondaryStyles = () => {
    if (variant === 'outline') return 'border border-black/10 bg-transparent';
    if (variant === 'glass') return 'border border-black/5 shadow-sm';
    if (variant === 'white') return 'shadow-md';
    return '';
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return { color: colors.black, fontFamily: typography.primary.bold } as const;
      case 'secondary':
        return { color: colors.black, fontFamily: typography.secondary.medium } as const;
      case 'outline':
        return { color: colors.black, fontFamily: typography.secondary.medium } as const;
      case 'glass':
        return { color: 'white', fontFamily: typography.secondary.medium } as const;
      case 'white':
        return { color: colors.black, fontFamily: typography.primary.bold } as const;
      default:
        return { color: colors.black, fontFamily: typography.primary.regular } as const;
    }
  };

  const gradientColors = getGradientColors();
  const textColor = getTextStyle().color;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      className={`h-14 rounded-2xl overflow-hidden active:scale-[0.98] ${disabled ? 'opacity-50' : 'active:opacity-90'} ${className}`}
      style={style}
    >
      {gradientColors && (
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      <View 
        className={`flex-1 flex-row items-center justify-center px-6 ${getSecondaryStyles()}`}
      >
        {isLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons 
                name={icon as any} 
                size={20} 
                color={textColor} 
                style={{ marginRight: 8 }}
              />
            )}
            <Text 
              className="text-base tracking-tight"
              style={getTextStyle()}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};
