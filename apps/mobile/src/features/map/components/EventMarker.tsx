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
    const color = metadata.color || theme.colors.brand.primary;
    const IconComponent = metadata.icon;

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        zoomSharedValue.value,
        [10, 13, 16],
        [0.5, 0.8, 1],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(zoomSharedValue.value, [10, 11], [0, 1], Extrapolation.CLAMP);

      return {
        transform: [{ scale: isSelected ? 1.4 : scale }],
        opacity: isSelected ? 1 : opacity,
      };
    });

    return (
      <Animated.View style={[mapPinStyles.markerWrapper, animatedStyle]}>
        <TouchableOpacity onPress={() => onPress(event)} activeOpacity={0.9}>
          <View
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
              },
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
                    strokeWidth={metadata.strokeWidth || 2.5}
                  />
                </View>
              )}
            </MapPinFrame>

            {isSelected && (
              <View style={mapPinStyles.labelBadge}>
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
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

EventMarker.displayName = 'EventMarker';
