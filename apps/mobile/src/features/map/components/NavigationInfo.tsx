import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Navigation, X, Car, Footprints, Bike } from 'lucide-react-native';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useMapUIStore, MapCameraMode } from '../store/useMapUIStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import Animated, { FadeInDown, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

/**
 * NavigationInfo: Bottom arrival summary sheet.
 * Aesthetic: Google Maps style (large duration, exit button) + Lattice Glassmorphism.
 */
export const NavigationInfo = () => {
  const { isNavigating, routeMetadata, setNavigating, setPlanning } = useNavigationStore();
  const { setSelectedEvent } = usePOIStore();
  const { setCurrentEvent } = useEventStore();
  const { cameraMode, setCameraMode } = useMapUIStore();
  const theme = useLatticeTheme();
  const insets = useSafeAreaInsets();

  if (!isNavigating || !routeMetadata) return null;

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Instead of exiting completely, return to the route planning overview
    // This allows the user to see the whole route again
    setNavigating(false);
    setPlanning(true);
    setCameraMode(MapCameraMode.FREE);
  };

  const handleRecenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCameraMode(MapCameraMode.NAVIGATION);
  };

  const formatDistance = (m: number) => {
    if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
    return `${Math.round(m)} m`;
  };

  const formatDurationLarge = (s: number) => {
    const totalMins = Math.round(s / 60);
    if (totalMins < 1) return '< 1 min';
    if (totalMins < 60) return `${totalMins} min`;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return mins === 0 ? `${hours} hr` : `${hours} hr ${mins} min`;
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
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
          },
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.content}>
          <View style={styles.infoLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              {renderTransportIcon()}
              <Text style={[styles.durationText, { color: theme.colors.brand.primary }]}>
                {formatDurationLarge(routeMetadata.duration)}
              </Text>
            </View>
            <Text style={[styles.subText, { color: theme.colors.text.secondary }]}>
              {formatDistance(routeMetadata.distance)} · {getArrivalTime(routeMetadata.duration)}
            </Text>
            {routeMetadata.destinationName && (
              <Text style={[styles.destinationText, { color: theme.colors.text.muted }]} numberOfLines={1}>
                to {routeMetadata.destinationName}
              </Text>
            )}
          </View>

          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [
              styles.exitButton,
              { 
                backgroundColor: 'rgba(255, 59, 48, 0.25)', // More visible red tint
                borderColor: 'rgba(255, 59, 48, 0.4)',
                opacity: pressed ? 0.7 : 1 
              },
            ]}
          >
            <X size={20} color="#FF3B30" strokeWidth={3} />
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
  recenterContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  recenterText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
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
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  destinationText: {
    fontSize: 14,
    fontWeight: '500',
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
