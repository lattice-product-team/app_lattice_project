import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Animated, { 
  withSpring, 
  withTiming,
  withDelay,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { usePOIStore } from '../../poi/store/usePOIStore';

interface POIPinProps {
  id: string | number;
  category: string;
  icon: string;
  iconFamily?: 'feather' | 'material';
  color: string;
  coordinates: number[];
  isSelected: boolean;
  onPress: () => void;
  zoom: SharedValue<number>;
}

export const POIPin = React.memo(({ 
  category, 
  icon, 
  iconFamily = 'feather',
  color, 
  coordinates, 
  isSelected, 
  onPress,
  zoom
}: POIPinProps) => {
  const theme = useAppTheme();
  const activeFilters = usePOIStore(s => s.activeCategoryFilters);
  const scale = useSharedValue(0); // Start at 0 for pop animation
  const opacity = useSharedValue(0);
  
  const isDimmed = activeFilters.length > 0 && !activeFilters.includes(category);

  useEffect(() => {
    // Very short delay only to prevent (0,0) flash, then let zoom drive it
    opacity.value = withTiming(1, { duration: 150 });
  }, []);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.3 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    // Zoom-based opacity (Fade out between 16.0 and 15.5)
    const zoomOpacity = interpolate(
      zoom.value,
      [15.5, 16.0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value * zoomOpacity * (isDimmed ? 0.3 : 1),
    };
  });

  const IconComponent = iconFamily === 'material' ? MaterialCommunityIcons : Feather;

  return (
    <MapLibreGL.MarkerView coordinate={coordinates}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.touchTarget} onTouchEnd={onPress}>
          <View style={[
            styles.glyphCircle, 
            { backgroundColor: color || theme.colors.brand.primary }
          ]}>
            <IconComponent 
              name={icon as any} 
              size={12} 
              color="#FFFFFF" 
            />
          </View>
        </View>
      </Animated.View>
    </MapLibreGL.MarkerView>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchTarget: {
    padding: 8, // Larger hit area
  },
  glyphCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
