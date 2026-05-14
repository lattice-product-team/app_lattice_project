import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  ActivityIndicator,
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
import { MapPin as MapPinIcon } from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../../styles/typography';
import { useDetailModel } from '../hooks/useDetailModel';
import { SheetHeader } from './SheetHeader';
import { ActionPillBar } from './ActionPillBar';
import { MetricGrid } from './MetricGrid';
import { GalleryCarousel } from './GalleryCarousel';
import { ReviewSection } from './ReviewSection';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

interface EventDetailSheetProps {
  islandState: Animated.SharedValue<number>;
  onClose: () => void;
}

export const EventDetailSheet = ({ islandState, onClose }: EventDetailSheetProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const model = useDetailModel();

  // Data persistence during closing
  const lastModelRef = useRef(model);
  if (model) lastModelRef.current = model;
  const displayModel = model || lastModelRef.current;

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

  const isPlanning = useNavigationStore((s) => s.isPlanning);
  const isNavigating = useNavigationStore((s) => s.isNavigating);

  // Sync state with model selection and navigation/planning modes
  useEffect(() => {
    if (model && !isPlanning && !isNavigating) {
      islandState.value = withSpring(SNAP_POINTS.MID, snappySpring);
    } else {
      // Immediate close without waiting for next tick if possible
      islandState.value = withSpring(SNAP_POINTS.HIDDEN, snappySpring);
    }
  }, [!!model, isPlanning, isNavigating]);

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
        runOnJS(onClose)(); // Deselect instantly
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
    const midHeight = 320; // Enough for header, pills, and metrics
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
    const backgroundColor = interpolateColor(
      islandState.value,
      [0.7, 1],
      [theme.colors.glass.background, theme.colors.bg.surface]
    );

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
    runOnJS(onClose)(); // Deselect instantly
    islandState.value = withSpring(SNAP_POINTS.HIDDEN, snappySpring);
  };

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
            {displayModel ? (
              <>
                <SheetHeader
                  title={displayModel.name}
                  subtitle={displayModel.subtitle}
                  bannerUrl={displayModel.bannerUrl}
                  logoUrl={displayModel.logoUrl}
                  categoryIcon={displayModel.categoryIcon}
                  onClose={handleCloseInternal}
                  onShare={() => {}}
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
                  <ActionPillBar actions={displayModel.actions} />
                  <MetricGrid metrics={displayModel.metrics} />
                  
                  {displayModel.social && (
                    <ReviewSection 
                      rating={displayModel.social.rating}
                      reviewsCount={displayModel.social.reviewsCount}
                      snippets={displayModel.social.snippets}
                      sourceUrl={displayModel.social.sourceUrl}
                    />
                  )}

                  {displayModel.galleryUrls && displayModel.galleryUrls.length > 0 && (
                    <GalleryCarousel 
                      images={displayModel.galleryUrls} 
                    />
                  )}
                  <View style={styles.content}>
                    {displayModel.parentName && (
                      <View style={[styles.eventBadge, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                        <MapPinIcon size={12} color={theme.colors.brand.primary} />
                        <Text style={[styles.eventBadgeText, { color: theme.colors.brand.primary }]}>
                          Located in {displayModel.parentName}
                        </Text>
                      </View>
                    )}
                    <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>About</Text>
                    <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
                      {displayModel.description}
                    </Text>

                    {displayModel.info && displayModel.info.length > 0 && (
                      <View style={styles.infoSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, marginTop: 24 }]}>
                          Information
                        </Text>
                        <View style={styles.infoGrid}>
                          {displayModel.info.map((item, idx) => {
                            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.InfoIcon;
                            return (
                              <View key={idx} style={styles.infoItem}>
                                <View style={[styles.infoIconBox, { backgroundColor: theme.colors.glass.subtle }]}>
                                  <Icon size={18} color={theme.colors.brand.primary} />
                                </View>
                                <View>
                                  <Text style={[styles.infoLabel, { color: theme.colors.text.muted }]}>
                                    {item.label}
                                  </Text>
                                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                                    {item.value}
                                  </Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}
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
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  eventBadgeText: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: typography.primary.regular,
  },
  infoSection: {
    marginTop: 8,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: typography.primary.medium,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
