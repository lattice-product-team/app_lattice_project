import React from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface SettingItemProps {
  label: string;
  icon: LucideIcon;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  type?: 'toggle' | 'link';
  destructive?: boolean;
  secondaryText?: string;
  iconBgColor?: string;
}

export const SettingItem = React.memo(function SettingItem({
  label,
  icon: Icon,
  value,
  onValueChange,
  onPress,
  type = 'link',
  destructive = false,
  secondaryText,
  iconBgColor,
}: SettingItemProps) {
  const theme = useAppTheme();

  const iconColor = destructive
    ? theme.colors.status.error
    : iconBgColor
      ? theme.dark
        ? theme.colors.text.inverse
        : theme.colors.brand.primary
      : theme.colors.brand.primary;

  const bgColor =
    iconBgColor || (destructive ? theme.colors.status.errorSurface : theme.colors.bg.elevation);

  return (
    <Pressable
      onPress={type === 'link' ? onPress : undefined}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed && type === 'link' ? theme.colors.bg.elevation : 'transparent',
          borderBottomColor: theme.colors.border.subtle,
        },
      ]}
      accessibilityRole={type === 'link' ? 'button' : 'none'}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: bgColor,
            },
          ]}
        >
          <Icon size={20} color={iconColor} strokeWidth={2.2} />
        </View>
        <View style={styles.textWrapper}>
          <Text
            style={[
              styles.label,
              {
                fontWeight: destructive ? 'bold' : '500',
                color: destructive ? theme.colors.status.error : theme.colors.text.primary,
              },
            ]}
          >
            {label}
          </Text>
          {secondaryText ? (
            <Text style={[styles.secondaryText, { color: theme.colors.brand.primary }]}>
              {secondaryText}
            </Text>
          ) : null}
        </View>
      </View>

      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.border.strong, true: theme.colors.brand.primary }}
          thumbColor={theme.colors.text.inverse}
        />
      ) : (
        <ChevronRight
          size={24}
          color={destructive ? theme.colors.status.error : theme.colors.text.muted}
          strokeWidth={2.2}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  secondaryText: {
    fontSize: 12,
    marginTop: 2,
  },
});

SettingItem.displayName = 'SettingItem';
