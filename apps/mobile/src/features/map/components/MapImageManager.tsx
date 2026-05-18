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
  const categoryIcons = useMemo(
    () => ({
      restaurant: { source: require('../../../../assets/icons/restaurant.png'), sdf: true },
      parking: { source: require('../../../../assets/icons/parking.png'), sdf: true },
      toilet: { source: require('../../../../assets/icons/toilet.png'), sdf: true },
      hospital: { source: require('../../../../assets/icons/hospital.png'), sdf: true },
      'library-big': { source: require('../../../../assets/icons/library-big.png'), sdf: true },
      'log-out': { source: require('../../../../assets/icons/log-out.png'), sdf: true },
      beer: { source: require('../../../../assets/icons/beer.png'), sdf: true },
      crown: { source: require('../../../../assets/icons/crown.png'), sdf: true },
      shield: { source: require('../../../../assets/icons/shield.png'), sdf: true },
      store: { source: require('../../../../assets/icons/store.png'), sdf: true },
      theater: { source: require('../../../../assets/icons/theater.png'), sdf: true },
      users: { source: require('../../../../assets/icons/users.png'), sdf: true },
    }),
    []
  );

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
