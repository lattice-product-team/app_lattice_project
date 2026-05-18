import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Eye } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

export const RemoteModeWarning = () => {
  const theme = useLatticeTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: 'rgba(28, 28, 30, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Eye size={20} color={theme.colors.brand.primary} strokeWidth={2.2} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Remote Exploration Mode</Text>
            <Text style={styles.description}>
              You are far from the venue. Real-time navigation is disabled.
            </Text>
          </View>
        </View>
      </View>
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
