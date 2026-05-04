import React from 'react';
import { EventPin } from './EventPin';
import { POIPin } from './POIPin';
import { SharedValue } from 'react-native-reanimated';

interface MapInteractionLayerProps {
  events: any[];
  visiblePois: any[];
  selectedEventId: string | number | null;
  selectedPoiId: string | null;
  onEventPress: (event: any) => void;
  onPoiPress: (poi: any) => void;
  zoomSharedValue: SharedValue<number>;
}

export const MapInteractionLayer = ({
  events,
  visiblePois,
  selectedEventId,
  selectedPoiId,
  onEventPress,
  onPoiPress,
  zoomSharedValue
}: MapInteractionLayerProps) => {
  return (
    <>
      {/* 1. Main Events */}
      {events.map((event) => (
        <EventPin
          key={event.id}
          id={event.id}
          name={event.displayName}
          imageUrl={event.images?.[0]}
          coordinates={event.coordinates}
          isSelected={String(selectedEventId) === String(event.id)}
          onPress={() => onEventPress(event)}
          zoom={zoomSharedValue}
        />
      ))}

      {/* 2. Sub-POIs (Revealed Hierarchically) */}
      {visiblePois.filter(p => p.category !== 'event').map((poi) => (
        <POIPin
          key={poi.id}
          id={poi.id}
          category={poi.category}
          icon={poi.categoryIcon}
          iconFamily={poi.iconFamily}
          color={poi.mainColor}
          coordinates={poi.coordinates}
          isSelected={selectedPoiId === poi.id}
          onPress={() => onPoiPress(poi)}
          zoom={zoomSharedValue}
        />
      ))}
    </>
  );
};

MapInteractionLayer.displayName = 'MapInteractionLayer';
