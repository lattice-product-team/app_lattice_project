import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

interface ARHUDProps {
  onExit: () => void;
  isScanning?: boolean;
  isLandscape?: boolean;
}

export const ARHUD: React.FC<ARHUDProps> = ({ onExit, isScanning = true, isLandscape = false }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scanOpacity = useSharedValue(0.5);

  useEffect(() => {
    scanOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [scanOpacity]);

  const scanAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scanOpacity.value,
  }));

  // Rotation style for when the device is physically landscape but the OS is in portrait
  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isLandscape ? '90deg' : '0deg') }],
  }));

  // Adjust container for landscape rotation
  // If rotated 90deg, the "top" of our UI should be the long side of the device.
  const landscapeContainerStyle = isLandscape ? {
    width: height,
    height: width,
    top: (height - width) / 2,
    left: (width - height) / 2,
  } : {};

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="box-none">
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          rotationStyle,
          landscapeContainerStyle,
          { padding: 0 }
        ]} 
        pointerEvents="box-none"
      >
        {/* Top Bar - Status & Exit */}
        <View 
          style={[
            styles.topBar, 
            { 
              paddingTop: Math.max(isLandscape ? insets.left : insets.top, 24), 
              paddingLeft: Math.max(isLandscape ? insets.top : insets.left, 24), 
              paddingRight: Math.max(isLandscape ? insets.bottom : insets.right, 24) 
            }
          ]}
          pointerEvents="box-none"
        >
          <Animated.View style={[styles.statusBadge, scanAnimatedStyle]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{isScanning ? 'SCANNING LATTICE…' : 'AR ACTIVE'}</Text>
          </Animated.View>

          <Pressable
            onPress={onExit}
            style={styles.exitButton}
            accessibilityLabel="Exit AR mode"
            accessibilityRole="button"
          >
            <Feather name="x" size={24} color="white" />
          </Pressable>
        </View>

        {/* Bottom Interface - Compass/Heading Concept */}
        <View 
          style={[
            styles.bottomBar, 
            { 
              paddingBottom: Math.max(isLandscape ? insets.right : insets.bottom, 24), 
              paddingLeft: Math.max(isLandscape ? insets.top : insets.left, 24), 
              paddingRight: Math.max(isLandscape ? insets.bottom : insets.right, 24) 
            }
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.headingContainer}>
            <View style={styles.compassLine} />
            <View style={styles.compassCenter}>
              <Text style={styles.headingText}>VIEWING GRANDSTAND AREA</Text>
              <View className="flex-row items-center mt-1">
                <Feather name="compass" size={12} color={colors.primary} />
                <Text style={styles.subHeadingText}>HEADING NORTH-WEST</Text>
              </View>
            </View>
            <View style={styles.compassLine} />
          </View>
        </View>

        {/* Side Controls - Concept */}
        <View 
          style={[
            styles.sideControls, 
            isLandscape && { right: Math.max(insets.bottom, 24) }
          ]} 
          pointerEvents="box-none"
        >
          <View style={styles.controlGroup}>
            <Pressable style={styles.sideButton} accessibilityLabel="Zoom in AR">
               <Feather name="plus" size={20} color="white" />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.sideButton} accessibilityLabel="Zoom out AR">
               <Feather name="minus" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    fontSize: 12,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.5,
  },
  subHeadingText: {
    color: colors.muted,
    fontSize: 10,
    marginLeft: 4,
    fontFamily: typography.secondary.bold,
  },
  sideControls: {
    position: 'absolute',
    right: 24,
    top: '35%',
    bottom: '35%',
    justifyContent: 'center',
  },
  controlGroup: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  sideButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
});
