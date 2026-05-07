import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolation,
  useAnimatedProps,
  interpolateColor,
  useAnimatedReaction,
  runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { typography } from '../../../styles/typography';
import { LatticeEvent } from '../../../types';
import { useEventDetails } from '../hooks/useEventDetails';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedSafeBlurView = Animated.createAnimatedComponent(SafeBlurView);

interface EventDetailSheetProps {
  event: LatticeEvent | null;
  onClose: () => void;
}

export const EventDetailSheet = ({ event, onClose }: EventDetailSheetProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { details, loading } = useEventDetails(event?.id ? String(event.id) : null);
  
  const { 
    getFilteredPOIs 
  } = usePOIStore();
  const setNavigating = useNavigationStore((s) => s.setNavigating);

  const islandState = useSharedValue(0); // 0: hidden, 0.5: mid, 1: full
  const startState = useSharedValue(0);
  const [scrollEnabled, setScrollEnabled] = React.useState(false);
  
  const SNAP_POINTS = {
    HIDDEN: 0,
    MID: 0.5,
    FULL: 1
  };

  useEffect(() => {
    if (event?.id) {
      islandState.value = withSpring(SNAP_POINTS.MID, theme.motion.physics.magnetic);
    } else {
      islandState.value = withSpring(SNAP_POINTS.HIDDEN, theme.motion.physics.magnetic);
    }
  }, [event?.id]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startState.value = islandState.value;
    })
    .onUpdate((e) => {
      // Dynamic divisor for 1:1 tracking
      const fullTravel = (SCREEN_HEIGHT * 0.80) - (insets.bottom + 5);
      const delta = -e.translationY / fullTravel;
      const newValue = startState.value + delta;
      // Clamp to minimum 0.5 (Nivel 2) during active drag, and 1.0 max
      islandState.value = Math.max(0.5, Math.min(1.0, newValue));
    })
    .onEnd((e) => {
      const fullTravel = (SCREEN_HEIGHT * 0.80) - (insets.bottom + 5);
      const velocity = -e.velocityY / fullTravel;
      const predictedPos = islandState.value + velocity * 0.12;

      // Never hide via drag, only snap between MID and FULL
      if (predictedPos < 0.75) {
        islandState.value = withSpring(SNAP_POINTS.MID, theme.motion.physics.magnetic);
      } else {
        islandState.value = withSpring(SNAP_POINTS.FULL, theme.motion.physics.magnetic);
      }
    });

  const islandStyle = useAnimatedStyle(() => {
    const bottom = interpolate(islandState.value, [0, 0.5, 1], [-SCREEN_HEIGHT, insets.bottom + 5, 0], Extrapolation.CLAMP);
    const height = interpolate(
      islandState.value,
      [0, 0.5, 1],
      [0, 450, SCREEN_HEIGHT * 0.80],
      Extrapolation.CLAMP
    );

    const margin = interpolate(islandState.value, [0.5, 0.8], [12, 0], Extrapolation.CLAMP);

    return {
      height,
      bottom,
      marginHorizontal: margin,
    };
  });

  const islandBackgroundStyle = useAnimatedStyle(() => {
    const radius = interpolate(islandState.value, [0.8, 1], [32, 0], Extrapolation.CLAMP);
    return {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor: interpolateColor(
        islandState.value,
        [0.7, 1],
        ['transparent', theme.colors.bg.surface]
      ),
    };
  });

  const blurProps = useAnimatedProps(() => {
    return {
      // intensity should be passed as a regular prop for SafeBlurView to handle it correctly
    };
  });

  // Sync scroll enabled state to avoid render-time reads of islandState.value
  useAnimatedReaction(
    () => islandState.value,
    (curr) => {
      const shouldEnable = curr > 0.9;
      if (shouldEnable !== scrollEnabled) {
        runOnJS(setScrollEnabled)(shouldEnable);
      }
    },
    [scrollEnabled]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, theme.shadows.soft, islandStyle]}>
          <Animated.View 
            style={[
              styles.background, 
              islandBackgroundStyle,
              { borderColor: theme.dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' }
            ]}
          >
            {/* 1. Base Blur Layer */}
            <SafeBlurView 
              tint={theme.colors.glass.tint}
              intensity={90}
              style={StyleSheet.absoluteFill}
            />

            {/* 2. Inner Glow & Color Overlay */}
            <View style={[styles.innerGlowBorder]} />

            {/* 3. Content Layer */}
            <View style={StyleSheet.absoluteFill}>
              {/* Header / Drag Handle */}
              <View style={styles.header}>
                <View style={styles.handle} />
                <View style={styles.headerActions}>
                  <Pressable 
                    style={[
                      styles.actionCircle,
                      { 
                        backgroundColor: theme.dark ? 'rgba(40, 40, 40, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                        borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        ...theme.shadows.soft
                      }
                    ]}
                  >
                    <Feather name="share" size={20} color={theme.colors.text.primary} />
                  </Pressable>
                  <View style={{ flex: 1 }} />
                  <Pressable 
                    onPress={onClose} 
                    style={[
                      styles.actionCircle,
                      { 
                        backgroundColor: theme.dark ? 'rgba(40, 40, 40, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                        borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        ...theme.shadows.soft
                      }
                    ]}
                  >
                    <Feather name="x" size={20} color={theme.colors.text.primary} />
                  </Pressable>
                </View>
                
                <View style={styles.titleSection}>
                  <Text style={[styles.title, { color: theme.colors.text.primary }]}>{details?.name || event?.name}</Text>
                  <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>{details?.type || event?.type}</Text>
                </View>
              </View>

              {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator color={theme.colors.brand.primary} />
                </View>
              ) : (
                <>
                  {/* Quick Actions */}
                  <View style={styles.quickActions}>
                    <Pressable 
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setNavigating(true);
                        onClose();
                      }}
                      style={({ pressed }) => [
                        styles.actionButton,
                        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
                      ]}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: theme.colors.brand.primary }]}>
                        <MaterialCommunityIcons name="car" size={24} color="white" />
                        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.actionBorder]} />
                      </View>
                      <Text style={[styles.actionLabel, { color: theme.colors.brand.primary }]}>Directions</Text>
                    </Pressable>
 
                    <Pressable 
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                      style={({ pressed }) => [
                        styles.actionButton,
                        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
                      ]}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: theme.dark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
                        <Feather name="phone" size={22} color={theme.colors.brand.primary} />
                        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.actionBorder, { borderColor: theme.colors.glass.border }]} />
                      </View>
                      <Text style={[styles.actionLabel, { color: theme.colors.brand.primary }]}>Call</Text>
                    </Pressable>
 
                    <Pressable 
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                      style={({ pressed }) => [
                        styles.actionButton,
                        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
                      ]}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: theme.dark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
                        <Feather name="globe" size={22} color={theme.colors.brand.primary} />
                        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.actionBorder, { borderColor: theme.colors.glass.border }]} />
                      </View>
                      <Text style={[styles.actionLabel, { color: theme.colors.brand.primary }]}>Website</Text>
                    </Pressable>
                  </View>
 
                  {/* Quick Services Bar */}
                  <View style={styles.servicesContainer}>
                    <Text style={[styles.servicesTitle, { color: theme.colors.text.muted }]}>Services Available</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false} 
                      contentContainerStyle={styles.servicesScroll}
                    >
                      {Array.from(new Set(getFilteredPOIs([]).map(p => p.category))).map(cat => {
                        const metadata = getCategoryMetadata(cat);
                        const isActive = activeCategoryFilters.includes(cat);
                        return (
                          <Pressable
                            key={cat}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              toggleCategoryFilter(cat);
                            }}
                            style={[
                              styles.serviceItem,
                              { backgroundColor: isActive ? theme.colors.brand.primary : (theme.dark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)') },
                              isActive && styles.activeService
                            ]}
                          >
                            <MaterialCommunityIcons 
                              name={metadata.icon as any} 
                              size={20} 
                              color={isActive ? 'white' : theme.colors.text.primary} 
                            />
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Info Grid */}
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, { color: theme.colors.text.muted }]}>Hours</Text>
                      <Text style={[styles.infoValue, { color: '#32D74B' }]}>{details?.openingHours || 'Open'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, { color: theme.colors.text.muted }]}>Rating</Text>
                      <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="thumb-up" size={16} color={theme.colors.text.primary} />
                        <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{details?.rating ? `${details.rating * 20}%` : '88%'}</Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, { color: theme.colors.text.muted }]}>Distance</Text>
                      <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="map-marker-distance" size={16} color={theme.colors.text.primary} />
                        <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{details?.distance || '900m'}</Text>
                      </View>
                    </View>
                  </View>

                  <ScrollView style={{ flex: 1 }} scrollEnabled={scrollEnabled}>
                    <View style={styles.content}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>About</Text>
                      <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
                        {details?.description || 'Loading event description...'}
                      </Text>
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2000,
  },
  background: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
  },
  innerGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    pointerEvents: 'none',
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4,
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: -4,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  actionIconInnerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    pointerEvents: 'none',
  },
  actionBorder: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: typography.primary.bold,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  infoItem: {
    gap: 4,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: typography.primary.regular,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  servicesTitle: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  servicesScroll: {
    gap: 12,
  },
  serviceItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  serviceItemInnerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    pointerEvents: 'none',
  },
  activeService: {
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
