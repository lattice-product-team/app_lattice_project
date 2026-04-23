import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { typography } from '../styles/typography';
import * as Haptics from 'expo-haptics';
import { useLatticeTheme } from '../hooks/useLatticeTheme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (text: string) => void;
  onArPress?: () => void;
  onFocus?: () => void;
}

export const SearchBar = React.memo(function SearchBar({
  placeholder = 'Buscador...',
  value,
  onSearch,
  onArPress,
  onFocus,
}: SearchBarProps) {
  const theme = useLatticeTheme();

  return (
    <View className="flex-row items-center px-4">
      {/* Search Input Container */}
      <View
        className="flex-1 flex-row items-center px-4 h-12 rounded-2xl"
        style={[
          styles.searchContainer,
          { 
            backgroundColor: theme.colors.glass.subtle,
            borderColor: theme.colors.glass.subtleBorder
          }
        ]}
      >
        <Feather name="search" size={18} color={theme.colors.brand.primary} />
        <TextInput
          className="flex-1 ml-3 pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.muted}
          value={value}
          onChangeText={onSearch}
          onFocus={onFocus}
          accessibilityLabel="Main search input"
          style={{ 
            height: 48, 
            fontSize: 16,
            fontFamily: typography.primary.medium,
            letterSpacing: -0.2,
            color: theme.colors.text.primary
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
            <Feather name="x-circle" size={20} color={theme.colors.text.muted} />
          </Pressable>
        ) : (
          <View className="pl-2">
            <Feather name="mic" size={18} color={theme.colors.text.muted} />
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
              borderRadius: 24, // Circular
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.glass.subtle,
              borderColor: theme.colors.glass.subtleBorder,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            }
          ]}>
            <Feather name="user" size={18} color={theme.colors.text.secondary} />
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
  }
});
