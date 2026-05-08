import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Hooks & State
import { useNavigationStore } from '../store/useNavigationStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useAppTheme } from '../../../hooks/useAppTheme';

export const RoutePlanningSheet = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const { 
    isPlanning, 
    setPlanning, 
    setNavigating, 
    transportMode, 
    setTransportMode, 
    routeMetadata,
    metadata,
    isFetching,
  } = useNavigationStore();
  
  const { selectedPoi } = usePOIStore();

  if (!isPlanning) return null;

  const formatEta = (seconds: number | null | undefined) => {
    if (isFetching) return 'Calculating...';
    if (seconds === null || seconds === undefined || seconds === 0) return 'Tap to refresh';
    const mins = Math.round(seconds / 60);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m`;
    }
    return `${mins} min`;
  };

  const handleStart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPlanning(false);
    setNavigating(true);
  };

  // Use pre-loaded metadata from the store
  const activeDuration = isFetching ? null : (metadata[transportMode]?.duration || routeMetadata?.duration);
  const activeDistance = isFetching ? null : (metadata[transportMode]?.distance || routeMetadata?.distance);

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.glass.background,
        borderColor: theme.colors.glass.border,
        paddingBottom: insets.bottom + 20
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.main }]}>
            {selectedPoi?.displayName || 'Route Planning'}
          </Text>
          <Pressable 
            onPress={() => setPlanning(false)}
            style={styles.closeButton}
          >
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text.muted} />
          </Pressable>
        </View>

        <View style={styles.modesContainer}>
          {(['driving', 'walking'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => {
                console.log(`[UI] 🔵 User clicked mode: ${mode}`);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTransportMode(mode);
              }}
              style={[
                styles.modeButton,
                transportMode === mode && { backgroundColor: theme.colors.brand.primary }
              ]}
            >
              <MaterialCommunityIcons 
                name={mode === 'driving' ? 'car' : 'walk'} 
                size={24} 
                color={transportMode === mode ? '#000' : theme.colors.text.muted} 
              />
              <View style={styles.modeTextContainer}>
                <Text style={[
                  styles.modeLabel, 
                  { color: transportMode === mode ? '#000' : theme.colors.text.main }
                ]}>
                  {mode === 'driving' ? 'Drive' : 'Walk'}
                </Text>
                <Text style={[
                  styles.modeEta, 
                  { color: transportMode === mode ? '#000' : theme.colors.text.muted }
                ]}>
                  {formatEta(metadata[mode]?.duration)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: theme.colors.brand.primary }]}>
              {activeDuration ? formatEta(activeDuration) : '--'}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.text.muted }]}>
              {activeDistance ? `${(activeDistance / 1000).toFixed(1)} km` : '--'}
            </Text>
          </View>
        </View>

        <Pressable 
          onPress={handleStart}
          style={[styles.startButton, { backgroundColor: theme.colors.brand.primary }]}
        >
          <MaterialCommunityIcons name="navigation" size={24} color="#000" />
          <Text style={styles.startButtonText}>START NAVIGATION</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    zIndex: 2000,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  modeEta: {
    fontSize: 12,
  },
  metricsRow: {
    marginBottom: 24,
    alignItems: 'center',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
