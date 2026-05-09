import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppLoadingViewProps {
  backgroundColor?: string;
  spinnerColor?: string;
}

export const AppLoadingView: React.FC<AppLoadingViewProps> = ({
  backgroundColor,
  spinnerColor,
}) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || theme.colors.bg.main }]}>
      <ActivityIndicator
        color={spinnerColor || theme.colors.brand.primary}
        size="large"
        style={styles.spinner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    transform: [{ scale: 1.2 }], // Slightly larger for a refined feel
  },
});
