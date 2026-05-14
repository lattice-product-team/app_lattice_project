import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Alert,
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
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Flame, 
  Calendar, 
  Trophy,
  Share2
} from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../../styles/typography';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { SheetHeader } from '../../map/components/SheetHeader';
import { ActionPillBar } from '../../map/components/ActionPillBar';
import { MetricGrid } from '../../map/components/MetricGrid';
import { UserAvatar } from '../../../components/ui/UserAvatar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSettings: () => void;
  externalState?: any;
}

export const ProfileSheet = ({ isOpen, onClose, onSettings, externalState }: ProfileSheetProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useProfileStore();

  const islandState = useSharedValue(0);
  const startState = useSharedValue(0);
  const isScrollAtTop = useSharedValue(true);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const SNAP_POINTS = {
    HIDDEN: 0,
    MID: 0.34,
    FULL: 1.0,
  };

  const snappySpring = {
    damping: 25,
    stiffness: 160,
    mass: 0.8,
  };

  // Sync state with isOpen prop
  React.useEffect(() => {
    if (isOpen) {
      islandState.value = withSpring(SNAP_POINTS.MID, snappySpring);
    } else {
      islandState.value = withSpring(SNAP_POINTS.HIDDEN, snappySpring);
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
    .activeOffsetY([-10, 10]) 
    .onStart(() => {
      startState.value = islandState.value;
    })
    .onUpdate((e) => {
      const isDraggingDown = e.translationY > 0;
      const canDragSheet = islandState.value < 0.99 || (isScrollAtTop.value && isDraggingDown);

      if (canDragSheet) {
        const fullTravel = SCREEN_HEIGHT * 0.8;
        const delta = -e.translationY / fullTravel;
        islandState.value = Math.max(0, Math.min(1.0, startState.value + delta));
      }
    })
    .onEnd((e) => {
      const fullTravel = SCREEN_HEIGHT * 0.8;
      const velocity = -e.velocityY / fullTravel;
      const predictedPos = islandState.value + velocity * 0.12;

      if (predictedPos < SNAP_POINTS.MID * 0.5) {
        runOnJS(onClose)();
        islandState.value = withSpring(SNAP_POINTS.HIDDEN, snappySpring);
      } else if (predictedPos < (SNAP_POINTS.MID + SNAP_POINTS.FULL) / 2) {
        islandState.value = withSpring(SNAP_POINTS.MID, snappySpring);
      } else {
        islandState.value = withSpring(SNAP_POINTS.FULL, snappySpring);
      }
    });

  const islandStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      islandState.value,
      [0, SNAP_POINTS.MID, 1],
      [-SCREEN_HEIGHT, insets.bottom + 5, 0],
      Extrapolation.CLAMP
    );
    const fullHeight = SCREEN_HEIGHT - (insets.top + 80);
    const midHeight = 320; 
    const height = interpolate(
      islandState.value,
      [0, SNAP_POINTS.MID, 1],
      [0, midHeight, fullHeight],
      Extrapolation.CLAMP
    );

    const margin = interpolate(islandState.value, [SNAP_POINTS.MID, 0.8], [12, 0], Extrapolation.CLAMP);

    return {
      height,
      bottom,
      marginHorizontal: margin,
    };
  });

  const islandBackgroundStyle = useAnimatedStyle(() => {
    const radius = interpolate(islandState.value, [0.8, 1], [32, 0], Extrapolation.CLAMP);
    const backgroundColor = theme.colors.bg.surface;

    return {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor,
    };
  });

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      isScrollAtTop.value = event.contentOffset.y <= 0;
    },
  });

  const handleCloseInternal = () => {
    runOnJS(onClose)();
    islandState.value = withSpring(SNAP_POINTS.HIDDEN, snappySpring);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres salir de Lattice?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          handleCloseInternal();
          useAuthStore.getState().logout();
        },
      },
    ]);
  };

  const profileActions = [
    {
      id: 'share',
      label: 'Compartir',
      icon: 'Share2',
      variant: 'tertiary' as const,
      onPress: () => {},
    },
    {
      id: 'settings',
      label: 'Ajustes',
      icon: 'Settings',
      variant: 'tertiary' as const,
      onPress: onSettings,
    },
    {
      id: 'logout',
      label: 'Salir',
      icon: 'LogOut',
      variant: 'tertiary' as const,
      onPress: handleLogout,
    },
  ];

  const profileMetrics = []; // Replaced by dynamic metrics in render

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <GestureDetector gesture={Gesture.Simultaneous(gesture, Gesture.Native())}>
        <Animated.View style={[styles.container, theme.shadows.soft, islandStyle]}>
          <Animated.View
            style={[
              styles.background,
              islandBackgroundStyle,
              { borderColor: theme.dark ? theme.colors.glass.border : 'rgba(0,0,0,0.05)' },
            ]}
          >
            {profile ? (
              <>
                <SheetHeader
                  title={profile.name}
                  subtitle="MI PERFIL"
                  onClose={handleCloseInternal}
                  scrollY={scrollY}
                  islandState={islandState}
                />
                
                <Animated.ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  bounces={true}
                  scrollEnabled={scrollEnabled}
                  onScroll={scrollHandler}
                  scrollEventThrottle={16}
                >
                  <View style={styles.topSection}>
                    <View style={styles.avatarContainer}>
                      <UserAvatar size={100} url={profile.avatarUrl} />
                    </View>
                    
                    {/* Level Progress Section - No background, aligned margins */}
                    <View style={styles.progressCard}>
                      <View style={styles.levelRow}>
                        <View style={styles.levelBadge}>
                          <ShieldCheck size={20} color={theme.colors.brand.primary} />
                          <Text style={[styles.levelText, { color: theme.colors.brand.primary }]}>
                            Nivel {Math.floor((profile.stats.latticePoints || 0) / 100) + 1}
                          </Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View 
                            style={[
                              styles.progressBarFill, 
                              { 
                                width: `${(profile.stats.latticePoints || 0) % 100}%`, 
                                backgroundColor: theme.colors.brand.primary 
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.percentageText, { color: theme.colors.brand.primary }]}>
                          {(profile.stats.latticePoints || 0) % 100}%
                        </Text>
                      </View>
                      <Text style={[styles.motivationalText, { color: theme.colors.text.secondary }]}>
                        Estás a {(100 - (profile.stats.latticePoints || 0) % 100)} puntos del siguiente nivel
                      </Text>
                    </View>
                  </View>

                  <ActionPillBar actions={profileActions} />
                  
                  <MetricGrid metrics={[
                    {
                      label: 'Actividades',
                      value: `${profile.stats.eventsAttended || 0}`,
                      icon: 'Calendar',
                      color: '#6366f1',
                    },
                    {
                      label: 'Racha',
                      value: `${profile.stats.streak || 0}`,
                      icon: 'Flame',
                      color: '#ef4444',
                    },
                    {
                      label: 'Tiempo',
                      value: profile.stats.totalTime || '0h',
                      icon: 'Trophy',
                      color: '#eab308',
                    },
                  ]} />
                  
                  <View style={styles.content}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Sobre mí</Text>
                    <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
                      {profile.bio || "No hay descripción disponible."}
                    </Text>
                  </View>
                  <View style={{ height: insets.bottom + 80 }} />
                </Animated.ScrollView>
              </>
            ) : (
              <View style={styles.loading}>
                <ActivityIndicator color={theme.colors.brand.primary} />
              </View>
            )}
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
  scrollContent: {
    paddingBottom: 60,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: typography.primary.regular,
    marginBottom: 24,
  },
  topSection: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  progressCard: {
    width: '100%',
    paddingVertical: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
  motivationalText: {
    fontSize: 12,
    fontFamily: typography.primary.medium,
    lineHeight: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

