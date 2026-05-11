import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import Animated, { useAnimatedStyle, withSpring, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';
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
    const color = metadata.color || theme.colors.brand.primary;
    const IconComponent = metadata.icon;

    const animatedStyle = useAnimatedStyle(() => {
      // 1. Selection scale with spring
      const baseScale = withSpring(isSelected ? 1.4 : 1, theme.motion.physics.snappy);
      
      // 2. Zoom-based scaling
      const zoomScale = interpolate(
        zoomSharedValue.value,
        [13, 17],
        [0.8, 1],
        Extrapolation.CLAMP
      );

      return {
        transform: [
          { scale: baseScale * zoomScale },
        ],
      };
    });

    const labelAnimatedStyle = useAnimatedStyle(() => {
      const labelOpacity = interpolate(
        zoomSharedValue.value,
        [14, 15],
        [0, 1],
        Extrapolation.CLAMP
      );
      
      return {
        opacity: isSelected ? 1 : labelOpacity,
      };
    });

    return (
      <View style={mapPinStyles.markerWrapper}>
        <TouchableOpacity
          onPress={() => onPress(event)}
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
                    strokeWidth={2.2} 
                  />
                </View>
              )}
            </MapPinFrame>

            <Animated.View style={[mapPinStyles.labelBadge, labelAnimatedStyle]}>
              <Text
                style={[
                  mapPinStyles.labelText,
                  {
                    color: theme.colors.text.primary,
                    textShadowColor: theme.colors.bg.surface,
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
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

EventMarker.displayName = 'EventMarker';
