import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import { ScrollView, Pressable } from 'react-native-gesture-handler';
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
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Compass, Map as MapIcon } from 'lucide-react-native';

// Core Components
import { MapContent } from '../../src/features/map/components/MapContent';
import { AdaptiveControlOverlay } from '../../src/features/map/components/AdaptiveControlOverlay';
import { FloatingSearchBar } from '../../src/components/ui/FloatingSearchBar';
import { DiscoveryDashboard } from '../../src/features/map/components/DiscoveryDashboard';
import { SearchExperience } from '../../src/features/map/components/SearchExperience';
import { EventDetailSheet } from '../../src/features/map/components/EventDetailSheet';
import { DiscoveryFeed } from '../../src/features/discovery/components/DiscoveryFeed';
import { MapLoadingOverlay } from '../../src/features/map/components/MapLoadingOverlay';
import { AROverlay } from '../../src/features/map/components/ar/AROverlay';
import { InstructionBanner } from '../../src/components/navigation/InstructionBanner';
import { NavigationInfo } from '../../src/features/map/components/NavigationInfo';
import { RoutePlanningSheet } from '../../src/features/navigation/components/RoutePlanningSheet';
import { CenteringButton } from '../../src/features/navigation/components/CenteringButton';
import { useSearchHistory } from '../../src/features/map/hooks/useSearchHistory';
import { useSearchEvents } from '../../src/features/map/hooks/useSearchEvents';
import { useEventSpatial } from '../../src/features/map/hooks/useEventSpatial';
import { usePOIs } from '../../src/features/poi/hooks/usePOIs';

// Stores & Hooks
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { usePOIStore } from '../../src/features/poi/store/usePOIStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useSocket } from '../../src/hooks/useSocket';
import { useLocationStore } from '../../src/store/useLocationStore';
import { useMapUIStore, MapCameraMode, MapUIState } from '../../src/features/map/store/useMapUIStore';
import { useEventStore } from '../../src/features/event/store/useEventStore';
import { useNavigationStore } from '../../src/features/navigation/store/useNavigationStore';
import { useProfileStore } from '../../src/features/profile/store/useProfileStore';
import { useARStore } from '../../src/features/map/store/useARStore';
import { normalizePOI } from '../../src/features/poi/adapters/poiAdapter';
import { MAPTILER_KEY } from '../../src/constants/mapConstants';
import { typography } from '../../src/styles/typography';
import { LatticeEvent } from '../../src/types';
import { useLocationService } from '../../src/hooks/useLocationService';
import { ProfileSheet } from '../../src/features/profile/components/ProfileSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

// UI Layer Constants
enum UILayer {
  BASE = 0,
  PROFILE = 1,
  EVENT = 2,
  PLANNING = 3,
  NAVIGATING = 4,
}

const AnimatedCompass = Animated.createAnimatedComponent(Compass);
const AnimatedMap = Animated.createAnimatedComponent(MapIcon);

