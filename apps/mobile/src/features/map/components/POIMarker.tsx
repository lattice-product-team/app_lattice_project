import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import Animated, { useAnimatedStyle, withSpring, interpolate, Extrapolate, SharedValue } from 'react-native-reanimated';

interface POIMarkerProps {
  poi: any;
  isSelected?: boolean;
  theme: any;
  onPress: (poi: any) => void;
  zoomSharedValue: SharedValue<number>;
  isLinkedToSelectedEvent?: boolean;
  spiderAngle?: number;
  isSpiderfied?: boolean;
}

export const POIMarker: React.FC<POIMarkerProps> = React.memo(
  ({ 
    poi, 
    isSelected = false, 
    theme, 
    onPress, 
    zoomSharedValue,
    isLinkedToSelectedEvent = false,
  }) => {
    const { properties } = poi;
    
    // Resolve category and metadata (now containing the Lucide component)
    const categoryKey = properties.category?.toLowerCase() || 'generic';
    const metadata = getCategoryMetadata(categoryKey);
    const color = metadata.color || theme.colors.brand.primary;
    const IconComponent = metadata.icon;

    const animatedStyle = useAnimatedStyle(() => {
      // 1. Visibility & Scale logic based on zoom (Handled on UI thread)
      const zoomOpacity = interpolate(
        zoomSharedValue.value,
        [14.2, 14.5],
        [0, 1],
        Extrapolate.CLAMP
      );
      
      const finalOpacity = (isSelected || isLinkedToSelectedEvent) ? 1 : zoomOpacity;
      
      // 2. Base scale with selection bounce
      const baseScale = withSpring(isSelected ? 1.4 : 1, theme.motion.physics.snappy);
      
      // 3. Zoom-based scaling (slightly smaller when zoomed out)
      const zoomScale = interpolate(
        zoomSharedValue.value,
        [14.5, 17],
        [0.8, 1],
        Extrapolate.CLAMP
      );

      return {
        opacity: finalOpacity,
        transform: [
          { scale: baseScale * zoomScale },
        ],
      };
    });

    const labelAnimatedStyle = useAnimatedStyle(() => {
      const labelOpacity = interpolate(
        zoomSharedValue.value,
        [16.5, 17],
        [0, 1],
        Extrapolate.CLAMP
      );
      
      return {
        opacity: isSelected ? 1 : labelOpacity,
      };
    });

    return (
      <View style={mapPinStyles.markerWrapper}>
        <TouchableOpacity
          onPress={() => onPress(poi)}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedStyle,
            ]}
          >
            <MapPinFrame
              size="poi"
              borderColor="#FFFFFF"
              borderWidth={1.5}
              isSelected={isSelected}
            >
              <View
                style={[
                  mapPinStyles.placeholder,
                  { backgroundColor: color },
                ]}
              >
                <IconComponent 
                  size={16} 
                  color="#FFFFFF" 
                  strokeWidth={2.5} 
                />
              </View>
            </MapPinFrame>
            <Animated.View style={[mapPinStyles.labelBadge, labelAnimatedStyle]}>
              <Text
                style={[
                  mapPinStyles.labelText,
                  {
                    color: color,
                  },
                ]}
                numberOfLines={2}
              >
                {properties.name}
              </Text>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
);

POIMarker.displayName = 'POIMarker';
