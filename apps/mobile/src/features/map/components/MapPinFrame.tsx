import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { mapPinStyles } from '../../../styles/mapPinStyles';

interface MapPinFrameProps {
  children: React.ReactNode;
  size?: 'event' | 'poi';
  borderColor?: string;
  borderWidth?: number;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const MapPinFrame: React.FC<MapPinFrameProps> = ({
  children,
  size = 'event',
  borderColor = '#FFFFFF',
  borderWidth = 1.5,
  isSelected = false,
  style,
}) => {
  const pinSize = size === 'event' ? mapPinStyles.eventPinSize : mapPinStyles.poiPinSize;
  
  return (
    <View 
      style={[
        mapPinStyles.pinFrame, 
        pinSize,
        { 
          borderColor, 
          borderWidth: isSelected ? borderWidth + 1 : borderWidth,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};
