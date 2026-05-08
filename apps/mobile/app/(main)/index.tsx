import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, ScrollView, Keyboard, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  useDerivedValue,
  useAnimatedProps,
  runOnJS,
  withTiming,
  Extrapolation,
  useAnimatedReaction,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Core Components
import { MapContent } from '../../src/features/map/components/MapContent';
import { AdaptiveControlOverlay } from '../../src/features/map/components/AdaptiveControlOverlay';
import { FloatingSearchBar } from '../../src/components/ui/FloatingSearchBar';
import { DiscoveryDashboard } from '../../src/features/map/components/DiscoveryDashboard';
import { SearchExperience } from '../../src/features/map/components/SearchExperience';
import { EventDetailSheet } from '../../src/features/map/components/EventDetailSheet';
import { POIMiniCard } from '../../src/features/map/components/POIMiniCard';
import { MapLoadingOverlay } from '../../src/features/map/components/MapLoadingOverlay';
import { InstructionBanner } from '../../src/components/navigation/InstructionBanner';
import { NavigationInfo } from '../../src/features/map/components/NavigationInfo';
import { useSearchHistory } from '../../src/features/map/hooks/useSearchHistory';
import { useSearchEvents } from '../../src/features/map/hooks/useSearchEvents';
import { useEventSpatial } from '../../src/features/map/hooks/useEventSpatial';
import { usePOIs } from '../../src/features/poi/hooks/usePOIs';

// Stores & Hooks
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { usePOIStore } from '../../src/features/poi/store/usePOIStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLocationStore } from '../../src/store/useLocationStore';
import { useMapUIStore } from '../../src/features/map/store/useMapUIStore';
import { useEventStore } from '../../src/features/event/store/useEventStore';
import { useNavigationStore } from '../../src/features/navigation/store/useNavigationStore';
import { useProfileStore } from '../../src/features/profile/store/useProfileStore';
import { normalizePOI } from '../../src/features/poi/adapters/poiAdapter';
import { MAPTILER_KEY } from '../../src/constants/mapConstants';
import { typography } from '../../src/styles/typography';
import { LatticeEvent } from '../../src/types';
import { useLocationService } from '../../src/hooks/useLocationService';
import { ProfileSheet } from '../../src/features/profile/components/ProfileSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SNAP_POINTS = [0, 0.5, 1];

