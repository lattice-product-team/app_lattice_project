import React from 'react';
import { Text, StyleSheet, Pressable, Platform } from 'react-native';
import { typography } from '../../styles/typography';
import { SafeBlurView } from './SafeBlurView';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  activeColor: string;
}

export const CategoryChip = ({
  label,
  isSelected,
  onPress,
  activeColor
}: CategoryChipProps) => {
  const theme = useLatticeTheme();

  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: theme.colors.glass.background,
          borderColor: theme.colors.glass.border 
        },
        isSelected && { backgroundColor: activeColor, borderColor: activeColor },
        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
      ]}
    >
      {!isSelected && (
        <SafeBlurView 
          intensity={60} 
          tint={theme.colors.glass.tint} 
          style={StyleSheet.absoluteFill} 
        />
      )}
      <Text 
        style={[
          styles.text,
          { color: theme.colors.text.primary },
          isSelected && { color: theme.colors.text.inverse }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    })
  },
  text: {
    fontSize: 14,
    fontFamily: typography.secondary.bold,
  },
});

