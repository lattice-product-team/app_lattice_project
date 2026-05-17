import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
    
    // USAR COLOR DIRECTO DEL GEOJSON (Sincronizado con nativo)
    const color = properties.color_hex || properties.color || metadata.color || theme.colors.brand.primary;
    
    // PNG Asset Mapper for visual consistency
    const pngIcon = useMemo(() => {
      const category = categoryKey;
      if (category.includes('restaurant') || category.includes('food') || category.includes('coffee')) return require('../../../../assets/icons/restaurant.png');
      if (category.includes('parking')) return require('../../../../assets/icons/parking.png');
      if (category.includes('wc') || category.includes('toilet') || category.includes('restroom')) return require('../../../../assets/icons/toilet.png');
      if (category.includes('medical') || category.includes('hospital')) return require('../../../../assets/icons/hospital.png');
      if (category.includes('info') || category.includes('library')) return require('../../../../assets/icons/library-big.png');
      if (category.includes('gate') || category.includes('login') || category.includes('entrance') || category.includes('log-out')) return require('../../../../assets/icons/log-out.png');
      if (category.includes('bar') || category.includes('beer')) return require('../../../../assets/icons/beer.png');
      if (category.includes('vip') || category.includes('crown')) return require('../../../../assets/icons/crown.png');
      if (category.includes('security') || category.includes('shield')) return require('../../../../assets/icons/shield.png');
      if (category.includes('shop') || category.includes('store') || category.includes('shopping')) return require('../../../../assets/icons/store.png');
      if (category.includes('stage') || category.includes('theater') || category.includes('music')) return require('../../../../assets/icons/theater.png');
      if (category.includes('meetup') || category.includes('users')) return require('../../../../assets/icons/users.png');
      return require('../../../../assets/icons/library-big.png'); // Fallback
    }, [categoryKey]);

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
                <Image
                  source={pngIcon}
                  style={{ width: 18, height: 18, tintColor: '#FFFFFF' }}
                  resizeMode="contain"
                />
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
