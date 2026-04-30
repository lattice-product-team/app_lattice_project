import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

export const ActionGrid = () => {
  const theme = useAppTheme();

  const actions = [
    {
      id: 'tickets',
      label: 'Entradas',
      icon: <MaterialCommunityIcons name="ticket-confirmation-outline" size={26} color={theme.colors.brand.primary} />,
      onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: <MaterialCommunityIcons name="wallet-outline" size={26} color={theme.colors.brand.primary} />,
      onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    },
    {
      id: 'saved',
      label: 'Favoritos',
      icon: <Feather name="heart" size={24} color={theme.colors.brand.primary} />,
      onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={action.onPress}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: theme.colors.bg.surface },
            pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
          ]}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand.primary + '10' }]}>
              {action.icon}
            </View>
            <Text style={[styles.label, { color: theme.colors.text.primary }]} numberOfLines={1}>
              {action.label}
            </Text>
          </View>
          <View style={[styles.border, { borderColor: theme.colors.glass.border }]} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    maxWidth: '31%', // Ensure they don't grow too much if there's extra space
    borderRadius: 20,
    height: 100,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.2,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
  },
});
