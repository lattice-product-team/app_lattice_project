import React from 'react';
import { EventPin } from './EventPin';
import { POIPin } from './POIPin';
import { SharedValue } from 'react-native-reanimated';

interface MapInteractionLayerProps {
  selectedEventId: string | number | null;
  selectedPoiId: string | null;
  onEventPress: (event: any) => void;
  onPoiPress: (poi: any) => void;
  zoomSharedValue: SharedValue<number>;
}

export const MapInteractionLayer = ({
  selectedEventId,
  selectedPoiId,
  onEventPress,
  onPoiPress,
  zoomSharedValue
}: MapInteractionLayerProps) => {
  return (
    <>
      {/* Sub-POIs and Events are now handled by MapLayers.tsx via GPU layers for performance and stability */}
    </>
  );
};

MapInteractionLayer.displayName = 'MapInteractionLayer';
