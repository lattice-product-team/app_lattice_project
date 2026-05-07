import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinFrame } from './MapPinFrame';
import { mapPinStyles } from '../../../styles/mapPinStyles';

interface EventMarkerProps {
  event: any;
  isSelected?: boolean;
  theme: any;
  onPress: (event: any) => void;
}

export const EventMarker: React.FC<EventMarkerProps> = React.memo(({
  event,
  isSelected = false,
  theme,
  onPress,
}) => {
  const { properties } = event;
  const color = theme.colors.brand.primary;

  return (
    <View style={mapPinStyles.container}>
      <TouchableOpacity 
        onPress={() => onPress(event)}
        activeOpacity={0.9}
        style={{ 
          alignItems: 'center',
          justifyContent: 'flex-end',
          transform: [
            { scale: isSelected ? 1.15 : 1 },
            { translateY: isSelected ? -5 : 0 }
          ]
        }}
      >
        <MapPinFrame 
          size="event"
          borderColor={isSelected ? color : '#FFFFFF'}
          borderWidth={isSelected ? 2.5 : 1.5}
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

        {/* Label */}
        <View style={[
          mapPinStyles.labelBadge,
          { 
            backgroundColor: theme.colors.bg.main,
            borderColor: isSelected ? color : 'rgba(0,0,0,0.05)',
          }
        ]}>
          <Text 
            style={[
              mapPinStyles.labelText,
              { color: theme.colors.text.main, fontSize: isSelected ? 12 : 11 }
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

EventMarker.displayName = 'EventMarker';
