import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigationStore, TransportMode } from '../store/useNavigationStore';
import { navigationService } from '../services/navigationService';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

/**
 * RoutePlanningSheet: Advanced mode selector before starting navigation.
 * Features predictive ETAs for Car, Walk, and Cycle.
 */
export const RoutePlanningSheet = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isPlanning, setPlanning, setNavigating, transportMode, setTransportMode, setRoute } =
    useNavigationStore();
  const { selectedPoi } = usePOIStore();
  const userCoords = useLocationStore((s) => s.logicalCoords);

  const [etas, setEtas] = useState<Record<TransportMode, number | null>>({
    driving: null,
    walking: null,
    cycling: null,
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
      const modes: TransportMode[] = ['driving', 'walking', 'cycling'];
      const results = await Promise.all(
        modes.map((m) => navigationService.getRoute({ origin, destination, mode: m }))
      );

      const newEtas: any = {};
      results.forEach((res, i) => {
        newEtas[modes[i]] = res.properties.durationEstimate;
      });
      setEtas(newEtas);
    } catch (error) {
      console.error('[RoutePlanning] Failed to fetch ETAs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPlanning) return null;

  const formatEta = (seconds: number | null) => {
    if (seconds === null) return '--';
    const mins = Math.round(seconds / 60);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins}m`;
  };

  const handleStart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Ensure the current route in the store matches the selected mode
    if (selectedPoi && userCoords) {
        const origin = { lat: userCoords[1], lng: userCoords[0] };
        const destination = { lat: selectedPoi.coordinates[1], lng: selectedPoi.coordinates[0] };
        const finalRoute = await navigationService.getRoute({ origin, destination, mode: transportMode });
        setRoute(finalRoute);
    }
    
    setPlanning(false);
    setNavigating(true);
  };

  const renderModeOption = (mode: TransportMode, icon: string, label: string) => {
    const isActive = transportMode === mode;
    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setTransportMode(mode);
        }}
        style={[
          styles.modeOption,
          {
            backgroundColor: isActive ? theme.colors.brand.primary : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={28}
          color={isActive ? 'white' : theme.colors.text.muted}
        />
        <Text style={[styles.modeLabel, { color: isActive ? 'white' : theme.colors.text.primary }]}>
          {label}
        </Text>
        <Text style={[styles.etaText, { color: isActive ? 'rgba(255,255,255,0.8)' : theme.colors.text.muted }]}>
          {loading ? <ActivityIndicator size="small" color={isActive ? 'white' : theme.colors.brand.primary} /> : formatEta(etas[mode])}
        </Text>
      </Pressable>
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      exiting={FadeOutDown}
      style={[styles.container, { paddingBottom: insets.bottom + 20 }]}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.glass.background, borderColor: theme.colors.glass.border }]}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Plan your route</Text>
          <Pressable onPress={() => setPlanning(false)} style={styles.closeBtn}>
            <Feather name="x" size={20} color={theme.colors.text.muted} />
          </Pressable>
        </View>

        <View style={styles.modesRow}>
          {renderModeOption('driving', 'car', 'Drive')}
          {renderModeOption('walking', 'walk', 'Walk')}
          {renderModeOption('cycling', 'bicycle', 'Cycle')}
        </View>

        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [
            styles.startBtn,
            { backgroundColor: theme.colors.brand.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.startBtnText}>START NAVIGATION</Text>
          <MaterialCommunityIcons name="navigation" size={20} color="white" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5000,
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeOption: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  modeLabel: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  etaText: {
    fontSize: 12,
    fontFamily: typography.primary.medium,
  },
  startBtn: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.bold,
    letterSpacing: 1,
  },
});
