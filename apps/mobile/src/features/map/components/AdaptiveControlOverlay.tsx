import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useMapUIStore, MapCameraMode, MapUIState } from '../store/useMapUIStore';
import Animated, { useAnimatedStyle, SharedValue, withTiming } from 'react-native-reanimated';
import { Navigation, Binoculars, Ticket as TicketIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter, useSegments } from 'expo-router';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { useARStore, ARFilterMode } from '../store/useARStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useAuthStore } from '../../../store/useAuthStore';

interface AdaptiveControlOverlayProps {
  onToggle3D: () => void;
  onRecenter: () => void;
  is3DActive: boolean;
  uiLayer: SharedValue<number>;
  islandState: SharedValue<number>;
  isConnected?: boolean;
  cameraMode?: MapCameraMode;
  bottomOffset?: number;
}

export const AdaptiveControlOverlay = React.memo(
  ({
    onToggle3D,
    onRecenter,
    is3DActive,
    uiLayer,
    islandState,
    isConnected = false,
    cameraMode = MapCameraMode.FREE,
    bottomOffset = 0,
  }: AdaptiveControlOverlayProps) => {
    const theme = useAppTheme();
    const router = useRouter();
    const segments = useSegments();
    const { isGuest, openAuthPrompt } = useAuthStore();
    const iconColor = theme.colors.text.primary;
    const { uiState } = useMapUIStore();
    const openAR = useARStore((s) => s.openAR);
    const isARActive = useARStore((s) => s.isVisible) || uiState === MapUIState.AR_EXPLORE;

    const rOverlayStyle = useAnimatedStyle(() => {
      // Hide if:
      // 1. Island is expanded (searching/dashboard)
      // 2. AR is active
      // 3. We are in NAV/PLANNING mode AND the camera is already following (auto-mode)
      const isIslandExpanded = islandState.value > 0.1;
      const isNavMode = uiState === MapUIState.NAVIGATING || uiState === MapUIState.PLANNING;
      const shouldHide = isIslandExpanded || isARActive || isNavMode;

      return {
        opacity: withTiming(shouldHide ? 0 : 1, { duration: 200 }),
        pointerEvents: shouldHide ? 'none' : 'auto',
        transform: [{ translateY: -bottomOffset - 12 }],
      };
    }, [uiState, isARActive, bottomOffset]);

    const handleTicketPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // GUARD: Check if we are already in the tickets screen to prevent double navigation
      const isAlreadyInTickets = segments.includes('tickets');
      if (isAlreadyInTickets) {
        console.log('[AdaptiveControl] Already in tickets, ignoring.');
        return;
      }

      if (isGuest) {
        openAuthPrompt('/(main)/tickets');
      } else {
        router.push('/(main)/tickets');
      }
    };

    return (
      <Animated.View pointerEvents="box-none" style={[styles.container, rOverlayStyle]}>
        {/* 1. Top Vertical Pill (Wallet & Recenter) */}
        <View
          style={[
            styles.verticalPill,
            {
              backgroundColor: theme.colors.glass.background,
              borderColor: theme.colors.glass.border,
              marginBottom: 12,
            },
          ]}
        >
          <Pressable
            onPress={handleTicketPress}
            hitSlop={12}
            style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
          >
            <TicketIcon size={22} color={iconColor} strokeWidth={2.2} />
          </Pressable>

          <View
            style={[styles.horizontalDivider, { backgroundColor: theme.colors.glass.border }]}
          />

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRecenter();
            }}
            hitSlop={12}
            style={({ pressed }) => [
              styles.action,
              pressed && { opacity: 0.7 },
              cameraMode !== MapCameraMode.FREE && {
                backgroundColor: theme.colors.brand.primary,
                borderRadius: 22,
              },
            ]}
          >
            {cameraMode === MapCameraMode.FOLLOW_WITH_HEADING ? (
              <Navigation
                size={20}
                color="white"
                fill="white"
                strokeWidth={2.2}
                style={{ transform: [{ rotate: '45deg' }] }} // Subtle tilt for heading
              />
            ) : cameraMode === MapCameraMode.FOLLOW_WITH_COURSE ? (
              <Navigation size={20} color="white" fill="white" strokeWidth={2.5} />
            ) : cameraMode === MapCameraMode.FOLLOW ? (
              <Navigation size={20} color="white" fill="white" strokeWidth={2.2} />
            ) : (
              <Navigation size={20} color={iconColor} strokeWidth={2.2} />
            )}
          </Pressable>
        </View>

        {/* 2. Bottom Circle (AR / Binoculars) */}
        <View
          style={[
            styles.circle,
            {
              backgroundColor: theme.colors.glass.background,
              borderColor: theme.colors.glass.border,
            },
          ]}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              openAR(ARFilterMode.CLOSEST_EVENT);
            }}
            hitSlop={12}
            style={({ pressed }) => [styles.circleAction, pressed && { opacity: 0.7 }]}
          >
            <Binoculars size={20} color={iconColor} strokeWidth={2.2} />
          </Pressable>
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    zIndex: 1000,
    alignItems: 'center',
  },
  verticalPill: {
    width: 56, // Slightly wider
    borderRadius: 28,
    borderWidth: 1.5, // Thicker border for better visibility
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 56, // Slightly larger
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    width: 52, // Larger touch area
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleAction: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalDivider: {
    width: 20,
    height: 1,
    marginVertical: 2,
  },
  text3D: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
