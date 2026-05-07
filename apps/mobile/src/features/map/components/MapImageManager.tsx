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
  const categoryIcons = {
    'coffee': 'https://img.icons8.com/ios-filled/50/ffffff/coffee-to-go.png',
    'restaurant': 'https://img.icons8.com/ios-filled/50/ffffff/restaurant.png',
    'parking': 'https://img.icons8.com/ios-filled/50/ffffff/parking.png',
    'wc': 'https://img.icons8.com/ios-filled/50/ffffff/toilet.png',
    'medical': 'https://img.icons8.com/ios-filled/50/ffffff/first-aid-kit.png',
    'info': 'https://img.icons8.com/ios-filled/50/ffffff/info.png',
    'shop': 'https://img.icons8.com/ios-filled/50/ffffff/shopping-bag.png',
    'gate': 'https://img.icons8.com/ios-filled/50/ffffff/door-open.png',
    'default': 'https://img.icons8.com/ios-filled/50/ffffff/marker.png',
  };

  const imageMap = useMemo(() => {
    const images: Record<string, any> = {};
    
    // Register Event Images
    events.forEach((event) => {
      if (event.imageKey && event.images?.[0] && event.imageKey !== 'placeholder-event') {
        images[event.imageKey] = { uri: event.images[0] };
      }
    });

    // Register Category Icons
    Object.entries(categoryIcons).forEach(([key, url]) => {
      images[`icon-${key}`] = { uri: url };
    });

    return images;
  }, [events]);

  return (
    <MapLibreGL.Images images={imageMap} />
  );
};

MapImageManager.displayName = 'MapImageManager';
