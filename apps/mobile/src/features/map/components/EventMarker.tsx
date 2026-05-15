import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { getEventMetadata } from '../../../utils/poiUtils';

interface EventMarkerProps {
  event: any;
  isSelected?: boolean;
  theme: any;
  onPress: (event: any) => void;
  zoomSharedValue: SharedValue<number>;
  spiderAngle?: number;
  isSpiderfied?: boolean;
}

export const EventMarker: React.FC<EventMarkerProps> = React.memo(
  ({ event, isSelected = false, theme, onPress, zoomSharedValue }) => {
    const { properties } = event;
    const metadata = getEventMetadata(properties.category);
    const color = properties.color || metadata.color || theme.colors.brand.primary;
    const IconComponent = metadata.icon;

    const iconStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        zoomSharedValue.value,
        [11.5, 12.0, 13.5, 14.0],
        [0, 1, 1, 0],
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        zoomSharedValue.value,
        [11.5, 13],
        [0.6, 1],
        Extrapolation.CLAMP
      );

      return {
        opacity: isSelected ? 1 : opacity,
        transform: [{ scale: isSelected ? 1.4 : scale }],
      };
    });

    const labelStyle = useAnimatedStyle(() => {
      // Small label shown under icon when zoomed in, but fades out at max zoom
      const opacity = interpolate(
        zoomSharedValue.value,
        [13, 14, 16, 17],
        [0, 1, 1, 0],
        Extrapolation.CLAMP
      );
      return {
        opacity: isSelected ? 1 : opacity,
      };
    });

    const largeLabelStyle = useAnimatedStyle(() => {
      // Large label shown when zoomed out
      const opacity = interpolate(
        zoomSharedValue.value,
        [9, 10, 12, 13],
        [0, 1, 1, 0],
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        zoomSharedValue.value,
        [9, 11],
        [0.8, 1.2], // Make it slightly larger when zoomed out
        Extrapolation.CLAMP
      );
      return {
        opacity: isSelected ? 0 : opacity, // Hide large label when selected or zoomed in
        transform: [{ scale }],
        position: 'absolute',
      };
    });

    return (
      <View style={mapPinStyles.markerWrapper}>
        <TouchableOpacity onPress={() => onPress(event)} activeOpacity={0.9} style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* CIRCULAR ICON (Zoomed In View) */}
          <Animated.View style={iconStyle}>
            <MapPinFrame
              size="event"
              borderColor="#FFFFFF"
              borderWidth={1.5}
              isSelected={isSelected}
            >
              {properties.imageUrl ? (
                <Image
                  source={{ uri: properties.imageUrl }}
                  style={mapPinStyles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={[mapPinStyles.placeholder, { backgroundColor: color }]}>
                  <IconComponent
                    size={24}
                    color="#FFFFFF"
                    strokeWidth={metadata.strokeWidth || 2.5}
                  />
                </View>
              )}
            </MapPinFrame>

          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
);

EventMarker.displayName = 'EventMarker';
