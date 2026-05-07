import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * NavigationInfo: Bottom arrival summary sheet.
 * Aesthetic: White Glassmorphism consistent with the user's reference image.
 */
export const NavigationInfo = () => {
  const { isNavigating, routeMetadata, clearNavigation } = useNavigationStore();
  const insets = useSafeAreaInsets();

  if (!isNavigating || !routeMetadata) return null;

  const handleCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    clearNavigation();
  };

  const formatDistance = (m: number) => {
    if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
    return `${Math.round(m)} m`;
  };

  const formatDuration = (s: number) => {
    const mins = Math.round(s / 60);
    if (mins < 1) return '< 1 min';
    return `${mins}`;
  };

  const getArrivalTime = (seconds: number) => {
    const arrivalDate = new Date();
    arrivalDate.setSeconds(arrivalDate.getSeconds() + seconds);
    return arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutDown.duration(300)}
      style={[styles.container, { bottom: insets.bottom + 20 }]}
    >
      <View style={[
        styles.card, 
        { 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(0, 0, 0, 0.1)' 
        }
      ]}>
        <View style={styles.handle} />
        <View style={styles.content}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{getArrivalTime(routeMetadata.duration)}</Text>
            <Text style={styles.statLabel}>arrival</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(routeMetadata.duration)}</Text>
            <Text style={styles.statLabel}>min</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDistance(routeMetadata.distance).split(' ')[0]}</Text>
            <Text style={styles.statLabel}>{formatDistance(routeMetadata.distance).split(' ')[1]}</Text>
          </View>

          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [styles.closeButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <X size={20} color="#666" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: -2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
