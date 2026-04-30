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
  useDerivedValue,
  runOnJS,
  withTiming,
  Extrapolation
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

const AnimatedSafeBlurView = Animated.createAnimatedComponent(SafeBlurView);

export default function MapIndexPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Map & POI State
  const { selectedPoiId, selectPoi, deselect } = usePOIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [manualAR, setManualAR] = useState(false);

  // Island State (0 = Compact, 0.5 = Medium, 1 = Full)
  const islandState = useSharedValue(0); 
  const startState = useSharedValue(0);
  const SNAP_POINTS = [0, 0.5]; // Solo gestos manuales hasta Nivel 2

  const [preSearchLevel, setPreSearchLevel] = useState(0);

  // Effect to handle POI selection triggering Level 3
  useEffect(() => {
    if (selectedPoiId) {
      islandState.value = withSpring(1, { damping: 25, stiffness: 120 });
    }
  }, [selectedPoiId, islandState]);

  const islandHeight = useDerivedValue(() => {
    const fullHeight = SCREEN_HEIGHT * 0.80; // Bajamos la altura máxima al 80%
    if (islandState.value <= 0.5) {
      return interpolate(islandState.value, [0, 0.5], [60, 450]);
    }
    return interpolate(islandState.value, [0.5, 1], [450, fullHeight]);
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      startState.value = islandState.value;
    })
    .onUpdate((event) => {
      // Map pixel delta to 0-1 state delta
      const fullHeight = SCREEN_HEIGHT * 0.85;
      const stateDelta = -event.translationY / (fullHeight - 72);
      
      // Permitimos arrastrar un poco hacia arriba de 0.5 por rubber-banding, pero lo limitamos
      let newPos = startState.value + stateDelta;
      if (newPos > 0.55 && startState.value <= 0.5) {
        newPos = 0.5 + (newPos - 0.5) * 0.2; // Rubber banding
      }
      
      islandState.value = Math.max(0, Math.min(1, newPos));
    })
    .onEnd((event) => {
      const velocity = -event.velocityY / (SCREEN_HEIGHT * 0.85 - 72);
      const predictedPos = islandState.value + velocity * 0.1;
      
      let closest = SNAP_POINTS[0];
      
      // Si el gesto manual intenta ir más allá de 0.5, forzamos a volver a 0.5
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
    // Interpolar de margen 12 (nivel 2) a 0 (nivel 3)
    const margin = interpolate(islandState.value, [0.5, 1], [12, 0], Extrapolation.CLAMP);
    // Mantener borderRadius constante en 32
    const radius = 32;
    // Ajustar el bottom si desaparecen los márgenes
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
    const radius = 32;
    return {
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomLeftRadius: interpolate(islandState.value, [0.5, 1], [32, 0], Extrapolation.CLAMP),
      borderBottomRightRadius: interpolate(islandState.value, [0.5, 1], [32, 0], Extrapolation.CLAMP),
    };
  });

  const dimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.5, 1], [0, 0.6], Extrapolation.CLAMP);
    return {
      opacity,
      pointerEvents: opacity > 0.1 ? 'auto' : 'none', // Bloquear toques al mapa
    };
  });

  const level3ContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.7, 0.9], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      position: 'absolute',
      top: 100, // Debajo del header
      left: 0,
      right: 0,
    };
  });

  const scrollStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
    };
  });

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
    deselect();
    // Si no hay POI seleccionado, volvemos al nivel previo a la búsqueda
    if (!selectedPoiId) {
      islandState.value = withSpring(preSearchLevel, { damping: 25, stiffness: 120 });
    }
  }, [deselect, selectedPoiId, preSearchLevel, islandState]);

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
          onDeselect={handleMapPress}
          is3DActive={manualAR}
        />
      </View>

      {/* Background Dimmer */}
      <Pressable 
        style={StyleSheet.absoluteFill}
        onPress={Keyboard.dismiss}
        pointerEvents="box-none"
      >
        <Animated.View 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }, dimmerStyle]} 
        />
      </Pressable>

      {/* 2. Synchronized Controls (Tracking the island) */}
      <AdaptiveControlOverlay 
        islandHeight={islandHeight}
        islandState={islandState}
        bottomOffset={insets.bottom + 5}
        onRecenter={handleRecenter}
        onToggle3D={() => setManualAR(!manualAR)}
        is3DActive={manualAR}
      />

      {/* 3. The New "Growing Island" (Manual Implementation) */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.islandContainer, islandStyle, !theme.dark && theme.shadows.soft]}>
          <AnimatedSafeBlurView 
            intensity={90} 
            tint={theme.colors.glass.tint} 
            style={[
              styles.islandBackground, 
              islandBackgroundStyle,
              { borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)' }
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
                onChangeText={setSearchQuery}
                onProfilePress={() => router.push('/(main)/profile')}
                onFocus={() => {
                  islandState.value = withSpring(1, { damping: 25, stiffness: 120 });
                }}
              />
            </View>

            <Animated.ScrollView 
              style={scrollStyle}
              contentContainerStyle={styles.islandScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              <DiscoveryDashboard 
                islandState={islandState}
                onSelectCategory={(id) => console.log('Selected Category:', id)}
              />
              
              {/* Nivel 3 Content - Always mounted but with opacity 0 */}
              <Animated.View style={level3ContentStyle}>
                <View style={styles.placeholderContent}>
                  <Text style={{ color: theme.colors.text.primary }}>
                    Nivel 3: Completo (Listado de eventos detallado)
                  </Text>
                  <Pressable onPress={() => {
                    deselect(); 
                    islandState.value = withSpring(0.5, { damping: 25, stiffness: 120 });
                  }}>
                    <Text style={{ color: theme.colors.brand.primary, marginTop: 20 }}>Cerrar</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </Animated.ScrollView>
          </AnimatedSafeBlurView>
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
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    overflow: 'visible', // Allow shadow to show
  },
  islandBackground: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  handleContainer: {
    paddingTop: 5,
    paddingBottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  handle: {
    width: 50,
    height: 4,
    borderRadius: 2,
  },
  islandHeader: {
    paddingBottom: 9,
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
