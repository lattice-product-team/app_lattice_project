import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  useAnimatedReaction
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
import { useSearchHistory } from '../../src/features/map/hooks/useSearchHistory';
import { useSearchEvents } from '../../src/features/map/hooks/useSearchEvents';

// Stores & Hooks
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { usePOIStore } from '../../src/features/poi/store/usePOIStore';
import { useLocationStore } from '../../src/store/useLocationStore';
import { normalizePOI } from '../../src/features/poi/adapters/poiAdapter';
import { MAPTILER_KEY } from '../../src/constants/mapConstants';
import { typography } from '../../src/styles/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedSafeBlurView = Animated.createAnimatedComponent(SafeBlurView);

export default function MapIndexPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Map & POI State
  const { selectedPoiId, deselect } = usePOIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const { events } = useSearchEvents(searchQuery);
  const selectedEvent = useMemo(() => 
    events.find(e => e.id === selectedEventId), 
    [events, selectedEventId]
  );
  
  const [manualAR, setManualAR] = useState(false);
  const { saveSearch } = useSearchHistory();

  // Island State (0 = Compact, 0.5 = Medium, 1 = Full)
  const islandState = useSharedValue(0); 
  const startState = useSharedValue(0);
  const SNAP_POINTS = [0, 0.5]; // Solo gestos manuales hasta Nivel 2

  const [preSearchLevel, setPreSearchLevel] = useState(0);
  const isPanning = useSharedValue(false);

  // Effect to handle POI selection triggering Level 3
  useEffect(() => {
    if (selectedPoiId) {
      islandState.value = withSpring(1, { damping: 25, stiffness: 120 });
    }
  }, [selectedPoiId, islandState]);

  const handleEventSelect = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedEventId(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

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
    },
    [isSearching, dismissSearch]
  );

  const islandHeight = useDerivedValue(() => {
    const fullHeight = SCREEN_HEIGHT * 0.80; // Altura máxima al 80%
    if (islandState.value <= 0.5) {
      return interpolate(islandState.value, [0, 0.5], [60, 450]);
    }
    return interpolate(islandState.value, [0.5, 1], [450, fullHeight]);
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      isPanning.value = true;
      startState.value = islandState.value;
    })
    .onUpdate((event) => {
      const stateDelta = -event.translationY / (450 - 60); // Basado en el recorrido Nivel 1 -> 2
      let newPos = startState.value + stateDelta;
      islandState.value = Math.max(0, Math.min(1, newPos));
    })
    .onEnd((event) => {
      isPanning.value = false;
      const velocity = -event.velocityY / (450 - 60);
      const predictedPos = islandState.value + velocity * 0.1;
      
      let closest = SNAP_POINTS[0];
      if (predictedPos > 0.5) {
        closest = 0.5;
      } else {
        let minDiff = Math.abs(predictedPos - SNAP_POINTS[0]);
        SNAP_POINTS.forEach((point) => {
          const diff = Math.abs(predictedPos - point);
          if (diff < minDiff) {
            minDiff = diff;
            closest = point;
          }
        });
      }

      islandState.value = withSpring(closest, {
        damping: 20,
        stiffness: 150,
        mass: 0.6,
      }, (finished) => {
        if (finished && (closest === 0 || closest === 0.5)) {
          runOnJS(setPreSearchLevel)(closest);
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
    };
  });

  const islandBackgroundStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderBottomLeftRadius: interpolate(islandState.value, [0.5, 1], [32, 0], Extrapolation.CLAMP),
      borderBottomRightRadius: interpolate(islandState.value, [0.5, 1], [32, 0], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(
        islandState.value,
        [0.7, 1],
        ['transparent', theme.colors.bg.surface]
      ),
    };
  });

  const blurProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(islandState.value, [0.7, 1], [90, 0], Extrapolation.CLAMP)
    };
  });

  const dimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.5, 1], [0, 0.6], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });

  const level3ContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.7, 0.9], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      position: 'absolute',
      top: 80, 
      left: 0,
      right: 0,
    };
  });

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
    deselect();
    setIsSearching(false);
    if (!selectedPoiId) {
      islandState.value = withSpring(preSearchLevel, { damping: 25, stiffness: 120 });
    }
  }, [deselect, selectedPoiId, preSearchLevel, islandState]);

  const onSelectSearchResult = useCallback((name: string, coords?: [number, number]) => {
    saveSearch(name);
    setSearchQuery(name);
    setIsSearching(false);
    Keyboard.dismiss();
    
    // If we have coordinates, move map. For now just collapse.
    islandState.value = withSpring(0.5, { damping: 25, stiffness: 120 });
    
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
          poisGeoJSON={null} 
          sheetPosition={useSharedValue(SCREEN_HEIGHT)} 
          onDeselect={handleMapPress}
          is3DActive={manualAR}
        />
      </View>

      <Pressable 
        style={StyleSheet.absoluteFill}
        onPress={handleMapPress}
        pointerEvents="box-none"
      >
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }, dimmerStyle]} />
      </Pressable>

      <AdaptiveControlOverlay 
        islandHeight={islandHeight}
        islandState={islandState}
        bottomOffset={insets.bottom + 5}
        onRecenter={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        onToggle3D={() => setManualAR(!manualAR)}
        is3DActive={manualAR}
      />

      <GestureDetector gesture={gesture}>
        <Animated.View 
          pointerEvents={selectedEventId ? 'none' : 'auto'}
          style={[styles.islandContainer, islandStyle]}
        >
          <AnimatedSafeBlurView 
            tint={theme.colors.glass.tint} 
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
                onProfilePress={() => router.push('/(main)/profile')}
                onFocus={() => {
                  setIsSearching(true);
                  islandState.value = withSpring(1, { damping: 25, stiffness: 120 });
                }}
                onSubmit={() => {
                  saveSearch(searchQuery);
                  Keyboard.dismiss();
                }}
              />
            </View>

            <Animated.ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={styles.islandScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={islandState.value > 0.9}
            >
              {isSearching ? (
                <SearchExperience 
                  query={searchQuery}
                  onSelectResult={(q, coords) => {
                    onSelectSearchResult(q, coords);
                    const match = events.find(e => e.name.toLowerCase() === q.toLowerCase());
                    if (match) handleEventSelect(match.id);
                  }}
                />
              ) : (
                <>
                  <DiscoveryDashboard 
                    islandState={islandState}
                    onSelectCategory={handleSelectCategory}
                    onSelectEvent={handleEventSelect}
                  />
                  
                  {/* Contenido dinámico del Nivel 3 (Detalles de POI, etc.) */}
                  {!selectedPoiId && (
                    <Animated.View style={level3ContentStyle}>
                      <View style={styles.placeholderContent}>
                        <Text style={{ color: theme.colors.text.primary, opacity: 0.5 }}>
                          Selecciona un punto en el mapa para ver detalles
                        </Text>
                      </View>
                    </Animated.View>
                  )}
                </>
              )}
            </Animated.ScrollView>
          </AnimatedSafeBlurView>
        </Animated.View>
      </GestureDetector>

      <EventDetailSheet 
        event={selectedEvent || null} 
        onClose={handleCloseDetails} 
      />
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
