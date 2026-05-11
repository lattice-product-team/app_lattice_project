import React from 'react';
import { View, StyleSheet } from 'react-native';
import { User, UserX } from 'lucide-react-native';
import { Image } from 'expo-image';

import { useAppTheme } from '../../hooks/useAppTheme';

interface UserAvatarProps {
  size?: number;
  url?: string | null;
  isGuest?: boolean;
}

export const UserAvatar = ({ size = 32, url, isGuest }: UserAvatarProps) => {
  const theme = useAppTheme();

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: isGuest ? theme.colors.glass.subtle : theme.colors.bg.surface,
      borderColor: theme.colors.border.subtle,
      borderWidth: 1,
    },
  ];

  if (url) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: url }}
          style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        />
      </View>
    );
  }

  const Icon = isGuest ? UserX : User;

  return (
    <View style={containerStyle}>
      <Icon
        size={size * 0.6}
        color={isGuest ? theme.colors.text.muted : theme.colors.text.primary}
        strokeWidth={2.2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
