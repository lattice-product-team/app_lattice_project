import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { usePOIStore } from '../../poi/store/usePOIStore';

interface POIPinProps {
  id: string | number;
  category: string;
  icon: string;
  color: string;
  coordinates: number[];
  isSelected: boolean;
  onPress: () => void;
}

export const POIPin = React.memo(({ 
  category, 
  icon, 
  color, 
  coordinates, 
  isSelected, 
  onPress 
}: POIPinProps) => {
  const theme = useAppTheme();
  const activeFilters = usePOIStore(s => s.activeCategoryFilters);
  const scale = useSharedValue(0); // Start at 0 for pop animation
  
  const isDimmed = activeFilters.length > 0 && !activeFilters.includes(category);

  React.useEffect(() => {
    // Pop animation on mount
    scale.value = withSpring(isSelected ? 1.3 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withSpring(isDimmed ? 0.3 : 1),
  }));

  return (
    <MapLibreGL.MarkerView coordinate={coordinates}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.touchTarget} onTouchEnd={onPress}>
          <View style={[
            styles.glyphCircle, 
            { backgroundColor: color || theme.colors.brand.primary }
          ]}>
            <MaterialCommunityIcons 
              name={icon as any} 
              size={14} 
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
