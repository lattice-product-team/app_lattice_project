import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../styles/typography';
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
    <View style={styles.outerContainer}>
      <SafeBlurView 
        intensity={90} 
        tint={theme.colors.glass.tint} 
        style={[
          styles.blurContainer, 
          { borderColor: theme.colors.glass.border }
        ]}
      >
        <View style={styles.innerContainer}>
          <Feather 
            name="search" 
            size={20} 
            color={theme.colors.text.muted} 
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

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />
          
          <Pressable 
            style={styles.micButton}
            onPress={onProfilePress}
          >
            <Feather 
              name={onProfilePress ? "user" : "mic"} 
              size={20} 
              color={theme.colors.brand.primary} 
            />
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
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
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
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 8,
  },
  micButton: {
    paddingLeft: 8,
  },
});

