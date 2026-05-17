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
    restaurant: { source: require('../../../../assets/icons/restaurant.svg'), sdf: true },
    parking: { source: require('../../../../assets/icons/parking.svg'), sdf: true },
    wc: { source: require('../../../../assets/icons/wc.svg'), sdf: true },
    medical: { source: require('../../../../assets/icons/medical.svg'), sdf: true },
    info: { source: require('../../../../assets/icons/info.svg'), sdf: true },
    gate: { source: require('../../../../assets/icons/gate.svg'), sdf: true },
  };

  const imageMap = useMemo(() => {
    const images: Record<string, any> = { ...categoryIcons };

    // Register Event Images
    events?.forEach((event) => {
      if (event.imageKey && event.images?.[0] && event.imageKey !== 'placeholder-event') {
        images[event.imageKey] = { uri: event.images[0] };
      }
    });

    return images;
  }, [events]);


  return <MapLibreGL.Images images={imageMap} />;
};

MapImageManager.displayName = 'MapImageManager';
