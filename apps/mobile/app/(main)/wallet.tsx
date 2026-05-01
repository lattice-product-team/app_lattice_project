import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { typography } from '../../src/styles/typography';

export default function WalletScreen() {
  const theme = useAppTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Lattice Wallet</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Gestiona tus puntos y recompensas aquí.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    opacity: 0.7,
  },
});
