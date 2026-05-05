import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { EventPin } from './EventPin';
import { useMapProjection } from '../hooks/useMapProjection';

interface MapVirtualOverlayProps {
  events: any[];
  selectedEventId: string | number | null;
  onEventPress: (event: any) => void;
  cameraCenter: SharedValue<number[]>;
  cameraZoom: SharedValue<number>;
  mapDimensions: { width: number; height: number };
}

export const MapVirtualOverlay = ({
  events,
  selectedEventId,
  onEventPress,
  cameraCenter,
  cameraZoom,
  mapDimensions
}: MapVirtualOverlayProps) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {events.map((event) => (
        <VirtualEventPin
          key={event.id}
          event={event}
          isSelected={String(selectedEventId) === String(event.id)}
          onPress={() => onEventPress(event)}
          cameraCenter={cameraCenter}
          cameraZoom={cameraZoom}
          mapDimensions={mapDimensions}
        />
      ))}
    </View>
  );
};

const VirtualEventPin = ({ 
  event, 
  isSelected, 
  onPress, 
  cameraCenter, 
  cameraZoom, 
  mapDimensions 
}: any) => {
  const [lng, lat] = event.coordinates;
  
  // Use our custom hook to get the pixel position
  const projection = useMapProjection(lng, lat, cameraCenter, cameraZoom, mapDimensions);

  const animatedStyle = useAnimatedStyle(() => {
    const { x, y } = projection.value;
    
    // Check if the point is within screen bounds (with some padding)
    const padding = 100;
    const isVisible = x > -padding && x < mapDimensions.width + padding &&
                      y > -padding && y < mapDimensions.height + padding;

    return {
      position: 'absolute',
      left: 0,
      top: 0,
      transform: [
        { translateX: x - 32 }, // Center the pin (half of touch area width)
        { translateY: y - 54 }  // Align bottom of pin to the coordinate
      ],
      opacity: isVisible ? 1 : 0,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <EventPin 
        id={event.id}
        name={event.displayName}
        imageUrl={event.images?.[0]}
        isSelected={isSelected}
        onPress={onPress}
        color={event.mainColor}
      />
    </Animated.View>
  );
};
