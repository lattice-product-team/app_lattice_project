import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X, Compass, Plus, Minus } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme as useLatticeTheme } from '../../../../hooks/useAppTheme';
import { typography } from '../../../../styles/typography';

interface ARHUDProps {
  onExit: () => void;
  isScanning?: boolean;
  statusMessage?: string;
}

export const ARHUD: React.FC<ARHUDProps> = ({ 
  onExit, 
  isScanning = true, 
  statusMessage = 'AR ACTIVE' 
}) => {
  const insets = useSafeAreaInsets();
  const theme = useLatticeTheme();
  const scanOpacity = useSharedValue(0.5);

  useEffect(() => {
    scanOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 1000 }), withTiming(0.5, { duration: 1000 })),
      -1,
      true
    );
  }, [scanOpacity]);

  const scanAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scanOpacity.value,
  }));

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="box-none">
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top Bar - Status & Exit */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: Math.max(insets.top, 24),
              paddingHorizontal: 24,
            },
          ]}
          pointerEvents="box-none"
        >
          <Animated.View style={[styles.statusBadge, scanAnimatedStyle]}>
            <View style={[styles.statusDot, { backgroundColor: isScanning ? '#FF9F0A' : '#32D74B' }]} />
            <Text style={styles.statusText}>
              {isScanning ? 'SCANNING LATTICE…' : statusMessage.toUpperCase()}
            </Text>
          </Animated.View>

          <Pressable
            onPress={onExit}
            style={styles.exitButton}
            accessibilityLabel="Exit AR mode"
            accessibilityRole="button"
          >
            <X size={24} color="white" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Bottom Interface - Heading Concept */}
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: Math.max(insets.bottom, 24),
              paddingHorizontal: 24,
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.headingContainer}>
            <View style={styles.compassLine} />
            <View style={styles.compassCenter}>
              <Text style={styles.headingText}>{statusMessage}</Text>
              <View className="flex-row items-center mt-1">
                <Compass size={12} color={theme.colors.brand.primary} strokeWidth={2.2} />
                <Text style={[styles.subHeadingText, { color: 'rgba(255,255,255,0.6)' }]}>
                  REAL-TIME SPATIAL SYNC
                </Text>
              </View>
            </View>
            <View style={styles.compassLine} />
          </View>
        </View>

        {/* Side Controls - Zoom/etc */}
        <View
          style={[styles.sideControls, { right: 24 }]}
          pointerEvents="box-none"
        >
          <View style={styles.controlGroup}>
            <Pressable style={styles.sideButton} accessibilityLabel="Zoom in AR">
              <Plus size={20} color="white" strokeWidth={2.2} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.sideButton} accessibilityLabel="Zoom out AR">
              <Minus size={20} color="white" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontFamily: typography.primary.bold,
    letterSpacing: 1,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  compassLine: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  compassCenter: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headingText: {
    color: 'white',
    fontSize: 13,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.5,
  },
  subHeadingText: {
    fontSize: 9,
    marginLeft: 4,
    fontFamily: typography.secondary.bold,
    letterSpacing: 0.8,
  },
  sideControls: {
    position: 'absolute',
    right: 24,
    top: '35%',
    bottom: '35%',
    justifyContent: 'center',
  },
  controlGroup: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  sideButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 8,
  },
});
