import { Platform } from 'react-native';

/**
 * safeMapLibre.ts
 * 
 * Provides a safe wrapper for @maplibre/maplibre-react-native 
 * to avoid "Object prototype" errors during SSR/Node bundling in Expo.
 */

let MapLibreGL: any;

if (Platform.OS !== 'web') {
  try {
    MapLibreGL = require('@maplibre/maplibre-react-native').default;
  } catch (e) {
    console.warn('MapLibreGL native module not found, falling back to mock');
    MapLibreGL = createMock();
  }
} else {
  MapLibreGL = createMock();
}

function createMock() {
  return {
    MapView: () => null,
    Camera: () => null,
    UserLocation: () => null,
    ShapeSource: () => null,
    LineLayer: () => null,
    CircleLayer: () => null,
    SymbolLayer: () => null,
    offlineManager: {
      createPack: () => {},
      deletePack: () => {},
    },
    setAccessToken: () => {},
    setConnected: () => {},
  };
}

export default MapLibreGL;
