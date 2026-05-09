import React from 'react';
import { 
  ScrollView, 
  Pressable, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { DetailAction } from '../../../types/models/detail';

interface ActionPillBarProps {
  actions: DetailAction[];
}

export const ActionPillBar = ({ actions }: ActionPillBarProps) => {
  const theme = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            action.onPress();
          }}
          style={({ pressed }) => [
            styles.pill,
            {
              backgroundColor: action.type === 'primary' 
                ? theme.colors.brand.primary 
                : theme.colors.glass.background,
              borderColor: theme.colors.glass.border,
            },
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
          ]}
        >
          <MaterialCommunityIcons
            name={action.icon as any}
            size={20}
            color={action.type === 'primary' ? 'white' : theme.colors.brand.primary}
          />
          <Text
            style={[
              styles.label,
              { color: action.type === 'primary' ? 'white' : theme.colors.brand.primary }
            ]}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
    paddingVertical: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
});
