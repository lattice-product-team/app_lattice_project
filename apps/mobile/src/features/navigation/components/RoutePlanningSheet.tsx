import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolation,
  SharedValue
} from 'react-native-reanimated';

// Hooks & State
import { useNavigationStore } from '../store/useNavigationStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { Button } from '../../../components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RoutePlanningSheetProps {
  visibility: SharedValue<number>;
}

export const RoutePlanningSheet = ({ visibility }: RoutePlanningSheetProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const { 
    isPlanning, 
    setPlanning, 
    startNavigation,
    transportMode, 
    setTransportMode, 
    routeMetadata,
    metadata,
    isFetching,
  } = useNavigationStore();
  
  const { selectedPoi } = usePOIStore();
  const { selectedEvent } = useEventStore();

  const internalState = useSharedValue(0);

  useEffect(() => {
    internalState.value = withSpring(isPlanning ? 1 : 0, theme.motion.physics.magnetic);
  }, [isPlanning]);

  const rContainerStyle = useAnimatedStyle(() => {
    const height = 280 + insets.bottom; // Even more compact without title
    const margin = 16;
    return {
      transform: [
        { 
          translateY: interpolate(
            internalState.value, 
            [0, 1], 
            [height, 0], 
            Extrapolation.CLAMP
          ) 
        }
      ],
      opacity: interpolate(internalState.value, [0, 0.1], [0, 1], Extrapolation.CLAMP),
      marginHorizontal: margin,
      bottom: insets.bottom + 8,
    };
  });

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
    startNavigation();
  };

  const activeDuration = isFetching ? null : (metadata[transportMode]?.duration || routeMetadata?.duration);
  const activeDistance = isFetching ? null : (metadata[transportMode]?.distance || routeMetadata?.distance);

  return (
    <Animated.View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.glass.background,
        borderColor: theme.colors.glass.border,
      },
      rContainerStyle
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.dragHandle} />
          <Pressable 
            onPress={() => setPlanning(false)}
            style={styles.closeButton}
          >
            <MaterialCommunityIcons name="close" size={20} color={theme.colors.text.muted} />
          </Pressable>
        </View>

        <View style={styles.modesContainer}>
          {(['driving', 'walking', 'bicycle'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTransportMode(mode);
              }}
              style={[
                styles.modeButton,
                transportMode === mode && { backgroundColor: theme.colors.brand.primary }
              ]}
            >
              <MaterialCommunityIcons 
                name={mode === 'driving' ? 'car' : mode === 'walking' ? 'walk' : 'bicycle'} 
                size={24} 
                color={transportMode === mode ? '#000' : theme.colors.text.muted} 
              />
              <View style={styles.modeTextContainer}>
                <Text style={[
                  styles.modeLabel, 
                  { color: transportMode === mode ? '#000' : theme.colors.text.main }
                ]}>
                  {mode === 'driving' ? 'Drive' : mode === 'walking' ? 'Walk' : 'Bike'}
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
            <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>
              {activeDuration ? formatEta(activeDuration) : '--'}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.text.muted }]}>
              {activeDistance ? `${(activeDistance / 1000).toFixed(1)} km` : '--'}
            </Text>
          </View>

          {/* Elevation / Slope Info for Active Modes */}
          {(transportMode === 'walking' || transportMode === 'bicycle') && (
            <View style={[styles.metric, styles.metricBorder]}>
              <Text style={[styles.metricValue, { color: '#32D74B' }]}>
                {transportMode === 'bicycle' ? '+14m' : '+8m'}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.colors.text.muted }]}>
                Elevation
              </Text>
            </View>
          )}
        </View>

        <Button
          label="START NAVIGATION"
          icon="navigation"
          variant="tertiary"
          onPress={handleStart}
          style={styles.startButton}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 32,
    borderWidth: 1,
    zIndex: 2000,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dragHandle: {
    width: 32,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  modesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 4,
  },
  modeTextContainer: {
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  modeEta: {
    fontSize: 11,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 32,
  },
  metric: {
    alignItems: 'center',
  },
  metricBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    paddingLeft: 40,
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
