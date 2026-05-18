import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CircularActionButtonProps {
  icon: keyof typeof LucideIcons;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
}

/**
 * A reusable circular action button typically used for top-level
 * header actions like Share, Close, Settings, etc.
 */
export const CircularActionButton = ({
  icon,
  onPress,
  style,
  iconSize = 20,
  iconColor,
  backgroundColor,
}: CircularActionButtonProps) => {
  const theme = useAppTheme();
  const Icon = LucideIcons[icon] as any;

  if (!Icon) return null;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: backgroundColor || theme.colors.glass.subtle },
        style,
      ]}
    >
      <Icon size={iconSize} color={iconColor || theme.colors.text.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
