import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeBlurView } from '../ui/SafeBlurView';
import { useMapStore } from '../../store/useMapStore';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';
import { typography } from '../../styles/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const NavigationInfo = () => {
  const isNavigating = useMapStore((s) => s.isNavigating);
  const routeMetadata = useMapStore((s) => s.routeMetadata);
  const deselect = useMapStore((s) => s.deselect);
  const insets = useSafeAreaInsets();
  const theme = useLatticeTheme();

  if (!isNavigating || !routeMetadata) return null;

  const handleCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deselect();
  };

  const formatDistance = (m: number) => {
    if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
    return `${Math.round(m)} m`;
  };

  const formatDuration = (s: number) => {
    const mins = Math.round(s / 60);
    if (mins < 1) return '< 1 min';
    return `${mins} min`;
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutDown.duration(300)}
      style={[styles.container, { bottom: insets.bottom + 20 }]}
    >
      <SafeBlurView intensity={80} tint="dark" style={styles.card}>
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <View style={styles.mainInfo}>
              <Text style={[styles.durationText, { color: theme.colors.brand.primary }]}>{formatDuration(routeMetadata.duration)}</Text>
              <View style={styles.dot} />
              <Text style={styles.distanceText}>{formatDistance(routeMetadata.distance)}</Text>
            </View>
            <Text style={styles.destinationText} numberOfLines={1}>
              Hacia {routeMetadata.destinationName || 'tu destino'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [styles.cancelButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="x" size={24} color="#FF453A" />
          </Pressable>
        </View>
      </SafeBlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999, // Asegurar que esté por encima de todo
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 22, 0.8)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
  },
  infoSection: {
    flex: 1,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  durationText: {
    // color handled dynamically
    fontSize: 22,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  distanceText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 18,
    fontFamily: typography.secondary.medium,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  destinationText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    fontFamily: typography.secondary.regular,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  cancelButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
