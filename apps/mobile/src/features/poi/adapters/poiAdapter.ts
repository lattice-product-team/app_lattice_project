import { POIGeoJSON } from '../../../types';
import { StandardUIPOI } from '../../../types/models/poi';
import { getCategoryMetadata, getStableColor } from '../../../utils/poiUtils';

/**
 * Validates that coordinates are present and not [0,0].
 */
export const isValidCoordinate = (coords?: number[] | null): boolean => {
  if (!coords || coords.length !== 2) return false;
  const [lng, lat] = coords;
  // Basic [0,0] check and range check
  return (lng !== 0 || lat !== 0) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90;
};

/**
 * Adapter to normalize raw GeoJSON data into a consistent UI model.
 */
export const normalizePOI = (raw: any): StandardUIPOI => {
  const properties = raw?.properties || {};
  const geometry = raw?.geometry || { coordinates: [0, 0] };
  
  // Robust category detection: check category, then type, then default
  const category = (properties.category || properties.type || 'generic').toLowerCase();
  const metadata = getCategoryMetadata(category);

  return {
    id: String(properties.id || ''),
    displayName: properties.name || properties.label || 'Unknown Location',
    category: category,
    categoryLabel: metadata.label,
    categoryIcon: metadata.icon,
    iconFamily: metadata.iconFamily,
    mainColor: metadata.color,
    coordinates: [geometry.coordinates?.[0] || 0, geometry.coordinates?.[1] || 0],
    parentId: properties.parentId || properties.event_id || properties.eventId,
    description: properties.description,
    images: properties.images,
    bannerUrl: properties.bannerUrl,
    galleryUrls: properties.galleryUrls,
    rating: properties.metadata?.social?.rating,
    reviewsCount: properties.metadata?.social?.reviews_count,
    raw: properties,
  };
};

/**
 * Adapter to normalize LatticeEvent into StandardUIPOI.
 */
export const normalizeEvent = (event: any): StandardUIPOI => {
  const id = String(event.id);
  const color = event.color || getStableColor(id);
  
  return {
    id,
    displayName: event.name,
    category: 'event',
    categoryLabel: 'Evento',
    categoryIcon: 'calendar-star',
    iconFamily: 'material' as const,
    mainColor: color,
    coordinates: [event.center?.coordinates[0] || 0, event.center?.coordinates[1] || 0],
    images: event.bannerUrl ? [event.bannerUrl] : [],
    bannerUrl: event.bannerUrl,
    galleryUrls: event.galleryUrls || [],
    imageKey: event.bannerUrl ? `event-img-${id}` : 'placeholder-event',
    raw: event,
  };
};

/**
 * Bulk normalization for lists of POIs.
 */
export const normalizePOIList = (rawList: POIGeoJSON[]): StandardUIPOI[] => {
  return (rawList || []).map(normalizePOI).filter((poi) => isValidCoordinate(poi.coordinates));
};

/**
 * Bulk normalization for lists of Events.
 */
export const normalizeEventList = (events: any[]): StandardUIPOI[] => {
  return (events || []).map(normalizeEvent).filter((poi) => isValidCoordinate(poi.coordinates));
};
