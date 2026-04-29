import React from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

interface SettingItemProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
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
  icon, 
  value, 
  onValueChange, 
  onPress, 
  type = 'link',
  destructive = false,
  secondaryText,
  iconBgColor
}: SettingItemProps) {
  const theme = useAppTheme();
  
  const iconColor = destructive 
    ? theme.colors.status.error 
    : (iconBgColor ? (theme.dark ? theme.colors.text.inverse : theme.colors.brand.primary) : theme.colors.brand.primary);
    
  const bgColor = iconBgColor || (destructive ? theme.colors.status.errorSurface : theme.colors.bg.elevation);

  return (
    <Pressable 
      onPress={type === 'link' ? onPress : undefined}
      style={({ pressed }) => [
        { 
          flexDirection: 'row',
          justifyContent: 'space-between',
          itemsCenter: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.subtle,
          backgroundColor: pressed && type === 'link' ? theme.colors.bg.elevation : 'transparent'
        }
      ]}
      accessibilityRole={type === 'link' ? 'button' : 'none'}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 12, 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: 16,
            backgroundColor: bgColor 
          }}
        >
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text 
            style={{ 
              fontSize: 16, 
              fontWeight: destructive ? 'bold' : '500',
            color: destructive ? theme.colors.status.error : theme.colors.text.primary 
            }}
          >
            {label}
          </Text>
          {secondaryText ? (
            <Text style={{ color: theme.colors.brand.primary, fontSize: 12, marginTop: 2 }}>
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
        <Feather 
          name="chevron-right" 
          size={24} 
          color={destructive ? theme.colors.status.error : theme.colors.text.muted} 
        />
      )}
    </Pressable>
  );
});

SettingItem.displayName = 'SettingItem';

