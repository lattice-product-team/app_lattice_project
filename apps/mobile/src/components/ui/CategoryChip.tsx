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
        pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] }
      ]}
    >
      <SafeBlurView 
        intensity={isSelected ? 0 : 40} 
        tint={theme.dark ? 'dark' : 'light'}
        style={[
          styles.blurContainer,
          { 
            backgroundColor: isSelected ? activeColor : 'rgba(255,255,255,0.05)',
            borderColor: isSelected ? activeColor : 'rgba(255,255,255,0.1)' 
          }
        ]}
      >
        <Text 
          style={[
            styles.text,
            { color: theme.colors.text.primary },
            isSelected && { color: theme.colors.text.inverse }
          ]}
        >
          {label}
        </Text>
      </SafeBlurView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginRight: 8,
  },
  blurContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: typography.secondary.bold,
  },
});

