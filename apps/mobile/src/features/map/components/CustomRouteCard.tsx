import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Hand } from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

export const CustomRouteCard = () => {
  const theme = useAppTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderColor: theme.colors.border.subtle,
        },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: '#34A853' }]}>
        <Hand size={24} color="white" strokeWidth={2.2} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Create a Custom Route
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>
          Build your own walk or hike in this area.
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: typography.primary.bold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.primary.regular,
    marginTop: 2,
  },
});
