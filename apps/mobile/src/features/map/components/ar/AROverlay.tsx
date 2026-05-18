import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { DeviceMotion } from 'expo-sensors';
import { Canvas } from '@react-three/fiber/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Location from 'expo-location';
import { useLocationStore } from '../../../../store/useLocationStore';
import { useOrientationStore } from '../../../../store/useOrientationStore';
import { MainARScene } from './MainARScene';
import { CameraPermissionView } from '../../../../components/ui/CameraPermissionView';
import { ARHUD } from './ARHUD';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { typography } from '../../../../styles/typography';
import { getCategoryMetadata } from '../../../../utils/poiUtils';
import { useARStore } from '../../store/useARStore';
import { useARData } from '../../hooks/useARData';

// Math helpers
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const l1 = (lon1 * Math.PI) / 180;
  const l2 = (lon2 * Math.PI) / 180;
  const y = Math.sin(l2 - l1) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360;
};

export const AROverlay: React.FC = () => {
  const { isVisible, closeAR } = useARStore();
  const { activePois, loading, statusMessage } = useARData();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const hudOpacity = useSharedValue(0);
  const { width, height } = useWindowDimensions();

  const userCoords = useLocationStore((s) => s.coords);

  // High-frequency shared values to avoid React re-renders
  const sharedHeading = useSharedValue(0);
  const sharedPitch = useSharedValue(0);
  const isHoldingVertical = useSharedValue(false);

  const setHeading = useOrientationStore((s) => s.setHeading);
  const setPitch = useOrientationStore((s) => s.setPitch);

  // 1. Orientation Lock (Strict Portrait)
  useEffect(() => {
    if (isVisible) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } else {
      ScreenOrientation.unlockAsync();
    }
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [isVisible]);

  // 2. Real-time Heading (Compass)
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchHeadingAsync((data) => {
        const h = data.trueHeading !== -1 ? data.trueHeading : data.magHeading;

        // Handle wrap-around for smooth animation
        let lastHeading = sharedHeading.value;
        let newHeading = h;
        if (newHeading - lastHeading > 180) newHeading -= 360;
        else if (lastHeading - newHeading > 180) newHeading += 360;

        // Faster timing to reduce "floaty" feeling while keeping it smooth
        sharedHeading.value = withTiming(newHeading, { duration: 250 });
        setHeading(h); // Keep store in sync for 3D scene
      });
    };

    if (isVisible) {
      startWatching();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isVisible, setHeading]);

  // 3. Real-time Pitch (Device Motion)
  useEffect(() => {
    if (isVisible) {
      DeviceMotion.setUpdateInterval(16); // 60fps for zero-delay movement
      const subscription = DeviceMotion.addListener((data) => {
        if (data.rotation) {
          const betaDegrees = (data.rotation.beta * 180) / Math.PI;
          const gammaDegrees = (data.rotation.gamma * 180) / Math.PI;

          // iOS Gimbal Lock Fix: beta is restricted to [-90, 90]
          // When looking up past 90deg, beta drops and gamma flips to ~180
          let trueBeta = betaDegrees;
          if (Math.abs(gammaDegrees) > 90) {
            trueBeta = 180 - Math.abs(betaDegrees);
          }

          // Verticality Check: Hide AR if phone is lying flat (less than 45deg or more than 135deg)
          const vertical = trueBeta > 45 && trueBeta < 135;
          isHoldingVertical.value = vertical;

          // Correct Pitch: trueBeta=90 is vertical.
          // Looking down (trueBeta < 90) -> p is negative -> moves labels UP.
          // Looking up (trueBeta > 90) -> p is positive -> moves labels DOWN.
          const p = trueBeta - 90;
          sharedPitch.value = p;
          setPitch(p);
        }
      });
      return () => subscription.remove();
    }
  }, [isVisible, setPitch]);

  useEffect(() => {
    if (isVisible && isCameraReady) {
      const timer = setTimeout(() => {
        setMountScene(true);
        hudOpacity.value = withTiming(1, { duration: 600 });
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isVisible) {
      setMountScene(false);
      hudOpacity.value = 0;
    }
  }, [isVisible, isCameraReady, hudOpacity]);

  const hudAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hudOpacity.value,
    transform: [{ translateY: withTiming(hudOpacity.value === 1 ? 0 : 20, { duration: 600 }) }],
  }));

  if (!isVisible) return null;
  if (!permission) return <View style={styles.permissionContainer} />;
  if (!permission.granted)
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraPermissionView onRequestPermission={requestPermission} />
      </View>
    );

  const isScanning = loading || activePois.length === 0;

  // Calculate 2D Screen Overlay Positions for Text Labels
  // Internal component for high-performance projected labels
  const ProjectedLabel = ({ poi, index }: { poi: any; index: number }) => {
    const coords = poi.geometry?.coordinates;
    const [userLon, userLat] = userCoords || [0, 0];
    const [poiLon, poiLat] = coords || [0, 0];
    const distance = userCoords && coords ? getDistance(userLat, userLon, poiLat, poiLon) : 0;
    const bearing = userCoords && coords ? getBearing(userLat, userLon, poiLat, poiLon) : 0;
    const isBeacon = poi.properties?.isBeacon;
    const metadata = getCategoryMetadata(poi.properties?.category);
    const CategoryIcon = metadata.icon;

    const isTrackingSingleTarget = activePois.length === 1 && !isBeacon;

    const animatedStyle = useAnimatedStyle(() => {
      if (!coords || !userCoords) {
        return { transform: [], opacity: 0 };
      }
      let angleDiff = bearing - sharedHeading.value;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      const vFOV = 45;
      const verticalOffset = (sharedPitch.value / (vFOV / 2)) * (height / 2);

      // Clamp angle for horizontal position to keep navigation targets on-screen
      const maxAngle = 35;
      let clampedAngle = angleDiff;
      let isOffscreen = false;

      if (angleDiff > maxAngle) {
        clampedAngle = maxAngle;
        isOffscreen = true;
      } else if (angleDiff < -maxAngle) {
        clampedAngle = -maxAngle;
        isOffscreen = true;
      }

      // If tracking a single destination, always show the HUD (clamp to edge)
      const shouldShow = isTrackingSingleTarget ? true : !isOffscreen;

      const opacity = withTiming(shouldShow && isHoldingVertical.value ? 1 : 0, { duration: 250 });

      const xPos = (clampedAngle / 30) * (width / 2) + width / 2;
      const yOffset = isBeacon ? -80 : (index % 2) * 50 - 25;

      // Keep clamped navigation targets centered vertically for better visibility
      const yPos =
        isOffscreen && isTrackingSingleTarget
          ? height / 2 - 80
          : height / 2 + verticalOffset + yOffset - 40;

      // Scale down based on distance to simulate depth perception (logarithmic drop-off)
      let scaleFactor = 1;
      if (distance > 30) {
        const minScale = 0.55; // Never get smaller than 55%
        const maxDist = 25000; // Cap distance effect at 25km
        const clampedDist = Math.min(Math.max(distance, 30), maxDist);
        const logDist = Math.log10(clampedDist);
        const logMin = Math.log10(30);
        const logMax = Math.log10(maxDist);
        const progress = (logDist - logMin) / (logMax - logMin);
        scaleFactor = 1 - progress * (1 - minScale);
      }

      // If we are clamping an offscreen target, we want it slightly smaller to act as a HUD element
      if (isOffscreen && isTrackingSingleTarget) {
        scaleFactor *= 0.85;
      }

      return {
        transform: [
          { translateX: xPos - (isBeacon ? 120 : 100) },
          { translateY: yPos },
          { scale: withTiming(scaleFactor, { duration: 300 }) }, // Smooth scaling
        ],
        opacity,
      };
    });

    // Sub-animations for directional arrows
    const leftArrowStyle = useAnimatedStyle(() => {
      if (!coords || !userCoords) return { opacity: 0 };
      let angleDiff = bearing - sharedHeading.value;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      return { opacity: withTiming(angleDiff < -35 ? 1 : 0, { duration: 200 }) };
    });

    const rightArrowStyle = useAnimatedStyle(() => {
      if (!coords || !userCoords) return { opacity: 0 };
      let angleDiff = bearing - sharedHeading.value;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      return { opacity: withTiming(angleDiff > 35 ? 1 : 0, { duration: 200 }) };
    });

    const centerContentStyle = useAnimatedStyle(() => {
      if (!coords || !userCoords) return { opacity: 0 };
      let angleDiff = bearing - sharedHeading.value;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      const isOffscreen = Math.abs(angleDiff) > 35;
      // Fade out the vertical stalk and detailed text when offscreen,
      // focusing only on the turn direction and icon.
      return {
        opacity: withTiming(isOffscreen && isTrackingSingleTarget ? 0.3 : 1, { duration: 200 }),
      };
    });

    if (!coords || !userCoords) return null;

    return (
      <Animated.View style={[styles.labelWrapper, { width: isBeacon ? 240 : 200 }, animatedStyle]}>
        <View
          style={[
            styles.brandBubble,
            isBeacon && styles.beaconBubble,
            isTrackingSingleTarget && styles.navigationBubble,
          ]}
        >
          <Animated.View style={[styles.directionIndicator, styles.directionLeft, leftArrowStyle]}>
            <Text style={styles.directionArrow}>«</Text>
          </Animated.View>

          <View
            style={[
              styles.iconContainer,
              { backgroundColor: metadata.color },
              isBeacon && styles.beaconIcon,
            ]}
          >
            <CategoryIcon size={isBeacon ? 22 : 18} color="white" strokeWidth={2.5} />
          </View>

          <Animated.View style={[styles.textContainer, centerContentStyle]}>
            <Text
              style={[styles.brandLabelText, isBeacon && styles.beaconLabelText]}
              numberOfLines={1}
            >
              {poi.properties?.name || poi.name}
            </Text>
            <Text style={styles.brandDistanceText}>
              {distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`} •{' '}
              {isTrackingSingleTarget ? 'Destino' : 'Ahead'}
            </Text>
          </Animated.View>

          <Animated.View
            style={[styles.directionIndicator, styles.directionRight, rightArrowStyle]}
          >
            <Text style={styles.directionArrow}>»</Text>
          </Animated.View>
        </View>
        {!isBeacon && <Animated.View style={[styles.verticalStalk, centerContentStyle]} />}
      </Animated.View>
    );
  };

  const render2DLabels = (poisToRender: any[]) => {
    return poisToRender.map((poi, idx) => (
      <ProjectedLabel key={`ar-label-${poi.properties?.id || idx}`} poi={poi} index={idx} />
    ));
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <CameraView
        style={styles.camera}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />
      {mountScene && (
        <>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Canvas>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <ambientLight intensity={Math.PI / 2} />
              {/* eslint-disable-next-line react/no-unknown-property */}
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
              />
              {/* eslint-disable-next-line react/no-unknown-property */}
              <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
              <MainARScene pois={activePois} />
            </Canvas>
          </View>

          {/* 2D Projection Overlay */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {render2DLabels(activePois)}
          </View>

          <Animated.View
            style={[StyleSheet.absoluteFill, hudAnimatedStyle]}
            pointerEvents="box-none"
          >
            <ARHUD onExit={closeAR} isScanning={isScanning} statusMessage={statusMessage} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  labelWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  brandBubble: {
    backgroundColor: 'rgba(15, 15, 18, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 14,
    borderRadius: 30, // Pill shaped
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    minWidth: 160,
    maxWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  beaconBubble: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 30, // Pill shaped
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(10, 10, 12, 0.95)',
  },
  beaconIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  beaconLabelText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  brandLabelText: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  brandDistanceText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: typography.primary.medium,
    marginTop: 1,
  },
  verticalStalk: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginTop: -2,
  },
  navigationBubble: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    padding: 12,
    paddingHorizontal: 16,
    minWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  directionIndicator: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    marginTop: -22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  directionLeft: {
    left: -54,
  },
  directionRight: {
    right: -54,
  },
  directionArrow: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -4,
  },
});
