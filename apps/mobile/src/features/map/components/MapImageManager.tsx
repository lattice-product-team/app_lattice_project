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
    /*
    coffee: require('../../../../assets/icons/coffee.png'),
    restaurant: require('../../../../assets/icons/restaurant.png'),
    parking: require('../../../../assets/icons/parking.png'),
    wc: require('../../../../assets/icons/wc.png'),
    medical: require('../../../../assets/icons/medical.png'),
    info: require('../../../../assets/icons/info.png'),
    shop: require('../../../../assets/icons/shop.png'),
    gate: require('../../../../assets/icons/gate.png'),
    museum: require('../../../../assets/icons/museum.png'),
    park: require('../../../../assets/icons/park.png'),
    hotel: require('../../../../assets/icons/hotel.png'),
    pharmacy: require('../../../../assets/icons/pharmacy.png'),
    gym: require('../../../../assets/icons/gym.png'),
    bank: require('../../../../assets/icons/bank.png'),
    default: require('../../../../assets/icons/marker.png'),
    */
  };


  const imageMap = useMemo(() => {
    const images: Record<string, any> = {};

    // Register Event Images
    events.forEach((event) => {
      if (event.imageKey && event.images?.[0] && event.imageKey !== 'placeholder-event') {
        images[event.imageKey] = { uri: event.images[0] };
      }
    });

    return images;
  }, [events]);


  return <MapLibreGL.Images images={imageMap} />;
};

MapImageManager.displayName = 'MapImageManager';
