import { ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { DetailAction } from '../../../types/models/detail';
import { Button } from '../../../components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <Button
          key={action.id}
          label={action.label}
          variant={action.variant}
          onPress={action.onPress}
          leftIcon={
            <MaterialCommunityIcons
              name={action.icon as any}
              size={20}
              color={action.variant === 'primary' ? theme.colors.text.inverse : theme.colors.brand.primary}
            />
          }
          style={styles.pillOverride}
        />
      ))}
    </ScrollView>
  );
};

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
