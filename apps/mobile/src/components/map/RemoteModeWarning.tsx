import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeBlurView } from '../ui/SafeBlurView';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const RemoteModeWarning = () => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
    >
      <SafeBlurView intensity={60} tint="dark" style={styles.card}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="eye" size={20} color={colors.categories.generic} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Modo Exploración Remota</Text>
            <Text style={styles.description}>
              Estás lejos del recinto. La navegación en tiempo real está desactivada.
            </Text>
          </View>
        </View>
      </SafeBlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 179, 63, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 15,
    fontFamily: typography.primary.bold,
    marginBottom: 2,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontFamily: typography.secondary.regular,
    lineHeight: 16,
  },
});
