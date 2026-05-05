import { useDerivedValue, SharedValue } from 'react-native-reanimated';

/**
 * Hook to project geographic coordinates [lng, lat] into screen pixels [x, y]
 * using the current map camera state.
 */
export const useMapProjection = (
  lng: number,
  lat: number,
  cameraCenter: SharedValue<number[]>, // [lng, lat]
  cameraZoom: SharedValue<number>,
  mapDimensions: { width: number; height: number }
) => {
  const { width, height } = mapDimensions;
  
  // TILE_SIZE is a standard for Mercator projection (MapLibre/Google/Leaflet)
  const TILE_SIZE = 256;

  return useDerivedValue(() => {
    const zoom = cameraZoom.value;
    const centerLng = cameraCenter.value[0];
    const centerLat = cameraCenter.value[1];

    // Helper functions for Mercator projection
    const getX = (l: number, z: number) => {
      return ((l + 180) / 360) * TILE_SIZE * Math.pow(2, z);
    };

    const getY = (la: number, z: number) => {
      const latRad = (la * Math.PI) / 180;
      return (
        (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) *
        (TILE_SIZE / 2) *
        Math.pow(2, z)
      );
    };

    // Calculate world coordinates for the point and the center
    const worldX = getX(lng, zoom);
    const worldY = getY(lat, zoom);
    const centerWorldX = getX(centerLng, zoom);
    const centerWorldY = getY(centerLat, zoom);

    // Final screen coordinates
    // We add width/2 and height/2 because the world coordinates are relative to the top-left
    // but our map center is in the middle of the screen.
    const screenX = worldX - centerWorldX + width / 2;
    const screenY = worldY - centerWorldY + height / 2;

    return { x: screenX, y: screenY };
  }, [lng, lat, width, height]);
};
