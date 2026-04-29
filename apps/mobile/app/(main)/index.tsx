import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Core Components
import { MapContent } from '../../src/features/map/components/MapContent';
import { AdaptiveControlOverlay } from '../../src/features/map/components/AdaptiveControlOverlay';
import { FloatingSearchBar } from '../../src/components/ui/FloatingSearchBar';
import { SafeBlurView } from '../../src/components/ui/SafeBlurView';

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

  // Island Animation State
  // 0 = Compact (Search bar only)
  // 1 = Expanded (Full list)
  const islandState = useSharedValue(0); 

  const islandHeight = useDerivedValue(() => {
    return interpolate(islandState.value, [0, 1], [64, SCREEN_HEIGHT * 0.85]);
  });

  const islandStyle = useAnimatedStyle(() => {
    const bottom = insets.bottom;
    
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
      <Animated.View style={[styles.islandContainer, islandStyle]}>
        <SafeBlurView 
          intensity={90} 
          tint={theme.colors.glass.tint} 
          style={styles.islandBackground}
        >
          <View style={styles.islandContent}>
            <FloatingSearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              onProfilePress={() => router.push('/(main)/profile')}
              onFocus={() => {
                islandState.value = withSpring(1);
              }}
            />
            
            {/* Content will go here and "grow" with the island */}
            {islandState.value > 0.1 && (
              <View style={styles.placeholderContent}>
                <Text style={{ color: 'white' }}>Contenido en expansión...</Text>
                <Pressable onPress={() => islandState.value = withSpring(0)}>
                  <Text style={{ color: theme.colors.brand.primary, marginTop: 20 }}>Cerrar</Text>
                </Pressable>
              </View>
            )}
          </View>
        </SafeBlurView>
      </Animated.View>
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
  islandContent: {
    flex: 1,
  },
  placeholderContent: {
    padding: 20,
    alignItems: 'center',
  }
});