export default function MapIndexPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Start location tracking
  useLocationService();
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const openAuthPrompt = useAuthStore((state) => state.openAuthPrompt);
  const triggerRecenter = useMapUIStore((state) => state.triggerRecenter);
  const isInitialLoadComplete = useMapUIStore((state) => state.isInitialLoadComplete);

  const { setProfile } = useProfileStore();

  // Sync Auth User to Profile Store
  useEffect(() => {
    if (user && !isGuest) {
      setProfile({
        id: String(user.id),
        name: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio || 'Urban explorer discovering the city.',
        stats: user.stats || {
          eventsAttended: 0,
          savedEvents: 0,
          latticePoints: 0,
        },
        medals: user.medals || [],
      });
    }
  }, [user, isGuest, setProfile]);

  // Map & POI State
  const { selectedPoiId, selectedPoi, selectPoi, deselect, selectedEventId, setSelectedEvent } =
    usePOIStore();

  const selectedEvent = useEventStore((s) => s.selectedEvent);
  const setCurrentEvent = useEventStore((s) => s.setCurrentEvent);

  const { isNavigating } = useNavigationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { events } = useSearchEvents(searchQuery);
  const { spatialData: eventSpatial } = useEventSpatial(selectedEvent?.id);
  const { data: globalPois } = usePOIs(); // Load global POIs

  // Merge global POIs with event-specific spatial data
  const mergedPois = useMemo(() => {
    const features = [...(globalPois?.features || [])];
    if (eventSpatial?.features) {
      features.push(...eventSpatial.features);
    }
    return { type: 'FeatureCollection', features };
  }, [globalPois, eventSpatial]);

  const [manualAR, setManualAR] = useState(false);
  const { saveSearch } = useSearchHistory();

  // Island State (0 = Compact, 0.5 = Medium, 1 = Full)
  const islandState = useSharedValue(0);
  const startState = useSharedValue(0);

  const handleProfilePress = useCallback(() => {
    Haptics.selectionAsync();
    if (isGuest) {
      openAuthPrompt('/(main)/profile');
    } else {
      setIsProfileOpen(true);
      // Hide main island when opening profile
      islandState.value = withSpring(0, theme.motion.physics.magnetic);
    }
  }, [isGuest, theme.motion.physics.magnetic, islandState, openAuthPrompt]);

  const preSearchLevel = useSharedValue(0);
  const isScrollAtTop = useSharedValue(true);

  const isPanning = useSharedValue(false);
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);
  const eventSheetState = useSharedValue(0);
  const profileSheetState = useSharedValue(0); // Track profile sheet state
  const screenMode = useSharedValue(1); // 0: Explore, 1: Map (Map as default)
  const [activeMode, setActiveMode] = useState(1);
  const islandOpacity = useDerivedValue(() => {
    // Keep visible during profile/events, only hide if needed for Level 3 search
    return withTiming(1, { duration: 100 });
  });

  const [isHeaderEditable, setIsHeaderEditable] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  // Effect removed to prevent auto-expanding search on POI click
  useAnimatedReaction(
    () => islandState.value > 0.1,
    (isReady, prev) => {
      if (isReady !== prev) {
        runOnJS(setIsHeaderEditable)(isReady);
      }
    }
  );

  useAnimatedReaction(
    () => islandState.value,
    (curr) => {
      const shouldEnable = curr > 0.98;
      if (shouldEnable !== scrollEnabled) {
        runOnJS(setScrollEnabled)(shouldEnable);
      }
    },
    [scrollEnabled]
  );

  const handleEventSelect = useCallback(
    (event: LatticeEvent) => {
      // Save current level before collapsing
      preSearchLevel.value = islandState.value;

      setSelectedEvent(event.id);
      setCurrentEvent(event);
      selectPoi(null); // Clear any active POI selection
      islandState.value = withSpring(0, theme.motion.physics.magnetic); // Collapse search island
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [setSelectedEvent, setCurrentEvent, selectPoi, islandState]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedEvent(null);
    setCurrentEvent(null);
    selectPoi(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    islandState.value = withSpring(0, theme.motion.physics.magnetic);
  }, [setSelectedEvent, setCurrentEvent, selectPoi, islandState]);

  const dismissSearch = useCallback(() => {
    setIsSearching(false);
    Keyboard.dismiss();
  }, []);

  // Cancel search only if island is MANUALLY dragged down
  useAnimatedReaction(
    () => islandState.value,
    (val) => {
      // Solo cancelamos si hay un gesto activo (panning), estamos buscando y bajamos del umbral
      if (val < 0.8 && isSearching && isPanning.value) {
        runOnJS(dismissSearch)();
      }
      // Activamos búsqueda si subimos al Nivel 3
      if (val > 0.8 && !isSearching && isPanning.value) {
        runOnJS(setIsSearching)(true);
      }
    },
    [isSearching, dismissSearch]
  );

  // Automatically close event details if the top island is expanded to Level 2
  useAnimatedReaction(
    () => islandState.value,
    (curr, prev) => {
      if (curr > 0.1 && (prev || 0) <= 0.1 && selectedEvent) {
        runOnJS(handleCloseDetails)();
      }
    },
    [selectedEvent, handleCloseDetails]
  );

  const islandHeight = useDerivedValue(() => {
    const fullHeight = SCREEN_HEIGHT;
    if (islandState.value <= 0.5) {
      return interpolate(islandState.value, [0, 0.5], [55, 380], Extrapolation.CLAMP);
    }
    return interpolate(islandState.value, [0.5, 1], [380, fullHeight], Extrapolation.CLAMP);
  });

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .failOffsetX([-20, 20])
    .onStart(() => {
      isPanning.value = true;
      startState.value = islandState.value;
    })
    .onUpdate((event) => {
      // Allow dragging up (collapse) if at Level 3 and scroll is at top
      const isDraggingUp = event.translationY < 0;
      const canDragSheet = islandState.value < 0.99 || (isScrollAtTop.value && isDraggingUp);

      if (canDragSheet) {
        // Dynamic divisor for 1:1 tracking
        const fullTravel = SCREEN_HEIGHT - 65;
        const stateDelta = event.translationY / fullTravel;
        let newPos = startState.value + stateDelta;
        islandState.value = Math.max(0, Math.min(1, newPos));
      }
    })
    .onEnd((event) => {
      isPanning.value = false;
      const fullTravel = SCREEN_HEIGHT - 65;
      const velocity = event.velocityY / fullTravel;
      let predictedPos = islandState.value + velocity * 0.12;

      // ANTI-SKIP PROTECTION:
      // If we start at Level 1 (0), don't allow snapping directly to Level 3 (1.0).
      // This forces the user to pass through Level 2 (0.5) first as requested.
      if (startState.value === 0) {
        predictedPos = Math.min(predictedPos, 0.7);
      }
      // If we start at Level 2 (0.5), we can go to 1 or 3, but not hide the sheet.
      if (startState.value === 0.5) {
        predictedPos = Math.max(0.2, Math.min(predictedPos, 1.2));
      }

      let closest = SNAP_POINTS[0];
      let minDiff = Math.abs(predictedPos - SNAP_POINTS[0]);

      SNAP_POINTS.forEach((point) => {
        const diff = Math.abs(predictedPos - point);
        if (diff < minDiff) {
          minDiff = diff;
          closest = point;
        }
      });

      islandState.value = withSpring(closest, theme.motion.physics.magnetic, (finished) => {
        if (finished && (closest === 0 || closest === 0.5)) {
          preSearchLevel.value = closest;
        }
      });

      if (closest !== startState.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    });

  const islandStyle = useAnimatedStyle(() => {
    const margin = interpolate(islandState.value, [0.5, 1], [12, 0], Extrapolation.CLAMP);
    const radius = 32;
    const top = interpolate(
      islandState.value,
      [0, 0.5, 1],
      [insets.top + 6, insets.top + 10, 0],
      Extrapolation.CLAMP
    );

    return {
      height: islandHeight.value,
      left: margin,
      right: margin,
      top,
      borderBottomLeftRadius: interpolate(islandState.value, [0.5, 1], [radius, 0], Extrapolation.CLAMP),
      borderBottomRightRadius: interpolate(islandState.value, [0.5, 1], [radius, 0], Extrapolation.CLAMP),
      borderTopLeftRadius: interpolate(islandState.value, [0.5, 1], [radius, 0], Extrapolation.CLAMP),
      borderTopRightRadius: interpolate(islandState.value, [0.5, 1], [radius, 0], Extrapolation.CLAMP),
      opacity: islandOpacity.value,
    };
  });

  const islandBackgroundStyle = useAnimatedStyle(() => {
    const radius = 32;
    return {
      borderBottomLeftRadius: interpolate(
        islandState.value,
        [0.8, 1],
        [radius, 0],
        Extrapolation.CLAMP
      ),
      borderBottomRightRadius: interpolate(
        islandState.value,
        [0.8, 1],
        [radius, 0],
        Extrapolation.CLAMP
      ),
      borderTopLeftRadius: interpolate(
        islandState.value,
        [0.5, 1],
        [radius, 0],
        Extrapolation.CLAMP
      ),
      borderTopRightRadius: interpolate(
        islandState.value,
        [0.5, 1],
        [radius, 0],
        Extrapolation.CLAMP
      ),
      backgroundColor: interpolateColor(
        islandState.value,
        [0.7, 0.95],
        [theme.colors.glass.background, theme.colors.bg.surface]
      ),
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    const paddingTop = interpolate(
      islandState.value,
      [0.5, 1],
      [11, insets.top + 5], // 11px to center in 58px height
      Extrapolation.CLAMP
    );
    return {
      paddingTop,
    };
  });

  const dimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.5, 1], [0, 0.6], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });

  const mainTranslateX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(screenMode.value === 1 ? 0 : SCREEN_WIDTH, {
            damping: 20,
            stiffness: 120,
            mass: 1,
          }),
        },
      ],
    };
  });

  const exploreTranslateX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(screenMode.value === 0 ? 0 : -SCREEN_WIDTH, {
            damping: 20,
            stiffness: 120,
            mass: 1,
          }),
        },
      ],
    };
  });

  const topDimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: 0, // Removed dark background as requested
    };
  });

  const controlsOpacityStyle = useAnimatedStyle(() => {
    const isLevel3 = islandState.value > 0.8; // Trigger hide slightly earlier for Level 3
    // Hide for profile, events, and Level 3 search
    const shouldHide = isProfileOpen || !!selectedEvent || isLevel3;
    return {
      opacity: withTiming(shouldHide ? 0 : 1, { duration: 150 }),
      pointerEvents: shouldHide ? 'none' : 'auto',
    };
  });

  const level2ContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.7, 0.85], [1, 0], Extrapolation.CLAMP);
    return {
      opacity,
      pointerEvents: islandState.value > 0.85 ? 'none' : 'auto',
    };
  });

  const level3ContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.8, 0.95], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      pointerEvents: islandState.value > 0.8 ? 'auto' : 'none',
    };
  });

  const dimmerProps = useAnimatedProps(() => {
    return {
      pointerEvents: islandState.value > 0.5 ? 'auto' : ('none' as any),
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      isScrollAtTop.value = event.contentOffset.y <= 0;
    },
  });

  const scrollProps = useAnimatedProps(() => {
    return {
      scrollEnabled: islandState.value > 0.9,
    };
  });

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
    deselect();
    setIsSearching(false);
    if (!selectedPoiId) {
      islandState.value = withSpring(preSearchLevel.value, theme.motion.physics.magnetic);
    }
  }, [deselect, selectedPoiId, preSearchLevel, islandState]);

  const onSelectSearchResult = useCallback(
    (name: string, coords?: [number, number]) => {
      saveSearch(name);
      setSearchQuery(name);
      setIsSearching(false);
      Keyboard.dismiss();

      // If we have coordinates, move map. For now just collapse.
      islandState.value = withSpring(0.5, theme.motion.physics.magnetic);

      if (coords) {
        console.log('Moving map to:', coords);
        // In a real app, we would use mapRef.current.flyTo
      }
    },
    [saveSearch, islandState]
  );

  const handleSelectCategory = useCallback((id: string) => {
    console.log('Selected Category:', id);
  }, []);

  const searchInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View style={[StyleSheet.absoluteFill, mainTranslateX]}>
        <MapContent
          poisGeoJSON={mergedPois}
          allEvents={events}
          sheetPosition={sheetPosition}
          islandState={islandState}
          onDeselect={handleMapPress}
          onSelectEvent={handleEventSelect}
          is3DActive={manualAR}
        />

      <InstructionBanner />

      <Pressable style={StyleSheet.absoluteFill} onPress={handleMapPress} pointerEvents="box-none">
        <Animated.View
          animatedProps={dimmerProps}
          style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }, dimmerStyle]}
        />
      </Pressable>

      <AdaptiveControlOverlay
        islandHeight={islandHeight}
        islandState={islandState}
        bottomOffset={insets.bottom + 5}
        onRecenter={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          triggerRecenter();
        }}
        onToggle3D={() => setManualAR(!manualAR)}
        is3DActive={manualAR}
        isVisible={activeMode === 1 && !isProfileOpen && !selectedEvent && islandState.value < 0.8}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'black', zIndex: 999 },
          topDimmerStyle,
        ]}
      />

      <GestureDetector gesture={Gesture.Simultaneous(gesture, Gesture.Native())}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.islandContainer, islandStyle]}
        >
          <Animated.View
            pointerEvents="auto"
            style={[
              styles.islandBackground,
              islandBackgroundStyle,
              { borderColor: theme.colors.glass.border },
            ]}
          >

            <Animated.View style={[styles.islandHeader, headerStyle]}>
              <FloatingSearchBar
                ref={searchInputRef}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (text.length > 0) setIsSearching(true);
                }}
                onProfilePress={handleProfilePress}
                onFocus={() => {
                  setIsSearching(true);
                  islandState.value = withSpring(1, theme.motion.physics.magnetic);
                }}
                onSubmit={() => {
                  saveSearch(searchQuery);
                  Keyboard.dismiss();
                }}
                onPress={() => {
                  if (selectedEvent) {
                    setSelectedEvent(null);
                    setCurrentEvent(null);
                  }
                  islandState.value = withSpring(1, theme.motion.physics.magnetic);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Wait for editable to become true before focusing
                  setTimeout(() => {
                    searchInputRef.current?.focus();
                  }, 100);
                }}
                avatarUrl={user?.avatarUrl}
                isGuest={isGuest}
                editable={isHeaderEditable}
              />
            </Animated.View>

            <Animated.ScrollView
              style={{ flex: 1 }}
              scrollEnabled={scrollEnabled}
              contentContainerStyle={styles.islandScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="handled"
              animatedProps={scrollProps}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
              <Animated.View style={level2ContentStyle}>
                <DiscoveryDashboard
                  islandState={islandState}
                  onSelectCategory={handleSelectCategory}
                  onSelectEvent={handleEventSelect}
                />
              </Animated.View>

              <Animated.View style={[StyleSheet.absoluteFill, level3ContentStyle, { top: 0 }]}>
                <SearchExperience
                  query={searchQuery}
                  onSelectResult={(q, coords) => {
                    // Clear search query when selecting from list to keep navigation clean
                    setSearchQuery('');
                    saveSearch(q);
                    setIsSearching(false);
                    Keyboard.dismiss();

                    // If we have coordinates, move map.
                    islandState.value = withSpring(0.5, theme.motion.physics.magnetic);

                    const match = events.find((e) => e.name.toLowerCase() === q.toLowerCase());
                    if (match) handleEventSelect(match);
                  }}
                />
              </Animated.View>
            </Animated.ScrollView>
          </Animated.View>

        </Animated.View>
      </GestureDetector>

      {selectedEvent && (
        <EventDetailSheet
          event={selectedEvent}
          onClose={handleCloseDetails}
          externalState={eventSheetState}
        />
      )}

      <POIMiniCard poi={selectedPoi} onClose={deselect} />

        <ProfileSheet
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
          }}
          externalState={profileSheetState}
          onSettings={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsProfileOpen(false);
            useAuthStore.getState().logout();
          }}
        />

      <NavigationInfo />

      </Animated.View>

      {/* Exploration Mode Placeholder */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.colors.bg.surface, zIndex: 1 },
          exploreTranslateX,
        ]}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: typography.primary.bold,
              color: theme.colors.text.primary,
              textAlign: 'center',
            }}
          >
            Exploración
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: typography.primary.regular,
              color: theme.colors.text.muted,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            Aquí aparecerán los próximos eventos y tus colecciones personales.
          </Text>
        </View>
      </Animated.View>

      {/* Persistent Toggle Button */}
      <Animated.View style={[styles.modeToggleContainer, { bottom: insets.bottom + 20 }, controlsOpacityStyle]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const nextMode = screenMode.value === 0 ? 1 : 0;
            screenMode.value = nextMode;
            setActiveMode(nextMode);
          }}
          style={[
            styles.modePill,
            {
              backgroundColor: theme.colors.glass.background,
              borderColor: theme.colors.glass.border,
              ...theme.shadows.soft,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modePillActive,
              { backgroundColor: 'rgba(255,255,255,0.9)' }, // Neutral Apple-like glass active state
              useAnimatedStyle(() => ({
                transform: [{ translateX: withSpring(screenMode.value * 96, { damping: 20, stiffness: 150 }) }],
              })),
            ]}
          />
          <View style={styles.modePillLabels}>
            <View style={styles.modeLabel}>
              <Feather
                name="compass"
                size={18}
                color={activeMode === 0 ? '#000' : theme.colors.text.muted}
              />
              <Text style={[styles.modeText, { color: activeMode === 0 ? '#000' : theme.colors.text.muted }]}>Explore</Text>
            </View>
            <View style={styles.modeLabel}>
              <Feather
                name="map"
                size={18}
                color={activeMode === 1 ? '#000' : theme.colors.text.muted}
              />
              <Text style={[styles.modeText, { color: activeMode === 1 ? '#000' : theme.colors.text.muted }]}>Mapa</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <MapLoadingOverlay isVisible={!isInitialLoadComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  islandContainer: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1000 },
  islandBackground: { flex: 1, borderRadius: 32, overflow: 'hidden', borderWidth: 1 },
  islandHeader: { paddingBottom: 11 },
  islandScrollContent: { paddingBottom: 30 },
  placeholderContent: { padding: 20, alignItems: 'center' },
  modeToggleContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 2000,
  },
  modePill: {
    flexDirection: 'row',
    width: 200,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  modePillActive: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 96,
    height: 42,
    borderRadius: 21,
  },
  modePillLabels: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },
  modeLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modeText: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
  },
});
