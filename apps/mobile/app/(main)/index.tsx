import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, ScrollView, Keyboard } from 'react-native';
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
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Core Components
import { MapContent } from '../../src/features/map/components/MapContent';
import { AdaptiveControlOverlay } from '../../src/features/map/components/AdaptiveControlOverlay';
import { FloatingSearchBar } from '../../src/components/ui/FloatingSearchBar';
import { SafeBlurView } from '../../src/components/ui/SafeBlurView';
import { DiscoveryDashboard } from '../../src/features/map/components/DiscoveryDashboard';
import { SearchExperience } from '../../src/features/map/components/SearchExperience';
import { EventDetailSheet } from '../../src/features/map/components/EventDetailSheet';
import { POIMiniCard } from '../../src/features/map/components/POIMiniCard';
import { MapLoadingOverlay } from '../../src/features/map/components/MapLoadingOverlay';
import { useSearchHistory } from '../../src/features/map/hooks/useSearchHistory';
import { useSearchEvents } from '../../src/features/map/hooks/useSearchEvents';
import { useVenueSpatial } from '../../src/features/map/hooks/useVenueSpatial';
import { usePOIs } from '../../src/features/poi/hooks/usePOIs';

// Stores & Hooks
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { usePOIStore } from '../../src/features/poi/store/usePOIStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLocationStore } from '../../src/store/useLocationStore';
import { useMapUIStore } from '../../src/features/map/store/useMapUIStore';
import { useEventStore } from '../../src/features/event/store/useEventStore';
import { normalizePOI } from '../../src/features/poi/adapters/poiAdapter';
import { MAPTILER_KEY } from '../../src/constants/mapConstants';
import { typography } from '../../src/styles/typography';
import { LatticeEvent } from '../../src/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedSafeBlurView = Animated.createAnimatedComponent(SafeBlurView);
const SNAP_POINTS = [0, 0.5, 1];
const SPRING_CONFIG = {
  damping: 30,
  stiffness: 150,
  mass: 1.0,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export default function MapIndexPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const openAuthPrompt = useAuthStore((state) => state.openAuthPrompt);
  const triggerRecenter = useMapUIStore((state) => state.triggerRecenter);
  const isInitialLoadComplete = useMapUIStore((state) => state.isInitialLoadComplete);

  // Map & POI State
  const { 
    selectedPoiId, 
    selectedPoi,
    selectPoi,
    deselect, 
    selectedEventId, 
    setSelectedEvent 
  } = usePOIStore();
  
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  const setCurrentEvent = useEventStore((s) => s.setCurrentEvent);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { events } = useSearchEvents(searchQuery);
  const venueId = selectedEvent?.venueId || (selectedEvent as any)?.venue_id;
  const { spatialData: venueSpatial } = useVenueSpatial(venueId);
  const { data: globalPois } = usePOIs(); // Load global POIs
  
  // Merge global POIs with venue-specific spatial data
  const mergedPois = useMemo(() => {
    const features = [...(globalPois?.features || [])];
    if (venueSpatial?.features) {
      features.push(...venueSpatial.features);
    }
    return { type: 'FeatureCollection', features };
  }, [globalPois, venueSpatial]);
  
  const [manualAR, setManualAR] = useState(false);
  const { saveSearch } = useSearchHistory();

  const handleProfilePress = useCallback(() => {
    Haptics.selectionAsync();
    if (isGuest) {
      openAuthPrompt('/(main)/profile');
    } else {
      router.push('/(main)/profile');
    }
  }, [isGuest, router, openAuthPrompt]);

  // Island State (0 = Compact, 0.5 = Medium, 1 = Full)
  const islandState = useSharedValue(0); 
  const startState = useSharedValue(0);

  const preSearchLevel = useSharedValue(0);
  const isScrollAtTop = useSharedValue(true);
  
  const isPanning = useSharedValue(false);
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);
  const islandOpacity = useDerivedValue(() => {
    return withTiming(selectedEvent ? 0 : 1, { duration: 300 });
  });

  // Effect to handle POI selection triggering Level 3
  useEffect(() => {
    if (selectedPoiId) {
      islandState.value = withSpring(1, SPRING_CONFIG);
    }
  }, [selectedPoiId, islandState]);

  const handleEventSelect = useCallback((event: LatticeEvent) => {
    // Save current level before collapsing
    preSearchLevel.value = islandState.value;
    
    setSelectedEvent(event.id);
    setCurrentEvent(event);
    selectPoi(null); // Clear any active POI selection
    islandState.value = withSpring(0, SPRING_CONFIG); // Collapse search island
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [setSelectedEvent, setCurrentEvent, selectPoi, islandState]);

  const handleCloseDetails = useCallback(() => {
    setSelectedEvent(null);
    setCurrentEvent(null);
    selectPoi(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Restore island if needed
    if (preSearchLevel.value > 0.1) {
      islandState.value = withSpring(preSearchLevel.value, SPRING_CONFIG);
    }
  }, [setSelectedEvent, setCurrentEvent, selectPoi, islandState, preSearchLevel]);

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

  const islandHeight = useDerivedValue(() => {
    const fullHeight = SCREEN_HEIGHT * 0.80; 
    if (islandState.value <= 0.5) {
      return interpolate(islandState.value, [0, 0.5], [60, 450], Extrapolation.CLAMP);
    }
    return interpolate(islandState.value, [0.5, 1], [450, fullHeight], Extrapolation.CLAMP);
  });

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onStart(() => {
      isPanning.value = true;
      startState.value = islandState.value;
    })
    .onUpdate((event) => {
      // Allow dragging down if at Level 3 and scroll is at top
      const isDraggingDown = event.translationY > 0;
      const canDragSheet = islandState.value < 0.99 || (isScrollAtTop.value && isDraggingDown);
      
      if (canDragSheet) {
        const stateDelta = -event.translationY / (450 - 60); 
        let newPos = startState.value + stateDelta;
        islandState.value = Math.max(0, Math.min(1, newPos));
      }
    })
    .onEnd((event) => {
      isPanning.value = false;
      const velocity = -event.velocityY / (450 - 60);
      const predictedPos = islandState.value + velocity * 0.1;
      
      let closest = SNAP_POINTS[0];
      let minDiff = Math.abs(predictedPos - SNAP_POINTS[0]);
      
      SNAP_POINTS.forEach((point) => {
        const diff = Math.abs(predictedPos - point);
        if (diff < minDiff) {
          minDiff = diff;
          closest = point;
        }
      });

      islandState.value = withSpring(closest, SPRING_CONFIG, (finished) => {
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
    const bottom = interpolate(islandState.value, [0.5, 1], [insets.bottom + 5, 0], Extrapolation.CLAMP);
    
    return {
      height: islandHeight.value,
      left: margin,
      right: margin,
      bottom,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      opacity: islandOpacity.value,
    };
  });

  const islandBackgroundStyle = useAnimatedStyle(() => {
    const radius = 32;
    return {
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomLeftRadius: interpolate(islandState.value, [0.5, 1], [radius, 0], Extrapolation.CLAMP),
      borderBottomRightRadius: interpolate(islandState.value, [0.5, 1], [radius, 0], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(
        islandState.value,
        [0.7, 0.95],
        ['transparent', theme.colors.bg.surface]
      ),
    };
  });

  const blurProps = useAnimatedProps(() => {
    return {
      // intensity should be passed as a regular prop
    };
  });

  const dimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.5, 1], [0, 0.6], Extrapolation.CLAMP);
    return {
      opacity,
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
      pointerEvents: islandState.value > 0.5 ? 'auto' : 'none' as any,
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
      islandState.value = withSpring(preSearchLevel.value, SPRING_CONFIG);
    }
  }, [deselect, selectedPoiId, preSearchLevel, islandState]);

  const onSelectSearchResult = useCallback((name: string, coords?: [number, number]) => {
    saveSearch(name);
    setSearchQuery(name);
    setIsSearching(false);
    Keyboard.dismiss();
    
    // If we have coordinates, move map. For now just collapse.
    islandState.value = withSpring(0.5, SPRING_CONFIG);
    
    if (coords) {
      console.log('Moving map to:', coords);
      // In a real app, we would use mapRef.current.flyTo
    }
  }, [saveSearch, islandState]);

  const handleSelectCategory = useCallback((id: string) => {
    console.log('Selected Category:', id);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={StyleSheet.absoluteFill}>
        <MapContent 
          poisGeoJSON={mergedPois} 
          allEvents={events}
          sheetPosition={sheetPosition} 
          islandState={islandState}
          onDeselect={handleMapPress}
          onSelectEvent={handleEventSelect}
          is3DActive={manualAR}
        />
      </View>

      <Pressable 
        style={StyleSheet.absoluteFill}
        onPress={handleMapPress}
        pointerEvents="box-none"
      >
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
      />

      <GestureDetector gesture={Gesture.Simultaneous(gesture, Gesture.Native())}>
        <Animated.View 
          pointerEvents={selectedEvent ? 'none' : 'auto'}
          style={[styles.islandContainer, islandStyle]}
        >
          <AnimatedSafeBlurView 
            tint={theme.colors.glass.tint} 
            intensity={90}
            animatedProps={blurProps}
            style={[
              styles.islandBackground, 
              islandBackgroundStyle,
              { borderColor: theme.dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' }
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={[
                styles.handle, 
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.25)' : '#C6C6C8' }
              ]} />
            </View>

            <View style={styles.islandHeader}>
              <FloatingSearchBar 
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (text.length > 0) setIsSearching(true);
                }}
                onProfilePress={handleProfilePress}
                onFocus={() => {
                  setIsSearching(true);
                  islandState.value = withSpring(1, SPRING_CONFIG);
                }}
                onSubmit={() => {
                  saveSearch(searchQuery);
                  Keyboard.dismiss();
                }}
                avatarUrl={user?.avatarUrl}
                isGuest={isGuest}
              />
            </View>

            <Animated.ScrollView 
              style={{ flex: 1 }}
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
                    onSelectSearchResult(q, coords);
                    const match = events.find(e => e.name.toLowerCase() === q.toLowerCase());
                    if (match) handleEventSelect(match);
                  }}
                />
              </Animated.View>
            </Animated.ScrollView>
          </AnimatedSafeBlurView>
        </Animated.View>
      </GestureDetector>

      <EventDetailSheet 
        event={selectedPoi?.parentId ? null : selectedEvent} 
        onClose={handleCloseDetails} 
      />

      <POIMiniCard 
        poi={selectedPoi?.parentId ? selectedPoi : null}
        onClose={deselect}
      />
      
      <MapLoadingOverlay isVisible={!isInitialLoadComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  islandContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1000 },
  islandBackground: { flex: 1, borderRadius: 32, overflow: 'hidden', borderWidth: 1 },
  handleContainer: { paddingTop: 5, alignItems: 'center', zIndex: 10 },
  handle: { width: 50, height: 4, borderRadius: 2 },
  islandHeader: { paddingBottom: 9 },
  islandScrollContent: { paddingBottom: 10 },
  placeholderContent: { padding: 20, alignItems: 'center' }
});
