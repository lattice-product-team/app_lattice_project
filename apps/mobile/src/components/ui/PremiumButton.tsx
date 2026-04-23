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
import { primitives } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '../../styles/typography';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface PremiumButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'surface';
  icon?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * High-end interactive button with standardized gradients and theme awareness.
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
  const theme = useLatticeTheme();

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
        return [theme.colors.brand.primary, primitives.solar[600]] as const;
      case 'secondary':
        return [theme.colors.brand.secondary, theme.colors.bg.elevation] as const;
      case 'glass':
        return [theme.colors.glass.background, 'rgba(255, 255, 255, 0.05)'] as const;
      case 'surface':
        return [theme.colors.bg.surface, theme.colors.bg.elevation] as const;
      default:
        return null;
    }
  };

  const getSecondaryStyles = () => {
    if (variant === 'outline') return { borderWidth: 1, borderColor: theme.colors.border.subtle };
    if (variant === 'glass') return { borderWidth: 1, borderColor: theme.colors.glass.border };
    if (variant === 'surface') return theme.shadows.soft;
    return {};
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return { color: primitives.pristine[900], fontFamily: typography.primary.bold };
      case 'glass':
        return { color: theme.colors.text.primary, fontFamily: typography.secondary.medium };
      case 'surface':
        return { color: theme.colors.text.primary, fontFamily: typography.primary.bold };
      default:
        return { color: theme.colors.text.primary, fontFamily: typography.secondary.medium };
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
        className="flex-1 flex-row items-center justify-center px-6"
        style={getSecondaryStyles()}
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

