import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLatticeTheme } from '../hooks/useLatticeTheme';
import { mapIconName } from '../utils/poiUtils';

interface FilterChipProps {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
}

export const FilterChip = React.memo(function FilterChip({ label, icon, active = false, onPress }: FilterChipProps) {
  const theme = useLatticeTheme();
  return (
    <Pressable
      onPress={onPress}
      testID="filter-chip"
      className={`flex-row items-center px-4 h-8 rounded-full mr-3 border active:opacity-70 ${
        active ? 'bg-primary border-primary' : 'border-transparent'
      }`}
      style={[
        active ? {
          shadowColor: theme.colors.brand.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 5,
        } : {
          backgroundColor: theme.colors.glass.background,
          borderColor: theme.colors.glass.border,
        }
      ]}
    >
      <Feather
        name={mapIconName(icon) as any}
        size={18}
        color="white"
        style={styles.icon}
      />
      <Text className="text-white font-medium text-sm">{label}</Text>
    </Pressable>
  );
});

FilterChip.displayName = 'FilterChip';

const styles = StyleSheet.create({
  icon: {
    marginRight: 6,
  },
});
