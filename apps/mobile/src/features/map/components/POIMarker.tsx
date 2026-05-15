import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
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

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        zoomSharedValue.value,
        [13, 15, 18],
        [0.5, 0.8, 1],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(zoomSharedValue.value, [13.5, 14.0], [0, 1], Extrapolation.CLAMP);

      return {
        transform: [{ scale: isSelected ? 1.4 : scale }],
        opacity: isSelected || isLinkedToSelectedEvent ? 1 : opacity,
      };
    });

    const pointerEvents = (isSelected || isLinkedToSelectedEvent || zoomSharedValue.value >= 14.0) ? 'auto' : 'none';

    return (
      <Animated.View style={[mapPinStyles.markerWrapper, animatedStyle]} pointerEvents={pointerEvents}>
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
                <IconComponent
                  size={16}
                  color="#FFFFFF"
                  strokeWidth={metadata.strokeWidth || 2.5}
                />
              </View>
            </MapPinFrame>

          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

POIMarker.displayName = 'POIMarker';
