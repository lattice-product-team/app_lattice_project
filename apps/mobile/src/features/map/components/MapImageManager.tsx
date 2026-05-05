import React, { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { StandardUIPOI } from '../../../types/models/poi';

interface MapImageManagerProps {
  events: StandardUIPOI[];
}

/**
 * Manages the registration of remote event images into MapLibre's texture atlas.
 */
export const MapImageManager = ({ events }: MapImageManagerProps) => {
  const imageMap = useMemo(() => {
    const images: Record<string, any> = {};
    events.forEach((event) => {
      if (event.imageKey && event.images?.[0] && event.imageKey !== 'placeholder-event') {
        images[event.imageKey] = { uri: event.images[0] };
      }
    });
    return images;
  }, [events]);

  return (
    <MapLibreGL.Images images={imageMap} />
  );
};

MapImageManager.displayName = 'MapImageManager';
