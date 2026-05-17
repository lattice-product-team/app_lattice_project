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
  const categoryIcons = useMemo(() => ({
    restaurant: { source: require('../../../../assets/icons/restaurant.png'), sdf: true },
    parking: { source: require('../../../../assets/icons/parking.png'), sdf: true },
    wc: { source: require('../../../../assets/icons/wc.png'), sdf: true },
    medical: { source: require('../../../../assets/icons/medical.png'), sdf: true },
    info: { source: require('../../../../assets/icons/info.png'), sdf: true },
    gate: { source: require('../../../../assets/icons/gate.png'), sdf: true },
    event: { source: require('../../../../assets/icons/event.png'), sdf: true },
  }), []);

  const imageMap = useMemo(() => {
    const images: Record<string, any> = { ...categoryIcons };

    // Register Event Images (Remote)
    events?.forEach((event) => {
      if (event.imageKey && event.images?.[0] && event.imageKey !== 'placeholder-event') {
        images[event.imageKey] = { uri: event.images[0] };
      }
    });

    return images;
  }, [events, categoryIcons]);


  return <MapLibreGL.Images images={imageMap} />;
};

MapImageManager.displayName = 'MapImageManager';
