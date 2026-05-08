import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';

interface EventMarkerProps {
  event: any;
  isSelected?: boolean;
  theme: any;
  onPress: (event: any) => void;
}

export const EventMarker: React.FC<EventMarkerProps> = React.memo(
  ({ event, isSelected = false, theme, onPress }) => {
    const { properties } = event;
    const color = theme.colors.brand.primary;

    const scale = useDerivedValue(() => {
      return withTiming(isSelected ? 1.3 : 1, { duration: 250 });
    }, [isSelected]);

    const translateY = useDerivedValue(() => {
      return withTiming(isSelected ? -10 : 0, { duration: 250 });
    }, [isSelected]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { translateY: translateY.value },
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
                justifyContent: 'flex-end',
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
                    fontSize: 11,
                    // Simulate a thin white halo in light mode only
                    textShadowColor: !theme.dark ? '#FFFFFF' : 'transparent',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: !theme.dark ? 2 : 0,
                  },
                ]}
                numberOfLines={1}
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
