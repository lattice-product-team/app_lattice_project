import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { useAppTheme } from '../../../hooks/useAppTheme';
import { DetailAction } from '../../../types/models/detail';
import { Button } from '../../../components/ui/Button';
import * as LucideIcons from 'lucide-react-native';

interface ActionPillBarProps {
  actions: DetailAction[];
}

export const ActionPillBar = React.memo(({ actions }: ActionPillBarProps) => {
  const theme = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          label={action.label}
          variant={action.variant}
          onPress={action.onPress}
          leftIcon={(() => {
            const IconComponent = (LucideIcons as any)[action.icon] || LucideIcons.HelpCircleIcon;
            return (
              <IconComponent
                size={20}
                color={action.variant === 'primary' ? theme.colors.text.inverse : theme.colors.brand.primary}
              />
            );
          })()}
          style={styles.pillOverride}
        />
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 12,
  },
  pillOverride: {
    height: 44, // Slightly smaller for the bar
    minWidth: 110,
    borderRadius: 22,
  },
});
