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
      icon: <MaterialCommunityIcons name="ticket-confirmation" size={22} color={theme.colors.brand.primary} />,
      onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: <MaterialCommunityIcons name="wallet" size={22} color={theme.colors.brand.primary} />,
      onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    },
    {
      id: 'saved',
      label: 'Favoritos',
      icon: <Feather name="heart" size={20} color={theme.colors.brand.primary} />,
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
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
          ]}
        >
          <View style={styles.cardContent}>
            {action.icon}
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
    gap: 16,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    height: 48,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.4,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
  },
});