export default function MapIndexPage() {
  let theme = useAppTheme();
  if (!theme || !theme.colors) {
    const { darkTheme } = require('../../src/styles/theme');
    theme = darkTheme;
  }

  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Core UI State (UI Thread)
  const uiLayer = useSharedValue(UILayer.BASE);
  const islandState = useSharedValue(0); // 0: Level 1, 0.5: Level 2, 1: Level 3
  const startState = useSharedValue(0);

  // Start location tracking
  useLocationService();
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const openAuthPrompt = useAuthStore((state) => state.openAuthPrompt);
  const triggerRecenter = useMapUIStore((state) => state.triggerRecenter);
  const cameraMode = useMapUIStore((state) => state.cameraMode);
  const lastCameraPosition = useMapUIStore((state) => state.lastCameraPosition);
  const setDiscoveryLocation = useMapUIStore((state) => state.setDiscoveryLocation);
  const isInitialLoadComplete = useMapUIStore((state) => state.isInitialLoadComplete);
  const { isConnected } = useSocket();

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

  const { isNavigating, isPlanning } = useNavigationStore();
  const isARActive = useARStore((s) => s.isVisible);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { saveSearch } = useSearchHistory();

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

  const handleProfilePress = useCallback(() => {
    Haptics.selectionAsync();
    if (isGuest) {
      openAuthPrompt('/(main)/profile');
    } else {
      setIsProfileOpen(true);
      // Collapse search island via UI thread
      islandState.value = withSpring(0, theme.motion.physics.magnetic);
    }
  }, [isGuest, theme.motion.physics.magnetic, islandState, openAuthPrompt]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length > 0) setIsSearching(true);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearching(true);
    islandState.value = withSpring(1, theme.motion.physics.magnetic);
  }, [theme.motion.physics.magnetic, islandState]);

  const handleSearchSubmit = useCallback(() => {
    saveSearch(searchQuery);
    Keyboard.dismiss();
  }, [searchQuery, saveSearch]);

  const handleMicPress = useCallback(() => {
    islandState.value = withSpring(1, theme.motion.physics.magnetic);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [theme.motion.physics.magnetic, islandState]);

  const handleSearchPress = useCallback(() => {
    if (selectedEvent) {
      setSelectedEvent(null);
      setCurrentEvent(null);
    }
    islandState.value = withSpring(1, theme.motion.physics.magnetic);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, [
    selectedEvent,
    setSelectedEvent,
    setCurrentEvent,
    theme.motion.physics.magnetic,
    islandState,
  ]);

  const uiState = useMapUIStore((state) => state.uiState);

  // Sync React/Store state to UI Thread Layers (Master Mode Orchestrator)
  useEffect(() => {
    switch (uiState) {
      case MapUIState.NAVIGATING:
        uiLayer.value = withTiming(UILayer.NAVIGATING, { duration: 250 });
        break;
      case MapUIState.PLANNING:
        uiLayer.value = withTiming(UILayer.PLANNING, { duration: 250 });
        break;
      case MapUIState.POI_DETAIL:
        uiLayer.value = withTiming(UILayer.EVENT, { duration: 250 });
        break;
      case MapUIState.SAVED_LIST:
        uiLayer.value = withTiming(UILayer.PROFILE, { duration: 250 });
        break;
      case MapUIState.EXPLORING:
      default:
        // Local overrides for states that aren't yet full modes
        if (isProfileOpen) {
          uiLayer.value = withTiming(UILayer.PROFILE, { duration: 250 });
        } else {
          uiLayer.value = withTiming(UILayer.BASE, { duration: 250 });
        }
        break;
    }
  }, [uiState, isProfileOpen]);

  const preSearchLevel = useSharedValue(0);
  const isScrollAtTop = useSharedValue(true);

  const isPanning = useSharedValue(false);
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);
  const eventSheetState = useSharedValue(0);
  const lastScreenMode = useMapUIStore((state) => state.lastScreenMode);
  const setLastScreenMode = useMapUIStore((state) => state.setLastScreenMode);

  const screenMode = useSharedValue(0); // Force Explore (0) on startup as requested
  const [activeMode, setActiveMode] = useState(0);
  const toggleDrag = useSharedValue(0); // Independent visual state for the toggle

  const [hasMapLoaded, setHasMapLoaded] = useState(false);
  const [isMapActive, setIsMapActive] = useState(false);

  useAnimatedReaction(
    () => screenMode.value > 0.1,
    (isActive) => {
      if (isActive !== isMapActive) {
        runOnJS(setIsMapActive)(isActive);
        if (isActive && !hasMapLoaded) {
          runOnJS(setHasMapLoaded)(true);
        }
      }
    },
    [isMapActive, hasMapLoaded]
  );

  const SNAP_POINTS = [0, 0.5, 1];

  const islandOpacity = useDerivedValue(() => {
    // If we are navigating or planning, the island should be gone
    const isNavigatingLayer = uiLayer.value >= UILayer.NAVIGATING - 0.5;
    if (isNavigatingLayer || isARActive) {
      return withTiming(0, { duration: 250 });
    }
    return withTiming(1, { duration: 250 });
  }, [isARActive]);

  // Derived Visibility for Overlays
  const profileVisibility = useDerivedValue(() => {
    return withTiming(uiLayer.value === UILayer.PROFILE ? 1 : 0);
  });

  const eventVisibility = useDerivedValue(() => {
    return withTiming(uiLayer.value === UILayer.EVENT ? 1 : 0);
  });

  const planningVisibility = useDerivedValue(() => {
    return withTiming(uiLayer.value === UILayer.PLANNING ? 1 : 0);
  });

  // Automatically collapse Island to Level 1 when any overlay is active
  useAnimatedReaction(
    () => uiLayer.value !== UILayer.BASE || isARActive,
    (isOverlayActive) => {
      if (isOverlayActive && islandState.value > 0.1) {
        islandState.value = withSpring(0, theme.motion.physics.magnetic);
      }
    },
    [isARActive]
  );

  const [isHeaderEditable, setIsHeaderEditable] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);

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

      islandState.value = withSpring(0, theme.motion.physics.magnetic); // Collapse search island
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [setSelectedEvent, setCurrentEvent, selectPoi, islandState]
  );

  const handleCloseDetails = useCallback(() => {
    // 1. Clear Data (This triggers the sheet to close via useEffect)
    setCurrentEvent(null);
    selectPoi(null);

    // 2. Clear Navigation State
    useNavigationStore.getState().clearNavigation();

    if (setSelectedEvent as any) {
      (setSelectedEvent as any)(null);
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 3. We don't animate eventSheetState here manually because the sheet's
    // useEffect will react to model becoming null and animate itself to 0.
  }, [setCurrentEvent, selectPoi, setSelectedEvent]);

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
    if (uiLayer.value >= UILayer.NAVIGATING - 0.5) return 0;
    
    const fullHeight = SCREEN_HEIGHT;
    if (islandState.value <= 0.5) {
      return interpolate(islandState.value, [0, 0.5], [55, 380], Extrapolation.CLAMP);
    }
    return interpolate(islandState.value, [0.5, 1], [380, fullHeight], Extrapolation.CLAMP);
  });

  const gesture = Gesture.Pan()
    .enabled(!selectedEvent && !selectedPoi) // DISABLE search gesture when details are open
    .activeOffsetY([-10, 10])
    .failOffsetX(Platform.OS === 'android' ? [-10, 10] : [-20, 20])
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
      borderBottomLeftRadius: interpolate(
        islandState.value,
        [0.5, 1],
        [radius, 0],
        Extrapolation.CLAMP
      ),
      borderBottomRightRadius: interpolate(
        islandState.value,
        [0.5, 1],
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

  const canvasStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(screenMode.value, [0, 1], [0, -SCREEN_WIDTH], Extrapolation.CLAMP),
      },
    ],
  }));

  const mapOverlayStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(screenMode.value, [0, 1], [SCREEN_WIDTH, 0], Extrapolation.CLAMP) },
    ],
  }));

  const controlsOpacityStyle = useAnimatedStyle(() => {
    // Hide if searching (Level 3), if any overlay layer is active, or if AR is active
    const isLevel3 = islandState.value > 0.8;
    const isLayerActive = uiLayer.value !== UILayer.BASE;

    // Hide if searching, if any layer is active, if AR is active, OR if NAVIGATING
    const shouldHide = isLevel3 || isLayerActive || isARActive || isNavigating;

    return {
      opacity: withTiming(shouldHide ? 0 : 1, { duration: 200 }),
      pointerEvents: shouldHide ? 'none' : 'auto',
    };
  }, [isARActive, isNavigating]);

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

  const dimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(islandState.value, [0.5, 1], [0, 0.6], Extrapolation.CLAMP);
    return {
      opacity,
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

    // If we are in the middle of navigation or planning a route,
    // we should NOT clear the route just by tapping the map.
    if (isNavigating || isPlanning) {
      // If we were searching, we might want to collapse the search island though
      if (islandState.value > 0.8) {
        islandState.value = withSpring(0.5, theme.motion.physics.magnetic);
        setIsSearching(false);
      }
      return;
    }

    handleCloseDetails();
    setIsSearching(false);

    // Clear any active navigation/planning state when deselecting in normal mode
    useNavigationStore.getState().clearNavigation();

    // Always snap island back to base level if not searching
    islandState.value = withSpring(0, theme.motion.physics.magnetic);
  }, [handleCloseDetails, islandState, theme.motion.physics.magnetic, isNavigating, isPlanning]);

  const { toggleCategoryFilter } = usePOIStore();
  const handleSelectCategory = useCallback(
    (id: string) => {
      toggleCategoryFilter(id);
    },
    [toggleCategoryFilter]
  );

  // Mode Toggle Drag Logic
  const startMode = useSharedValue(0);

  const toggleGesture = Gesture.Pan()
    .onStart(() => {
      startMode.value = toggleDrag.value;
    })
    .onUpdate((e) => {
      // Move only the toggle indicator
      const delta = e.translationX / 96;
      toggleDrag.value = Math.max(0, Math.min(1, startMode.value + delta));
    })
    .onEnd((e) => {
      const velocity = e.velocityX / 96;
      const target = toggleDrag.value + velocity * 0.15 > 0.5 ? 1 : 0;

      // Lock discovery location if entering Explore, clear if returning to Map
      if (target === 0 && lastCameraPosition?.center) {
        runOnJS(setDiscoveryLocation)(lastCameraPosition.center);
      } else if (target === 1) {
        runOnJS(setDiscoveryLocation)(null);
      }

      // 1. Snap the toggle indicator
      toggleDrag.value = withSpring(target, theme.motion.physics.magnetic);

      // 2. Commit the screen transition only on release
      screenMode.value = withSpring(target, theme.motion.physics.magnetic, (finished) => {
        if (finished) {
          runOnJS(setActiveMode)(target);
          runOnJS(setLastScreenMode)(target);
          if (target !== activeMode) {
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      });
    });

  const modeIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleDrag.value * 96 }],
  }));

  const handleDiscoveryItemPress = useCallback(
    (item: any) => {
      // Basic heuristic to distinguish POI vs Event
      if (
        item.capacity !== undefined ||
        item.currentOccupancy !== undefined ||
        item.crowdLevel !== undefined
      ) {
        selectPoi(item);
        if (setSelectedEvent as any) (setSelectedEvent as any)(null);
        setCurrentEvent(null);
      } else {
        handleEventSelect(item);
      }

      // Auto-switch to Map mode when an item is selected from Explore
      const nextMode = 1;
      toggleDrag.value = withSpring(nextMode, theme.motion.physics.magnetic);
      screenMode.value = withSpring(nextMode, theme.motion.physics.magnetic);
      setActiveMode(nextMode);
      setLastScreenMode(nextMode);
    },
    [
      handleEventSelect,
      selectPoi,
      setSelectedEvent,
      setCurrentEvent,
      toggleDrag,
      screenMode,
      theme.motion.physics.magnetic,
    ]
  );

  const [exploreColor, setExploreColor] = useState(theme.colors.text.primary);
  const [mapColor, setMapColor] = useState(theme.colors.text.muted);

  useAnimatedReaction(
    () => toggleDrag.value,
    (val) => {
      const eColor = interpolateColor(
        val,
        [0.4, 0.6],
        [theme.colors.text.primary, theme.colors.text.muted]
      );
      const mColor = interpolateColor(
        val,
        [0.4, 0.6],
        [theme.colors.text.muted, theme.colors.text.primary]
      );
      runOnJS(setExploreColor)(eColor as string);
      runOnJS(setMapColor)(mColor as string);
    },
    [theme]
  );

  const exploreTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      toggleDrag.value,
      [0.4, 0.6],
      [theme.colors.text.primary, theme.colors.text.muted]
    ),
  }));

  const mapTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      toggleDrag.value,
      [0.4, 0.6],
      [theme.colors.text.muted, theme.colors.text.primary]
    ),
  }));

  const searchInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. Unified Sliding Canvas (Z-Index: 0) */}
      <Animated.View style={[styles.canvas, canvasStyle]}>
        <View style={[styles.screen, { backgroundColor: theme.colors.bg.surface }]}>
          <DiscoveryFeed onItemPress={handleDiscoveryItemPress} theme={theme} />
        </View>

        <View style={styles.screen}>
          {true ? (
            <MapContent
              poisGeoJSON={mergedPois}
              allEvents={events}
              sheetPosition={sheetPosition}
              islandState={islandState}
              onDeselect={handleMapPress}
              onSelectEvent={handleEventSelect}
              is3DActive={manualAR}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: theme.colors.bg.main }} />
          )}
        </View>
      </Animated.View>

      {/* 2. Persistent HUD & Navigation Info (Z-Index: 500) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, mapOverlayStyle, { zIndex: 500 }]}
        pointerEvents="box-none"
      >
        <InstructionBanner />
        <NavigationInfo />
      </Animated.View>

      {/* 3. Global Dimmer (Z-Index: 900) - Temporarily disabled for diagnostic */}
      {/* 
      <Animated.View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, { zIndex: 900 }]}
      >
        <Animated.View
          animatedProps={dimmerProps}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'black' },
            mapOverlayStyle,
            dimmerStyle,
          ]}
          pointerEvents="none"
        />
      </Animated.View>
      */}

      {/* 4. HUD Buttons & Controls (Z-Index: 1000) */}
      <Animated.View style={[mapOverlayStyle, { zIndex: 1000 }]} pointerEvents="box-none">
        <AdaptiveControlOverlay
          uiLayer={uiLayer}
          islandState={islandState}
          bottomOffset={insets.bottom + 5}
          cameraMode={cameraMode}
          onRecenter={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setManualAR(false);
            
            // The store now handles the expanded cycle and navigation context
            triggerRecenter();
          }}
          onToggle3D={() => setManualAR(!manualAR)}
          is3DActive={manualAR}
          isConnected={isConnected}
        />
      </Animated.View>

      <Animated.View
        style={[styles.modeToggleContainer, { bottom: insets.bottom + 20 }, controlsOpacityStyle]}
      >
        <GestureDetector gesture={toggleGesture}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              const nextMode = toggleDrag.value > 0.5 ? 0 : 1;

              if (nextMode === 0 && lastCameraPosition?.center) {
                setDiscoveryLocation(lastCameraPosition.center);
              } else if (nextMode === 1) {
                setDiscoveryLocation(null);
              }

              toggleDrag.value = withSpring(nextMode, theme.motion.physics.magnetic);
              screenMode.value = withSpring(nextMode, theme.motion.physics.magnetic);
              setActiveMode(nextMode);
              setLastScreenMode(nextMode);
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
                {
                  backgroundColor: theme.dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
                },
                modeIndicatorStyle,
              ]}
            />
            <View style={styles.modePillLabels}>
              <View style={styles.modeLabel}>
                <Animated.View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Compass
                    size={20}
                    color={exploreColor}
                    strokeWidth={2.2}
                  />
                  <Animated.Text style={[styles.modeText, exploreTextStyle]}>Explore</Animated.Text>
                </Animated.View>
              </View>
              <View style={styles.modeLabel}>
                <Animated.View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MapIcon size={20} color={mapColor} strokeWidth={2.2} />
                  <Animated.Text style={[styles.modeText, mapTextStyle]}>Map</Animated.Text>
                </Animated.View>
              </View>
            </View>
          </Pressable>
        </GestureDetector>
      </Animated.View>

      <CenteringButton uiLayer={uiLayer} />

      {/* 5. Bottom-up Sheets (Z-Index: 2000) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, mapOverlayStyle, { zIndex: 2000 }]}
        pointerEvents="box-none"
      >
        <EventDetailSheet islandState={eventSheetState} onClose={handleCloseDetails} />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFill, mapOverlayStyle, { zIndex: 2001 }]}
        pointerEvents="box-none"
      >
        <RoutePlanningSheet visibility={planningVisibility} islandState={islandState} />

        <ProfileSheet
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          externalState={profileVisibility}
          onSettings={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsProfileOpen(false);
            useAuthStore.getState().logout();
          }}
        />
      </Animated.View>

      {/* 6. Top Island / Search (Z-Index: 3000) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, mapOverlayStyle, { zIndex: 3000 }]}
        pointerEvents="box-none"
      >
        <Animated.View pointerEvents="box-none" style={[styles.islandContainer, islandStyle]}>
          <GestureDetector gesture={Gesture.Simultaneous(gesture, Gesture.Native())}>
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
                  onChangeText={handleSearchChange}
                  onProfilePress={handleProfilePress}
                  onFocus={handleSearchFocus}
                  onSubmit={handleSearchSubmit}
                  onMicPress={handleMicPress}
                  onPress={handleSearchPress}
                  avatarUrl={user?.avatarUrl}
                  isGuest={isGuest}
                  editable={isHeaderEditable}
                />
                <Animated.View
                  style={[styles.islandGrabber, { backgroundColor: theme.colors.border.subtle }]}
                />
              </Animated.View>

              <Animated.ScrollView
                style={{ flex: 1 }}
                scrollEnabled={scrollEnabled}
                contentContainerStyle={styles.islandScrollContent}
                showsVerticalScrollIndicator={false}
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
                      setSearchQuery('');
                      saveSearch(q);
                      setIsSearching(false);
                      Keyboard.dismiss();
                      islandState.value = withSpring(0.5, theme.motion.physics.magnetic);
                      const match = events.find((e) => e.name.toLowerCase() === q.toLowerCase());
                      if (match) handleEventSelect(match);
                    }}
                  />
                </Animated.View>
              </Animated.ScrollView>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </Animated.View>

      {/* 7. AR Overlay Layer (Z-Index: 3500) */}
      <AROverlay />

      {/* 8. Loading Overlay (Z-Index: 4000) */}
      <MapLoadingOverlay isVisible={!isInitialLoadComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  canvas: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
    flex: 1,
  },
  screen: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  islandContainer: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1000 },
  islandBackground: { flex: 1, borderRadius: 32, overflow: 'hidden', borderWidth: 1 },
  islandHeader: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  islandGrabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 8,
    opacity: 0.5,
  },
  islandScrollContent: { paddingBottom: 30 },
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
    fontSize: 16,
    fontFamily: typography.secondary.medium,
    letterSpacing: -0.2,
  },
});
