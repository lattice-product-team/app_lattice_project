import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../styles/typography';

/**
 * InstructionBanner: Top-mounted banner for turn-by-turn navigation instructions.
 * Aesthetic: Dark Glassmorphism consistent with the user's reference.
 */
export const InstructionBanner = () => {
  const nextInstruction = useNavigationStore((state) => state.nextInstruction);
  const isNavigating = useNavigationStore((state) => state.isNavigating);
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  if (!isNavigating) return null;

  const { text = '', distance = 0, maneuverType = '' } = nextInstruction || {};

  // Helper to get the correct icon based on maneuver text
  const renderIcon = () => {
    const iconProps = { 
      size: 42, 
      color: theme.dark ? '#FFFFFF' : theme.colors.text.primary, 
      strokeWidth: 2.5 
    };

    const instructionStr = text?.toLowerCase() || '';
    if (instructionStr.includes('left')) return <CornerUpLeft {...iconProps} />;
    if (instructionStr.includes('right')) return <CornerUpRight {...iconProps} />;
    if (instructionStr.includes('u-turn') || instructionStr.includes('u turn')) return <RotateCcw {...iconProps} />;
    if (instructionStr.includes('straight') || instructionStr.includes('keep')) return <ArrowUp {...iconProps} />;
    
    return <ArrowUp {...iconProps} />;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  return (
    <Animated.View 
      entering={FadeInUp} 
      exiting={FadeOutUp} 
      style={[styles.outerContainer, { top: insets.top + 10 }]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
            ...(theme.dark ? {} : { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 })
          },
        ]}
      >
        {nextInstruction ? (
          <>
            <View style={styles.iconContainer}>{renderIcon()}</View>
            <View style={styles.textContainer}>
              <Text style={[styles.distanceText, { color: theme.dark ? '#FFFFFF' : theme.colors.text.primary }]}>
                {formatDistance(distance)}
              </Text>
              <Text 
                style={[styles.instructionText, { color: theme.dark ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary }]} 
                numberOfLines={2}
              >
                {text}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Loader2 size={24} color={theme.dark ? '#FFFFFF' : theme.colors.text.primary} style={styles.loader} />
            <Text style={[styles.loadingText, { color: theme.dark ? '#FFFFFF' : theme.colors.text.primary }]}>
              Calculating next move...
            </Text>
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
    fontFamily: typography.primary.bold,
    includeFontPadding: false,
    letterSpacing: Platform.OS === 'android' ? -0.2 : -0.5,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 20,
    fontFamily: typography.primary.semibold,
    includeFontPadding: false,
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
