import React from 'react';
import { Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { SafeBlurView } from './SafeBlurView';

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
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isSelected && { backgroundColor: activeColor, borderColor: activeColor },
        pressed && { opacity: 0.8, scale: 0.96 }
      ]}
    >
      {!isSelected && (
        <SafeBlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <Text 
        style={[
          styles.text,
          isSelected && styles.textSelected
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
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
    color: colors.black,
  },
  textSelected: {
    color: '#FFFFFF',
  }
});
