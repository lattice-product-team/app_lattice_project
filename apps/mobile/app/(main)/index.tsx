import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  useDerivedValue,
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Core Components
import { MapContent } from '../../src/features/map/components/MapContent';
import { AdaptiveControlOverlay } from '../../src/features/map/components/AdaptiveControlOverlay';
import { FloatingSearchBar } from '../../src/components/ui/FloatingSearchBar';
import { SafeBlurView } from '../../src/components/ui/SafeBlurView';
import { DiscoveryDashboard } from '../../src/features/map/components/DiscoveryDashboard';

// Stores & Hooks
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { usePOIStore } from '../../src/features/poi/store/usePOIStore';
import { useLocationStore } from '../../src/store/useLocationStore';
import { normalizePOI } from '../../src/features/poi/adapters/poiAdapter';
import { MAPTILER_KEY } from '../../src/constants/mapConstants';
import { typography } from '../../src/styles/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MapIndexPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Map & POI State
  const { selectPoi, deselect } = usePOIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [manualAR, setManualAR] = useState(false);

  // Island State (0 = Compact, 0.45 = Medium, 1 = Full)
  // Island State (0 = Compact, 0.5 = Medium, 1 = Full)
  const islandState = useSharedValue(0); 
  const startState = useSharedValue(0);

  const SNAP_POINTS = [0, 0.5, 1];

  const islandHeight = useDerivedValue(() => {
    // 0 -> 64
    // 0.5 -> 450 (Fixed height for Level 2)
    // 1 -> SCREEN_HEIGHT * 0.85
    if (islandState.value <= 0.5) {
      return interpolate(islandState.value, [0, 0.5], [64, 450]);
    }
    return interpolate(islandState.value, [0.5, 1], [450, SCREEN_HEIGHT * 0.85]);
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      startState.value = islandState.value;
    })
    .onUpdate((event) => {
      // Map pixel delta to 0-1 state delta
      // height = 64 + state * (full - 64)
      // delta_state = delta_height / (full - 64)
      const fullHeight = SCREEN_HEIGHT * 0.85;
      const stateDelta = -event.translationY / (fullHeight - 64);
      islandState.value = Math.max(0, Math.min(1, startState.value + stateDelta));
    })
    .onEnd((event) => {
      const velocity = -event.velocityY / (SCREEN_HEIGHT * 0.85 - 64);
      const predictedPos = islandState.value + velocity * 0.1;
      
      // Find closest snap point
      let closest = SNAP_POINTS[0];
      let minDiff = Math.abs(predictedPos - SNAP_POINTS[0]);
      
      SNAP_POINTS.forEach((point) => {
        const diff = Math.abs(predictedPos - point);
        if (diff < minDiff) {
          minDiff = diff;
          closest = point;
        }
      });

      islandState.value = withSpring(closest, {
        damping: 20,
        stiffness: 150,
        mass: 0.6,
      });

      if (closest !== startState.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    });

  const islandStyle = useAnimatedStyle(() => {
    const bottom = insets.bottom + 5;
    
    return {
      height: islandHeight.value,
      bottom,
    };
  });

  const handleRecenter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Recenter logic via store or local ref
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* 1. Background Map */}
      <View style={StyleSheet.absoluteFill}>
        <MapContent 
          poisGeoJSON={null} 
          sheetPosition={useSharedValue(SCREEN_HEIGHT)} // Dummy for now
          onDeselect={deselect}
        />
      </View>

      {/* 2. Synchronized Controls (Tracking the island) */}
      <AdaptiveControlOverlay 
        islandHeight={islandHeight}
        bottomOffset={insets.bottom +5 }
        onRecenter={handleRecenter}
        onToggle3D={() => setManualAR(!manualAR)}
        is3DActive={manualAR}
      />

      {/* 3. The New "Growing Island" (Manual Implementation) */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.islandContainer, islandStyle]}>
          <SafeBlurView 
            intensity={90} 
            tint={theme.colors.glass.tint} 
            style={styles.islandBackground}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.islandHeader}>
              <FloatingSearchBar 
                value={searchQuery}
                onChangeText={setSearchQuery}
                onProfilePress={() => router.push('/(main)/profile')}
                onFocus={() => {
                  islandState.value = withSpring(0.5); // Focus takes to Medium
                }}
              />
            </View>

            <ScrollView 
              style={styles.islandScroll}
              contentContainerStyle={styles.islandScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={islandState.value > 0.5}
              enabled={islandState.value > 0.1}
            >
              <DiscoveryDashboard 
                islandState={islandState}
                onSelectCategory={(id) => console.log('Selected Category:', id)}
              />
              
              {/* Content will go here and "grow" with the island */}
              {islandState.value > 0.7 && (
                <View style={styles.placeholderContent}>
                  <Text style={{ color: 'white', opacity: islandState.value }}>
                    Nivel 3: Completo (Listado de eventos detallado)
                  </Text>
                  <Pressable onPress={() => islandState.value = withSpring(0)}>
                    <Text style={{ color: theme.colors.brand.primary, marginTop: 20 }}>Cerrar</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </SafeBlurView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  islandContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 1000,
    overflow: 'hidden',
  },
  islandBackground: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  handleContainer: {
    paddingTop: 8,
    alignItems: 'center',
    zIndex: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  islandHeader: {
    paddingBottom: 4,
  },
  islandScroll: {
    flex: 1,
  },
  islandScrollContent: {
    paddingBottom: 10,
  },
  islandContent: {
    flex: 1,
  },
  placeholderContent: {
    padding: 20,
    alignItems: 'center',
  }
});
