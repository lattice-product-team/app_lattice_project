import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface POIActionsProps {
  onNavigate: () => void;
  onBookmark?: () => void;
}

export const POIActions = React.memo(function POIActions({ onNavigate, onBookmark }: POIActionsProps) {
  const theme = useLatticeTheme();
  return (
    <View className="mt-4 flex-row gap-3">
      <Pressable
        onPress={onNavigate}
        className="flex-1 h-12 flex-row items-center justify-center rounded-xl active:opacity-90"
        style={[styles.navigateButton, { 
          backgroundColor: theme.colors.brand.primary,
          shadowColor: theme.colors.brand.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        }]}
        accessibilityLabel="Navigate to this location"
      >
        <Feather name="navigation" size={18} color="white" />
        <Text className="text-white font-bold ml-2">Navigate Here</Text>
      </Pressable>

      <Pressable
        onPress={onBookmark}
        className="w-12 h-12 items-center justify-center border rounded-xl border-transparent active:opacity-70"
        style={styles.bookmarkButton}
        accessibilityLabel="Bookmark this location"
      >
        <Feather name="bookmark" size={20} color="white" />
      </Pressable>
    </View>
  );
});

POIActions.displayName = 'POIActions';

const styles = StyleSheet.create({
  navigateButton: {
    // shadowColor set dynamically or via theme
  },
  bookmarkButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});

