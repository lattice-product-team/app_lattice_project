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
    const isPointerEnabled = isSelected || isLinkedToSelectedEvent || zoomSharedValue.value >= 14.0;

    const mountScale = useSharedValue(0);
    const mountOpacity = useSharedValue(0);

    React.useEffect(() => {
      mountScale.value = withTiming(1, { duration: 200 });
      mountOpacity.value = withTiming(1, { duration: 200 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      const baseScale = interpolate(
        zoomSharedValue.value,
        [14, 16, 18],
        [0.8, 1, 1.3], // Enlarged scales
        Extrapolation.CLAMP
      );

      // Selected markers are even larger
      const scale = isSelected ? 1.3 : baseScale;

      const opacity = interpolate(zoomSharedValue.value, [13.5, 14.5], [0, 1], Extrapolation.CLAMP);

      return {
        transform: [
          { scale: scale * mountScale.value }, // Multiply by mount animation
        ],
        opacity: (isSelected || isLinkedToSelectedEvent ? 1 : opacity) * mountOpacity.value,
      };
    });

    const pointerEvents = isSelected || isLinkedToSelectedEvent || isPointerEnabled ? 'auto' : 'none';

    return (
      <Animated.View
        style={[mapPinStyles.markerWrapper, animatedStyle]}
        pointerEvents={pointerEvents}
      >
        <TouchableOpacity onPress={() => onPress(poi)} activeOpacity={0.9}>
          <View
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
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
              <View style={mapPinStyles.labelBadge}>
                <Text 
                  style={[mapPinStyles.labelText, { color, textShadowRadius: 0 }]}
                  numberOfLines={1}
                >
                  {properties.name}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

POIMarker.displayName = 'POIMarker';
