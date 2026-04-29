import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas } from '@react-three/fiber/native';
import { useLocationStore } from '../../../../store/useLocationStore';
import { useOrientationStore } from '../../../../store/useOrientationStore';
import { MainARScene } from './MainARScene';
import { CameraPermissionView } from '../../../../components/ui/CameraPermissionView';
import { ARHUD } from './ARHUD';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
} from 'react-native-reanimated';
import { typography } from '../../../../styles/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCategoryMetadata } from '../../../../utils/poiUtils';

// Math helpers
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const l1 = lon1 * Math.PI / 180;
  const l2 = lon2 * Math.PI / 180;
  const y = Math.sin(l2 - l1) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
  const theta = Math.atan2(y, x);
  return (theta * 180 / Math.PI + 360) % 360;
};

interface AROverlayProps {
  isVisible: boolean;
  onExitAR?: () => void;
  pois?: any[];
}

export const AROverlay: React.FC<AROverlayProps> = ({ isVisible, onExitAR, pois = [] }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const hudOpacity = useSharedValue(0);
  const { width, height } = useWindowDimensions();

  const userCoords = useLocationStore((s) => s.coords);
  const heading = useOrientationStore((s) => s.heading);
  const isLandscape = useOrientationStore((s) => s.isLandscape);

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
    transform: [{ translateY: withTiming(hudOpacity.value === 1 ? 0 : 20, { duration: 600 }) }]
  }));

  // Filter POIs by distance for AR - MUST BE AT TOP LEVEL BEFORE EARLY RETURNS
  const activePois = React.useMemo(() => {
    if (!userCoords || !pois.length) return [];
    const [userLon, userLat] = userCoords;
    return pois.filter(poi => {
      const [poiLon, poiLat] = poi.geometry.coordinates;
      const dist = getDistance(userLat, userLon, poiLat, poiLon);
      return dist < 1000;
    });
  }, [userCoords, pois]);

  if (!isVisible) return null;
  if (!permission) return <View style={styles.permissionContainer} />;
  if (!permission.granted) return <View style={StyleSheet.absoluteFill}><CameraPermissionView onRequestPermission={requestPermission} /></View>;

  const isScanning = activePois.length === 0;

  // Calculate 2D Screen Overlay Positions for Text Labels
  const render2DLabels = (poisToRender: any[]) => {
    if (!userCoords || poisToRender.length === 0) return null;
    const [userLon, userLat] = userCoords;
    const FOV = 60; // Camera Field of View
    
    return poisToRender.map((poi, idx) => {
      const [poiLon, poiLat] = poi.geometry.coordinates;
      const distance = getDistance(userLat, userLon, poiLat, poiLon);
      const metadata = getCategoryMetadata(poi.properties.category);

      const bearing = getBearing(userLat, userLon, poiLat, poiLon);
      let angleDiff = bearing - heading;
      
      // Normalize to -180...180
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      // Only show if it's within the front hemisphere and reasonably centered
      if (Math.abs(angleDiff) > 45) return null;

      // Use staggered height to prevent overlaps but more subtly
      let yOffset = (idx % 2) * 50 - 25; 
      
      if (isLandscape) {
        // When physically landscape but OS is portrait (rotated 90deg CW)
        // The camera view is filling the screen [width x height]
        // Our UI will be rotated 90deg.
        // angleDiff maps to 'vertical' movement on the portrait screen (which is horizontal movement for the user)
        const centerOffset = (angleDiff / (FOV / 2)) * (height / 2);
        const screenYPos = (height / 2) + centerOffset;
        // distance/elevation maps to 'horizontal' movement on portrait screen
        const screenXPos = (width / 2) + yOffset;

        return (
          <View 
            key={`2d-label-${poi.properties.id}`} 
            style={{ 
              position: 'absolute', 
              top: screenYPos - 40,
              left: screenXPos - 120,
              width: 240, 
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ rotate: '90deg' }]
            }}
          >
            <View style={styles.premiumBubble}>
              <View style={[styles.iconContainer, { backgroundColor: metadata.color }]}>
                <MaterialCommunityIcons name={metadata.icon as any} size={18} color="white" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.premiumLabelText} numberOfLines={1}>{poi.properties.name}</Text>
                <Text style={styles.premiumDistanceText}>{Math.round(distance)}m • Ahead</Text>
              </View>
            </View>
            <View style={styles.horizontalStalk} />
          </View>
        );
      } else {
        // Standard Portrait
        const xPos = (angleDiff / (FOV / 2)) * (width / 2) + (width / 2);
        const yPos = (height / 2) + yOffset - 120;

        return (
          <View 
            key={`2d-label-${poi.properties.id}`} 
            style={{ 
              position: 'absolute', 
              left: xPos - 100,
              top: yPos,
              width: 200, 
              alignItems: 'center' 
            }}
          >
            <View style={styles.premiumBubble}>
              <View style={[styles.iconContainer, { backgroundColor: metadata.color }]}>
                <MaterialCommunityIcons name={metadata.icon as any} size={18} color="white" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.premiumLabelText} numberOfLines={1}>{poi.properties.name}</Text>
                <Text style={styles.premiumDistanceText}>{Math.round(distance)}m • Ahead</Text>
              </View>
            </View>
            <View style={styles.verticalStalk} />
          </View>
        );
      }
    });
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
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
              {/* eslint-disable-next-line react/no-unknown-property */}
              <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
              <MainARScene 
                pois={activePois}
              />
            </Canvas>
          </View>
          
          {/* 2D Projection Overlay */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {render2DLabels(activePois)}
          </View>

          <Animated.View style={[StyleSheet.absoluteFill, hudAnimatedStyle]} pointerEvents="box-none">
            <ARHUD 
              onExit={onExitAR || (() => {})} 
              isLandscape={isLandscape}
              isScanning={isScanning}
            />
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
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  premiumBubble: {
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 160,
    maxWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
  premiumLabelText: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  premiumDistanceText: {
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
  horizontalStalk: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: -2,
  }
});
