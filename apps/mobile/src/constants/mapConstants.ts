import Constants from 'expo-constants';

export const EMPTY_GEOJSON: any = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [0, 0],
        ],
      },
      properties: {},
    },
  ],
};

export const MAP_CENTER: [number, number] = [2.1734, 41.3851]; // Barcelona default fallback
export const DEFAULT_ZOOM = 17;
export const SELECTION_ZOOM = 17;
export const FLY_ANIMATION_DURATION = 1000;
export const SELECT_ANIMATION_DURATION = 350;

export const MAPTILER_KEY = Constants.expoConfig?.extra?.mapTilerKey || 'iqk4irD5FCOr6M6VHVWZ';
