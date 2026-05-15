import React from 'react';
import { Text, StyleSheet, Platform, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { typography } from '../../styles/typography';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  activeColor: string;
}

export const CategoryChip = ({ label, isSelected, onPress, activeColor }: CategoryChipProps) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
      ]}
    >
      <View
        style={[
          styles.blurContainer,
          {
            backgroundColor: isSelected
              ? activeColor
              : theme.dark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.05)',
            borderColor: isSelected
              ? activeColor
              : theme.dark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.08)',
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: theme.colors.text.primary },
            isSelected && { color: theme.colors.text.inverse },
          ]}
        >
          {label}
        </Text>
      </View>
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
