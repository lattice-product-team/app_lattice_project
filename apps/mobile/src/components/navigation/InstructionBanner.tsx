import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  CornerUpLeft,
  CornerUpRight,
  RotateCcw,
  Loader2,
} from 'lucide-react-native';
import { useNavigationStore } from '../../features/navigation/store/useNavigationStore';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

/**
 * InstructionBanner: Top-mounted banner for turn-by-turn navigation instructions.
 * Aesthetic: Dark Glassmorphism consistent with the user's reference.
 */
export const InstructionBanner = () => {
  const nextInstruction = useNavigationStore((state) => state.nextInstruction);
  const isNavigating = useNavigationStore((state) => state.isNavigating);

  if (!isNavigating) return null;

  const { instruction = '', distance = 0, maneuverType = '' } = nextInstruction || {};

  // Helper to get the correct icon based on maneuver type
  const renderIcon = () => {
    const iconProps = { size: 48, color: '#FFFFFF', strokeWidth: 2.5 };

    switch (maneuverType) {
      case 'straight':
        return <ArrowUp {...iconProps} />;
      case 'left':
        return <CornerUpLeft {...iconProps} />;
      case 'right':
        return <CornerUpRight {...iconProps} />;
      case 'slight_left':
        return <ArrowUpLeft {...iconProps} />;
      case 'slight_right':
        return <ArrowUpRight {...iconProps} />;
      case 'u_turn':
        return <RotateCcw {...iconProps} />;
      default:
        return <ArrowUp {...iconProps} />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: 'rgba(28, 28, 30, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
        ]}
      >
        {nextInstruction ? (
          <>
            <View style={styles.iconContainer}>{renderIcon()}</View>
            <View style={styles.textContainer}>
              <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
              <Text style={styles.instructionText} numberOfLines={2}>
                {instruction}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Loader2 size={24} color="#FFFFFF" style={styles.loader} />
            <Text style={styles.loadingText}>Calculating premium route...</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  iconContainer: {
    marginRight: 20,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  loader: {
    marginRight: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
