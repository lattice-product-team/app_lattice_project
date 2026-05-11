import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';
import * as LucideIcons from 'lucide-react-native';

interface POIMarkerProps {
  poi: any;
  isSelected?: boolean;
  theme: any;
  onPress: (poi: any) => void;
}

/**
 * Lucide icon mapping for POI categories.
 * Using Lucide provides sharp, vector-based icons that match the premium chromatic style.
 */
const CATEGORY_LUCIDE_MAP: Record<string, keyof typeof LucideIcons> = {
  restaurant: 'Utensils',
  food: 'Utensils',
  coffee: 'Coffee',
  parking: 'ParkingCircle',
  wc: 'Toilet',
  toilet: 'Toilet',
  restroom: 'Toilet',
  medical: 'Plus',
  hospital: 'Hospital',
  info: 'Info',
  shop: 'ShoppingBag',
  shopping: 'ShoppingBag',
  gate: 'LogIn',
  entrance: 'LogIn',
  grandstand: 'GalleryVertical',
  meetup_point: 'Users',
  museum: 'Landmark',
  park: 'Trees',
  hotel: 'Bed',
  pharmacy: 'Pill',
  gym: 'Dumbbell',
  bank: 'Landmark',
  generic: 'MapPin',
};

export const POIMarker: React.FC<POIMarkerProps> = React.memo(
  ({ poi, isSelected = false, theme, onPress }) => {
    const { properties } = poi;
    
    // Resolve category and color
    const categoryKey = properties.category?.toLowerCase() || 'generic';
    const metadata = getCategoryMetadata(categoryKey);
    const color = metadata.color || theme.colors.brand.primary;
    
    // Resolve Lucide Icon component
    const IconName = CATEGORY_LUCIDE_MAP[categoryKey] || 'MapPin';
    const IconComponent = (LucideIcons[IconName] as any) || LucideIcons.MapPin;

    const scale = useDerivedValue(() => {
      return withTiming(isSelected ? 1.4 : 1, { duration: 250 });
    }, [isSelected]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
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
                justifyContent: 'center',
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
                <IconComponent 
                  size={16} 
                  color="#FFFFFF" 
                  strokeWidth={2.5} 
                />
              </View>
            </MapPinFrame>

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
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
);

POIMarker.displayName = 'POIMarker';
