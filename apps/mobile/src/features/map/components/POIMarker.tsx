import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';

interface POIMarkerProps {
  poi: any;
  isSelected?: boolean;
  theme: any;
  onPress: (poi: any) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  coffee: require('../../../../assets/icons/coffee.png'),
  restaurant: require('../../../../assets/icons/restaurant.png'),
  parking: require('../../../../assets/icons/parking.png'),
  wc: require('../../../../assets/icons/wc.png'),
  medical: require('../../../../assets/icons/medical.png'),
  info: require('../../../../assets/icons/info.png'),
  shop: require('../../../../assets/icons/shop.png'),
  gate: require('../../../../assets/icons/gate.png'),
  museum: require('../../../../assets/icons/museum.png'),
  park: require('../../../../assets/icons/park.png'),
  hotel: require('../../../../assets/icons/hotel.png'),
  pharmacy: require('../../../../assets/icons/pharmacy.png'),
  gym: require('../../../../assets/icons/gym.png'),
  bank: require('../../../../assets/icons/bank.png'),
  default: require('../../../../assets/icons/marker.png'),
};

export const POIMarker: React.FC<POIMarkerProps> = React.memo(
  ({ poi, isSelected = false, theme, onPress }) => {
    const { properties } = poi;
    // Resolve metadata and color
    const metadata = getCategoryMetadata(properties.category);
    const color = metadata.color || theme.colors.brand.primary;
    
    // Resolve icon asset
    const iconSource = CATEGORY_ICONS[properties.category] || CATEGORY_ICONS.default;

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
          onPress={() => onPress(poi)}
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
                <Image
                  source={iconSource}
                  style={{ width: 18, height: 18, tintColor: '#FFFFFF' }}
                  resizeMode="contain"
                />
              </View>
            </MapPinFrame>

            <View style={mapPinStyles.labelBadge}>
              <Text
                style={[
                  mapPinStyles.labelText,
                  {
                    color: theme.colors.text.primary,
                    fontSize: 10,
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

POIMarker.displayName = 'POIMarker';
