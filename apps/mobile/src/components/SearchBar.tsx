import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { typography } from '../styles/typography';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../hooks/useAppTheme';

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
  const theme = useAppTheme();

  return (
    <View style={styles.outerContainer}>
      {/* Search Input Container */}
      <View
        style={[
          styles.searchBarWrapper,
          { 
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          }
        ]}
      >
        <Feather name="search" size={20} color={theme.colors.text.muted} />
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text.primary }
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.muted}
          value={value}
          onChangeText={onSearch}
          onFocus={onFocus}
          accessibilityLabel="Main search input"
        />
        {(value && value.length > 0) ? (
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSearch?.('');
            }}
            style={styles.clearButton}
          >
            <Feather name="x-circle" size={18} color={theme.colors.text.muted} />
          </Pressable>
        ) : (
          <View style={styles.clearButton}>
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
            styles.profileButton,
            {
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            }
          ]}>
            <Feather name="user" size={20} color={theme.colors.text.secondary} />
          </View>
        )}
      </Pressable>
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontFamily: typography.primary.medium,
    letterSpacing: -0.4,
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    paddingLeft: 8,
  },
  profileButton: {
    width: 46,
    height: 46,
    marginLeft: 10,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
