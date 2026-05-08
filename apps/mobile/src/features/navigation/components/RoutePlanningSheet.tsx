import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigationStore, TransportMode } from '../store/useNavigationStore';
import { navigationService } from '../services/navigationService';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

/**
 * RoutePlanningSheet: Redesigned Planning UI.
 * - Transport selector moved to the top.
 * - Start button at the bottom.
 */
export const RoutePlanningSheet = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isPlanning, setPlanning, setNavigating, transportMode, setTransportMode, setRoute, routeMetadata } =
    useNavigationStore();
  const { selectedPoi } = usePOIStore();
  const userCoords = useLocationStore((s) => s.logicalCoords);

  const [etas, setEtas] = useState<Record<TransportMode, number | null>>({
    driving: null,
    walking: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPlanning && selectedPoi && userCoords) {
      fetchAllEtas();
    }
  }, [isPlanning, selectedPoi, userCoords]);

  const fetchAllEtas = async () => {
    if (!selectedPoi?.coordinates || !userCoords) return;
    setLoading(true);

    const origin = { lat: userCoords[1], lng: userCoords[0] };
    const destination = {
      lat: selectedPoi.coordinates[1],
      lng: selectedPoi.coordinates[0],
    };

    try {
      const modes: TransportMode[] = ['driving', 'walking'];
      const results = await Promise.allSettled(
        modes.map((m) => navigationService.getRoute({ origin, destination, mode: m }))
      );

      const newEtas: any = { ...etas };
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          newEtas[modes[i]] = result.value.properties.durationEstimate;
        } else {
          console.warn(`[RoutePlanning] Failed to fetch ETA for ${modes[i]}:`, result.reason);
          newEtas[modes[i]] = null;
        }
      });
      setEtas(newEtas);
    } catch (error) {
      console.error('[RoutePlanning] Unexpected error fetching ETAs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPlanning) return null;

  const formatEta = (seconds: number | null | undefined) => {
    if (loading) return 'Calculating...';
    if (seconds === null || seconds === undefined || seconds === 0) return 'Tap to refresh';
    const mins = Math.round(seconds / 60);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins} min`;
  };

  const handleStart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPlanning(false);
    setNavigating(true);
  };

  const activeDuration = etas[transportMode] || routeMetadata?.duration;

  return (
    <>
      {/* Top Selector - Mode Switcher */}
      <Animated.View 
        entering={FadeInUp.duration(400).springify()} 
        exiting={FadeOutUp} 
        style={[styles.topContainer, { top: insets.top + 10 }]}
      >
        <View style={[styles.topPill, { 
          backgroundColor: theme.colors.glass.background, 
          borderColor: theme.colors.glass.border,
        }]}>
          {(['driving', 'walking'] as TransportMode[]).map((mode) => {
            const isActive = transportMode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTransportMode(mode);
                }}
                style={[
                  styles.topModeBtn,
                  isActive && { 
                    backgroundColor: '#000000', // Black for active mode in selector
                  }
                ]}
              >
                <MaterialCommunityIcons 
                  name={mode === 'driving' ? "car" : "walk"} 
                  size={24} 
                  color={isActive ? 'white' : theme.colors.text.primary} 
                />
                <View style={styles.modeTextContainer}>
                  <Text style={[styles.topModeLabel, { color: isActive ? 'white' : theme.colors.text.primary }]}>
                    {mode === 'driving' ? 'Drive' : 'Walk'}
                  </Text>
                  <Text style={[styles.topEtaText, { color: isActive ? 'rgba(255,255,255,0.9)' : theme.colors.text.muted }]}>
                    {formatEta(etas[mode])}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Start Card */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        exiting={FadeOutDown}
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={[styles.bottomCard, { 
          backgroundColor: theme.colors.glass.background, 
          borderColor: theme.colors.glass.border, 
          ...theme.shadows.soft 
        }]}>
          <View style={styles.routeInfo}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.destTitle, { color: theme.colors.text.primary }]} numberOfLines={1}>
                {selectedPoi?.displayName}
              </Text>
              <View style={styles.metricsRow}>
                <Text style={[styles.destSub, { color: theme.colors.text.muted }]}>
                  {routeMetadata ? `${(routeMetadata.distance / 1000).toFixed(1)} km` : '...'}
                </Text>
                <View style={[styles.dot, { backgroundColor: theme.colors.text.muted }]} />
                <Text style={[styles.destSub, { 
                  color: theme.colors.brand.primary, 
                  fontFamily: typography.primary.bold,
                  fontSize: 18
                }]}>
                  {formatEta(activeDuration)}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setPlanning(false)} style={styles.closeCircle}>
              <Feather name="x" size={20} color={theme.colors.text.muted} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.startBtn,
              { 
                backgroundColor: theme.colors.brand.primary,
                opacity: pressed ? 0.9 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              },
            ]}
          >
            <Text style={[styles.startBtnText, { color: '#000000' }]}>START NAVIGATION</Text>
            <MaterialCommunityIcons name="navigation-variant" size={24} color="black" />
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 5000,
    alignItems: 'center',
  },
  topPill: {
    flexDirection: 'row',
    borderRadius: 32,
    padding: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  topModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 26,
    gap: 12,
    minWidth: 130,
  },
  modeTextContainer: {
    flexDirection: 'column',
  },
  topModeLabel: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
    lineHeight: 18,
  },
  topEtaText: {
    fontSize: 13,
    fontFamily: typography.primary.medium,
    marginTop: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5000,
    paddingHorizontal: 20,
  },
  bottomCard: {
    borderRadius: 36,
    borderWidth: 1.5,
    padding: 24,
    gap: 20,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destTitle: {
    fontSize: 26,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.8,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  destSub: {
    fontSize: 17,
    fontFamily: typography.primary.medium,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.2,
  },
  closeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  startBtn: {
    height: 68,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  startBtnText: {
    color: 'white',
    fontSize: 19,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.8,
  },
});
