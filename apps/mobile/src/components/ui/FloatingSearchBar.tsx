import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { theme } from '../../styles/theme';
import { SafeBlurView } from './SafeBlurView';

interface FloatingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  placeholder?: string;
}

export const FloatingSearchBar = ({
  value,
  onChangeText,
  onFocus,
  placeholder = "Search events, stages, food..."
}: FloatingSearchBarProps) => {
  return (
    <View style={styles.outerContainer}>
      <SafeBlurView intensity={90} tint="light" style={styles.blurContainer}>
        <View style={styles.innerContainer}>
          <Feather name="search" size={20} color={colors.muted} style={styles.icon} />
          
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            style={styles.input}
            selectionColor={colors.primary}
          />

          {value.length > 0 && (
            <Pressable onPress={() => onChangeText('')} style={styles.clearButton}>
              <Feather name="x-circle" size={18} color={colors.muted} />
            </Pressable>
          )}

          <View style={styles.divider} />
          
          <Pressable style={styles.micButton}>
            <Feather name="mic" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </SafeBlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    width: '100%',
    ...theme.shadows.soft,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 17,
    fontFamily: typography.secondary.medium,
    color: colors.black,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 8,
  },
  micButton: {
    paddingLeft: 8,
  },
});
