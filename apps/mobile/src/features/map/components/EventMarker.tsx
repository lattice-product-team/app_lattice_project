import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface EventMarkerProps {
  event: any;
  isSelected?: boolean;
  theme: any;
  onPress: (event: any) => void;
  spiderAngle?: number;
  isSpiderfied?: boolean;
}

export const EventMarker: React.FC<EventMarkerProps> = React.memo(
  ({ event, isSelected = false, theme, onPress, spiderAngle = 0, isSpiderfied = false }) => {
    const { properties } = event;
    const color = theme.colors.brand.primary;

    const animatedStyle = useAnimatedStyle(() => {
      const targetX = isSpiderfied ? 45 * Math.cos(spiderAngle) : 0;
      const targetY = isSpiderfied ? 45 * Math.sin(spiderAngle) : 0;

      return {
        transform: [
          { scale: withSpring(isSelected ? 1.4 : 1, theme.motion.physics.snappy) },
          { translateX: withSpring(targetX, theme.motion.physics.snappy) },
          { translateY: withSpring(targetY, theme.motion.physics.snappy) },
        ],
      };
    });

    return (
      <View style={mapPinStyles.container}>
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
                  <Text style={mapPinStyles.placeholderText}>{properties.name?.charAt(0)}</Text>
                </View>
              )}
            </MapPinFrame>

            <View style={mapPinStyles.labelBadge}>
              <Text
                style={[
                  mapPinStyles.labelText,
                  {
                    color: theme.colors.text.primary,
                  },
                ]}
                numberOfLines={2}
              >
                {properties.name}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
);

EventMarker.displayName = 'EventMarker';
