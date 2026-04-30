import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { typography } from '../../styles/typography';
import { Image } from 'expo-image';
import { SafeBlurView } from './SafeBlurView';
import { useAppTheme } from '../../hooks/useAppTheme';

interface FloatingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onProfilePress?: () => void;
  placeholder?: string;
}

export const FloatingSearchBar = ({
  value,
  onChangeText,
  onFocus,
  onProfilePress,
  placeholder = "Search events, stages, food..."
}: FloatingSearchBarProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.innerContainer}>
      <Feather 
        name="search" 
        size={22} 
        color={theme.colors.text.primary} 
        style={styles.icon} 
      />
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.muted}
        style={[styles.input, { color: theme.colors.text.primary }]}
        selectionColor={theme.colors.brand.primary}
      />

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
        
        <Pressable 
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop' }}
            style={[styles.avatar, { borderColor: theme.colors.border.subtle }]}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
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
    width: 0.5,
    height: 24,
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

