import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

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
    isLinkedToSelectedEvent = false,
    zoomSharedValue,
  }) => {
    const { properties } = poi;
    const categoryKey = properties.category?.toLowerCase() || 'generic';
    const metadata = getCategoryMetadata(categoryKey);
    const color = metadata.color || theme.colors.brand.primary;
    const IconComponent = metadata.icon;
    // NO .value access in the component body!
    const mountScale = useSharedValue(0);
    const mountOpacity = useSharedValue(0);

    React.useEffect(() => {
      mountScale.value = withTiming(1, { duration: 200 });
      mountOpacity.value = withTiming(1, { duration: 200 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      const zoom = zoomSharedValue.value;
      const baseScale = interpolate(
        zoom,
        [14, 16, 18],
        [0.8, 1, 1.3],
        Extrapolation.CLAMP
      );

      // Selected markers are even larger
      const scale = isSelected ? 1.3 : baseScale;

      const opacity = interpolate(zoom, [13.5, 14.5], [0, 1], Extrapolation.CLAMP);

      return {
        transform: [
          { scale: scale * mountScale.value },
        ],
        opacity: (isSelected || isLinkedToSelectedEvent ? 1 : opacity) * mountOpacity.value,
      };
    });

    const labelStyle = useAnimatedStyle(() => {
      const zoom = zoomSharedValue.value;
      const opacity = interpolate(zoom, [16.5, 17.5], [0, 1], Extrapolation.CLAMP);
      return {
        opacity: isSelected || isLinkedToSelectedEvent ? 1 : opacity,
      };
    });

    return (
      <Animated.View
        style={[mapPinStyles.markerWrapper, animatedStyle]}
        pointerEvents="auto"
      >
        <TouchableOpacity onPress={() => onPress(poi)} activeOpacity={0.9}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MapPinFrame
              size="poi"
              borderColor="#FFFFFF"
              borderWidth={1.5}
              isSelected={isSelected || isLinkedToSelectedEvent}
            >
              <View style={[mapPinStyles.placeholder, { backgroundColor: color }]}>
                {IconComponent ? (
                  <IconComponent
                    size={16}
                    color="#FFFFFF"
                    strokeWidth={metadata.strokeWidth || 2.5}
                  />
                ) : (
                  <View style={{ width: 16, height: 16 }} />
                )}
              </View>
            </MapPinFrame>

            {properties.name && (
              <Animated.View style={[mapPinStyles.labelBadge, labelStyle]}>
                <Text 
                  style={[mapPinStyles.labelText, { color, textShadowRadius: 0 }]}
                  numberOfLines={1}
                >
                  {properties.name}
                </Text>
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

POIMarker.displayName = 'POIMarker';
