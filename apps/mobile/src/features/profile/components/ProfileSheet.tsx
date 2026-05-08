import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, NativeGesture } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../../styles/typography';
import { useProfileStore } from '../store/useProfileStore';
import { UserAvatar } from '../../../components/ui/UserAvatar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSettings: () => void;
}

export const ProfileSheet = ({ isOpen, onClose, onSettings }: ProfileSheetProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useProfileStore();

  const islandState = useSharedValue(0); // 0: hidden, 0.5: mid, 1: full
  const startState = useSharedValue(0);
  const isScrollAtTop = useSharedValue(true);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const SNAP_POINTS = {
    HIDDEN: 0,
    MID: 0.5,
    FULL: 1,
  };

  useEffect(() => {
    if (isOpen) {
      islandState.value = withSpring(SNAP_POINTS.MID, theme.motion.physics.magnetic);
    } else {
      islandState.value = withSpring(SNAP_POINTS.HIDDEN, theme.motion.physics.magnetic);
    }
  }, [isOpen]);

  // Sync scroll enabled state
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

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10]) // Give it a small threshold
    .onStart(() => {
      startState.value = islandState.value;
    })
    .onUpdate((e) => {
      // Allow dragging down from FULL if scroll is at top
      const isDraggingDown = e.translationY > 0;
      const canDragSheet = islandState.value < 0.99 || (isScrollAtTop.value && isDraggingDown);

      if (canDragSheet) {
        const fullTravel = SCREEN_HEIGHT * 0.8 - (insets.bottom + 5);
        const delta = -e.translationY / fullTravel;
        const newValue = startState.value + delta;
        islandState.value = Math.max(0, Math.min(1.0, newValue));
      }
    })
    .onEnd((e) => {
      const fullTravel = SCREEN_HEIGHT * 0.8 - (insets.bottom + 5);
      const velocity = -e.velocityY / fullTravel;
      const predictedPos = islandState.value + velocity * 0.12;

      let closest = SNAP_POINTS.HIDDEN;
      if (predictedPos > 0.75) {
        closest = SNAP_POINTS.FULL;
      } else if (predictedPos > 0.25) {
        closest = SNAP_POINTS.MID;
      }

      islandState.value = withSpring(closest, theme.motion.physics.magnetic, (finished) => {
        if (finished && closest === SNAP_POINTS.HIDDEN) {
          runOnJS(onClose)();
        }
      });
    });

  const islandStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      islandState.value,
      [0, 0.5, 1],
      [-SCREEN_HEIGHT, insets.bottom + 5, 0],
      Extrapolation.CLAMP
    );
    const height = interpolate(
      islandState.value,
      [0, 0.5, 1],
      [0, 480, SCREEN_HEIGHT * 0.9],
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
        [theme.colors.glass.background, theme.colors.bg.surface]
      ),
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      isScrollAtTop.value = event.contentOffset.y <= 0;
    },
  });

  if (!profile && !isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <GestureDetector gesture={Gesture.Simultaneous(gesture, Gesture.Native())}>
        <Animated.View style={[styles.container, theme.shadows.soft, islandStyle]}>
          <Animated.View
            style={[
              styles.background,
              islandBackgroundStyle,
              { borderColor: theme.colors.glass.border },
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.controlBar}>
              <Pressable onPress={onSettings} style={styles.iconButton}>
                <Ionicons name="log-out-outline" size={24} color={theme.colors.text.primary} />
              </Pressable>
              <Pressable onPress={() => {
                islandState.value = withSpring(0, theme.motion.physics.magnetic, () => {
                  runOnJS(onClose)();
                });
              }} style={styles.iconButton}>
                <Ionicons name="close" size={28} color={theme.colors.text.primary} />
              </Pressable>
            </View>

            <Animated.ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              bounces={true}
              scrollEnabled={scrollEnabled}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
              {profile && (
                <>
                  <View style={styles.identitySection}>
                    <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
                      {profile.name}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                      Confianza
                    </Text>
                    
                    <View style={styles.illustrationPlaceholder}>
                      <UserAvatar size={120} url={profile.avatarUrl} />
                    </View>
                  </View>

                  <View style={styles.progressCard}>
                    <Text style={[styles.motivationalText, { color: theme.colors.text.secondary }]}>
                      You're managing many moments better. Revise your signs to catch every moment.
                    </Text>
                    <View style={styles.divider} />
                    <View style={styles.levelRow}>
                      <View style={styles.levelBadge}>
                        <Ionicons name="shield-checkmark" size={16} color={theme.colors.brand.primary} />
                        <Text style={[styles.levelText, { color: theme.colors.brand.primary }]}>Lv. 4</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '68%', backgroundColor: theme.colors.brand.primary }]} />
                      </View>
                      <Text style={[styles.percentageText, { color: theme.colors.brand.primary }]}>68%</Text>
                    </View>
                  </View>

                  <View style={[styles.actionCard, { backgroundColor: theme.colors.bg.surface }]}>
                    <View style={styles.actionHeader}>
                       <View style={styles.hourglassIcon}>
                         <Ionicons name="hourglass-outline" size={32} color={theme.colors.text.secondary} />
                       </View>
                       <View style={styles.actionTextContainer}>
                          <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>
                            Esperando cualidades ocultas...
                          </Text>
                          <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>
                            Verás los resultados cuando tus amigos/familia respondan
                          </Text>
                       </View>
                    </View>
                    <Pressable style={[styles.actionButton, { backgroundColor: theme.colors.brand.primary }]}>
                      <Text style={styles.actionButtonText}>Compartir con amigos</Text>
                    </Pressable>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={[styles.statItemSmall, { backgroundColor: theme.colors.bg.surface }]}>
                      <Ionicons name="calendar-outline" size={24} color="#6366f1" style={styles.statIcon} />
                      <View style={styles.statTextContainer}>
                        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>11/20</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.text.muted }]} numberOfLines={1}>Actividades</Text>
                      </View>
                    </View>
                    <View style={[styles.statItemSmall, { backgroundColor: theme.colors.bg.surface }]}>
                      <Ionicons name="flame" size={24} color="#ef4444" style={styles.statIcon} />
                      <View style={styles.statTextContainer}>
                        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>5</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.text.muted }]} numberOfLines={1}>Racha</Text>
                      </View>
                    </View>
                    <View style={[styles.statItemSmall, { backgroundColor: theme.colors.bg.surface }]}>
                      <Ionicons name="trophy-outline" size={24} color="#eab308" style={styles.statIcon} />
                      <View style={styles.statTextContainer}>
                        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>1h 23m</Text>
                        <Text style={[styles.statLabel, { color: theme.colors.text.muted }]} numberOfLines={1}>Tiempo</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Animated.ScrollView>
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
    zIndex: 2500,
  },
  background: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
  },
  handleContainer: {
    paddingTop: 8,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  identitySection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    marginBottom: 16,
  },
  illustrationPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  motivationalText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    minWidth: 35,
  },
  actionCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  actionHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  hourglassIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: typography.primary.medium,
    lineHeight: 18,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  statItemSmall: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 24,
    gap: 6,
  },
  statIcon: {
    marginBottom: 4,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: typography.primary.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
