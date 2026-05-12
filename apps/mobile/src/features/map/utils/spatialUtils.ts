/**
 * Utility for managing spatial relationships between map markers.
 * Includes spiderfication (offsetting overlapping points) and distance-based filtering.
 */

export interface SpiderfiedFeature {
  feature: any;
  angle: number;
  clusterCount: number;
  isSpiderfied: boolean;
}

/**
 * Assigns a spiderfication angle and cluster count to overlapping features.
 * 
 * @param features GeoJSON feature array
 * @param zoom Current map zoom level
 * @param thresholdZoom Zoom level at which spiderfication activates
 */
export const applySpiderfication = (
  features: any[],
  zoom: number,
  thresholdZoom: number = 17
): SpiderfiedFeature[] => {
  if (!features || features.length === 0) return [];
  
  // 1. Group features by their coordinates
  const groups: Record<string, any[]> = {};
  
  features.forEach(feature => {
    const coords = feature.geometry.coordinates;
    if (!coords || coords.length !== 2) return;
    
    // Key based on 5 decimal places (~1.1 meters)
    const key = `${coords[0].toFixed(5)},${coords[1].toFixed(5)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(feature);
  });

  const result: SpiderfiedFeature[] = [];

  // 2. Assign angles for each group
  Object.values(groups).forEach(group => {
    const count = group.length;
    
    // If zoom is low or there's only one item, no spiderfication
    if (count === 1 || zoom < thresholdZoom) {
      group.forEach(feature => {
        result.push({
          feature,
          angle: 0,
          clusterCount: 1,
          isSpiderfied: false
        });
      });
      return;
    }

    // Sort to ensure stable ordering (e.g. Events first if mixed)
    const sortedGroup = [...group].sort((a, b) => {
      const isAEvent = a.properties.category === 'event' || !!a.properties.imageKey;
      const isBEvent = b.properties.category === 'event' || !!b.properties.imageKey;
      if (isAEvent && !isBEvent) return -1;
      if (!isAEvent && isBEvent) return 1;
      return 0;
    });

    sortedGroup.forEach((feature, index) => {
      const angle = (index / count) * 2 * Math.PI;
      result.push({
        feature,
        angle,
        clusterCount: count,
        isSpiderfied: true
      });
    });
  });

  return result;
};
