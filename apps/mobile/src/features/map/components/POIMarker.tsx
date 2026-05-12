import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import Animated, { useAnimatedStyle, withSpring, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';

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
  }) => {
    const { properties } = poi;
    const categoryKey = properties.category?.toLowerCase() || 'generic';
    const metadata = getCategoryMetadata(categoryKey);
    const color = metadata.color || theme.colors.brand.primary;
    const IconComponent = metadata.icon;

    return (
      <View style={mapPinStyles.markerWrapper}>
        <TouchableOpacity
          onPress={() => onPress(poi)}
          activeOpacity={0.9}
        >
          <View
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: isSelected ? 1.4 : 1 }]
              }
            ]}
          >
            <MapPinFrame
              size="poi"
              borderColor="#FFFFFF"
              borderWidth={1.5}
              isSelected={isSelected || isLinkedToSelectedEvent}
            >
              <View
                style={[
                  mapPinStyles.placeholder,
                  { backgroundColor: color },
                ]}
              >
                <IconComponent 
                  size={16} 
                  color="#FFFFFF" 
                  strokeWidth={metadata.strokeWidth || 2.5} 
                />
              </View>
            </MapPinFrame>
            
            {isSelected && (
              <View style={mapPinStyles.labelBadge}>
                <Text
                  style={[
                    mapPinStyles.labelText,
                    {
                      color: color,
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
      </View>
    );
  }
);

POIMarker.displayName = 'POIMarker';
