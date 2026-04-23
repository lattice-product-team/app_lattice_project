import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { typography } from '../styles/typography';
import { colors } from '../styles/colors';
import * as Haptics from 'expo-haptics';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (text: string) => void;
  onArPress?: () => void;
  onFocus?: () => void;
  variant?: 'light' | 'dark';
}

export const SearchBar = React.memo(function SearchBar({
  placeholder = 'Buscador...',
  value,
  onSearch,
  onArPress,
  onFocus,
  variant = 'light',
}: SearchBarProps) {
  const isDark = variant === 'dark';

  return (
    <View className="flex-row items-center px-4">
      {/* Search Input Container */}
      <View
        className="flex-1 flex-row items-center px-4 h-12 rounded-2xl"
        style={[
          styles.searchContainer,
          isDark ? styles.searchContainerDark : styles.searchContainerLight
        ]}
      >
        <Feather name="search" size={18} color={colors.primary} />
        <TextInput
          className="flex-1 ml-3 text-white pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor={variant === 'dark' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"}
          value={value}
          onChangeText={onSearch}
          onFocus={onFocus}
          accessibilityLabel="Main search input"
          style={{ 
            height: 48, 
            fontSize: 16,
            fontFamily: typography.primary.medium,
            letterSpacing: -0.2
          }}
        />
        {(value && value.length > 0) ? (
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSearch?.('');
            }}
            className="pl-2"
          >
            <Feather name="x-circle" size={20} color="rgba(255, 255, 255, 0.4)" />
          </Pressable>
        ) : (
          <View className="pl-2">
            <Feather name="mic" size={18} color={variant === 'dark' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"} />
          </View>
        )}
      </View>

      {/* Profile Button */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onArPress?.();
        }}
        accessibilityLabel="Go to profile"
      >
        {({ pressed }) => (
          <View style={[
            styles.searchContainer,
            {
              width: 48,
              height: 48,
              marginLeft: 10,
              borderRadius: 20, // Increased from 16 for more rounded look
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            }
          ]}>
            <Feather name="user" size={22} color="rgba(255, 255, 255, 0.6)" />
          </View>
        )}
      </Pressable>
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  searchContainer: { 
    borderWidth: 1,
  },
  searchContainerLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  }
});
