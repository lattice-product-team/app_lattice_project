import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';
import { getCategoryMetadata } from '../../../utils/poiUtils';

interface POIMarkerProps {
  poi: any;
  isSelected?: boolean;
  theme: any;
  onPress: (poi: any) => void;
}

export const POIMarker: React.FC<POIMarkerProps> = React.memo(({
  poi,
  isSelected = false,
  theme,
  onPress,
}) => {
  const { properties } = poi;
  const metadata = getCategoryMetadata(properties.category);
  const color = metadata.color || theme.colors.brand.primary;
  const IconComponent = metadata.iconFamily === 'material' ? MaterialCommunityIcons : Feather;

  return (
    <View style={mapPinStyles.container}>
      <TouchableOpacity 
        onPress={() => onPress(poi)}
        activeOpacity={0.8}
        style={{ 
          alignItems: 'center',
          justifyContent: 'flex-end',
          // Correct for scale-from-center with bottom anchor
          transform: [
            { scale: isSelected ? 1.2 : 1 },
            { translateY: isSelected ? -4 : 0 } // Fine-tuned offset
          ]
        }}
      >
        <MapPinFrame 
          size="poi"
          borderColor={isSelected ? color : '#FFFFFF'}
          borderWidth={isSelected ? 2 : 1}
          isSelected={isSelected}
        >
          <View style={[mapPinStyles.placeholder, { backgroundColor: isSelected ? color : '#FFFFFF' }]}>
            <IconComponent 
              name={metadata.icon as any} 
              size={18} 
              color={isSelected ? '#FFFFFF' : color} 
            />
          </View>
        </MapPinFrame>

        {/* Minimal Label for POIs */}
        <View style={[
          mapPinStyles.labelBadge,
          { 
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: 'rgba(0,0,0,0.05)',
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginTop: 4
          }
        ]}>
          <Text 
            style={[
              mapPinStyles.labelText,
              { color: '#000000', fontSize: 10 }
            ]} 
            numberOfLines={1}
          >
            {properties.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

POIMarker.displayName = 'POIMarker';
