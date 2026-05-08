import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { UserAvatar } from './UserAvatar';
import { typography } from '../../styles/typography';

interface FloatingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onProfilePress?: () => void;
  onPress?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
  editable?: boolean;
}

export const FloatingSearchBar = React.forwardRef<TextInput, FloatingSearchBarProps>(
  (
    {
      value,
      onChangeText,
      onFocus,
      onProfilePress,
      onPress,
      onSubmit,
      placeholder = 'Search events, stages, food...',
      avatarUrl,
      isGuest,
      editable = true,
    },
    ref
  ) => {
    const theme = useAppTheme();

    return (
      <View style={styles.innerContainer}>
        <Feather name="search" size={22} color={theme.colors.text.primary} style={styles.icon} />

        <Pressable
          style={{ flex: 1, justifyContent: 'center' }}
          onPress={onPress}
          disabled={editable}
        >
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.muted}
            style={[styles.input, { color: theme.colors.text.primary }]}
            selectionColor={theme.colors.brand.primary}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            editable={editable}
            pointerEvents={editable ? 'auto' : 'none'}
          />
        </Pressable>

        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')} style={styles.clearButton}>
            <Feather name="x-circle" size={18} color={theme.colors.text.muted} />
          </Pressable>
        )}

        <View style={styles.rightActions}>
          <Pressable style={styles.micButton}>
            <MaterialCommunityIcons name="microphone" size={24} color={theme.colors.text.primary} />
          </Pressable>

          <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border.subtle }]} />

          <Pressable style={styles.profileButton} onPress={onProfilePress}>
            <UserAvatar size={32} url={avatarUrl} isGuest={isGuest} />
          </Pressable>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 12,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: typography.secondary.medium,
    paddingVertical: 0,
    letterSpacing: -0.2,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micButton: {
    padding: 4,
    opacity: 0.9,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  profileButton: {
    padding: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
});
