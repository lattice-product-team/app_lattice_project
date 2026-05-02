import { POIGeoJSON } from '../../../types';
import { StandardUIPOI } from '../../../types/models/poi';
import { getCategoryMetadata } from '../../../utils/poiUtils';

/**
 * Adapter to normalize raw GeoJSON data into a consistent UI model.
 */
export const normalizePOI = (raw: POIGeoJSON): StandardUIPOI => {
  const { properties, geometry } = raw;
  const metadata = getCategoryMetadata(properties.category);

  return {
    id: String(properties.id || ''),
    displayName: properties.name || properties.label || 'Unknown Location',
    category: properties.category || 'generic',
    categoryLabel: metadata.label,
    categoryIcon: metadata.icon,
    mainColor: metadata.color,
    coordinates: [geometry.coordinates[0], geometry.coordinates[1]],
    parentId: properties.parentId,
    description: properties.description,
    images: properties.images,
    raw: properties, // Preserve original properties
  };
};

/**
 * Bulk normalization for lists of POIs.
 */
export const normalizePOIList = (rawList: POIGeoJSON[]): StandardUIPOI[] => {
  return rawList.map(normalizePOI);
};
