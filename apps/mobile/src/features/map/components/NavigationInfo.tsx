import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Platform } from 'react-native';
import { Navigation, X, Car, Footprints, Bike } from 'lucide-react-native';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore, MapCameraMode } from '../store/useMapUIStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import Animated, { FadeInDown, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { Button } from '../../../components/ui/Button';

import { formatDuration, formatDistance } from '../../../utils/geoUtils';

/**
 * NavigationInfo: Bottom arrival summary sheet.
 * Aesthetic: Google Maps style (large duration, exit button) + Lattice Glassmorphism.
 */
export const NavigationInfo = () => {
  const { isNavigating, routeMetadata, stopNavigation } = useNavigationStore();
  const { setSelectedEvent } = usePOIStore();
  const { setCurrentEvent } = useEventStore();
  const { cameraMode, setCameraMode, triggerRecenter } = useMapUIStore();
  const theme = useLatticeTheme();
  const insets = useSafeAreaInsets();

  if (!isNavigating || !routeMetadata) return null;

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stopNavigation();
  };

  const handleRecenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    triggerRecenter();
  };

  const getArrivalTime = (seconds: number) => {
    const arrivalDate = new Date();
    arrivalDate.setSeconds(arrivalDate.getSeconds() + seconds);
    return arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTransportIcon = () => {
    const { transportMode } = useNavigationStore.getState();
    const iconProps = { size: 24, color: theme.colors.brand.primary, style: { marginRight: 12 } };

    if (transportMode === 'driving') return <Car {...iconProps} />;
    if (transportMode === 'bicycle') return <Bike {...iconProps} />;
    return <Footprints {...iconProps} />;
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutDown.duration(300)}
      style={[styles.container, { bottom: insets.bottom + 20 }]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.bg.surface,
            borderColor: theme.colors.border.subtle,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.infoLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              {renderTransportIcon()}
              <Text style={[styles.durationText, { color: theme.colors.brand.primary }]}>
                {formatDuration(routeMetadata.duration)}
              </Text>
            </View>
            <Text style={[styles.subText, { color: theme.colors.text.secondary }]}>
              {formatDistance(routeMetadata.distance)} · {getArrivalTime(routeMetadata.duration)}
            </Text>
            {routeMetadata.destinationName && (
              <Text
                style={[styles.destinationText, { color: theme.colors.text.muted }]}
                numberOfLines={1}
              >
                to {routeMetadata.destinationName}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={handleCancel} activeOpacity={0.8}>
            <View
              style={[
                styles.exitButton,
                {
                  backgroundColor: 'rgba(255, 59, 48, 0.8)', // Translucent red for blur effect
                  borderWidth: 0,
                },
              ]}
            >
              <X size={24} color="#FFFFFF" strokeWidth={3} />
            </View>
          </TouchableOpacity>
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
  recenterContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  recenterText: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  infoLeft: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  durationText: {
    fontSize: 34,
    fontFamily: typography.primary.bold,
    ...typography.primary, // includes includeFontPadding and adjusted letterSpacing
    letterSpacing: Platform.OS === 'android' ? -0.2 : -1,
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    fontFamily: typography.primary.semibold,
    includeFontPadding: false,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  destinationText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    includeFontPadding: false,
    letterSpacing: -0.1,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  exitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
