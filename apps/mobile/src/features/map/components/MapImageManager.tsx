import React, { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { StandardUIPOI } from '../../../types/models/poi';

interface MapImageManagerProps {
  events: StandardUIPOI[];
}

/**
 * Manages the registration of remote event images into MapLibre's texture atlas.
 * This is crucial for GPU-based SymbolLayers to render dynamic icons.
 */
export const MapImageManager = ({ events }: MapImageManagerProps) => {
  // Extract all event images and map them to their unique keys
  const eventImages = useMemo(() => {
    const images: Record<string, { uri: string }> = {};
    
    events.forEach((event) => {
      // imageKey is guaranteed by our normalizeEvent adapter
      if (event.imageKey && event.images?.[0] && event.imageKey !== 'placeholder-event') {
        images[event.imageKey] = { uri: event.images[0] };
      }
    });
    
    return images;
  }, [events]);

  return (
    <MapLibreGL.Images 
      images={eventImages} 
      // We could add standard local placeholders here if needed
      // example: placeholder: require('../../../../assets/images/icon.png')
    />
  );
};

MapImageManager.displayName = 'MapImageManager';
