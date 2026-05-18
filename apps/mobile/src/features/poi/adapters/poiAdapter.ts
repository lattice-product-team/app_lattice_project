import { POIGeoJSON } from '../../../types';
import { StandardUIPOI } from '../../../types/models/poi';
import { getCategoryMetadata, getStableColor } from '../../../utils/poiUtils';

/***
 * Validates that coordinates are present and not [0,0].
 */
export const isValidCoordinate = (coords?: number[] | null): boolean => {
  if (!coords || coords.length !== 2) return false;
  const [lng, lat] = coords;

  return (lng !== 0 || lat !== 0) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90;
};

/***
 * Adapter to normalize raw GeoJSON data or flat discovery objects into a consistent UI model.
 */
export const normalizePOI = (raw: any): StandardUIPOI => {
  //If it's already a StandardUIPOI, return it (idempotency)
  if (raw?.__normalized) return raw;

  //Polymorphic extraction: Support GeoJSON (properties/geometry) or Flat objects
  const properties = raw?.properties || raw || {};
  const geometry = raw?.geometry || {};

  //Coordinates can be in geometry.coordinates (GeoJSON) or directly in coords/coordinates (Flat)
  const rawCoords =
    geometry.coordinates ||
    raw?.coordinates ||
    raw?.coords ||
    (raw?.longitude !== undefined ? [raw.longitude, raw.latitude] : [0, 0]);

  const coordinates: [number, number] = [rawCoords[0] || 0, rawCoords[1] || 0];

  //Helper to filter out placeholder strings that aren't real URLs
  const isRealUrl = (url: string) =>
    typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:'));

  //Robust image extraction: find any non-empty array of valid images
  let validImages: string[] = [];
  const sources = [
    properties.galleryUrls,
    raw?.galleryUrls,
    properties.images,
    raw?.images,
    raw?.photos,
  ];

  for (const src of sources) {
    if (Array.isArray(src) && src.length > 0) {
      const filtered = src.filter(isRealUrl);
      if (filtered.length > 0) {
        validImages = filtered;
        break;
      }
    }
  }

  const bannerCandidate = properties.bannerUrl || raw?.bannerUrl || validImages[0];
  const bannerUrl = isRealUrl(bannerCandidate) ? bannerCandidate : validImages[0];

  //Robust category detection
  const category = (properties.category || properties.type || 'generic').toLowerCase();
  const metadata = getCategoryMetadata(category);

  return {
    id: String(properties.id || raw?.id || ''),
    displayName: properties.name || properties.label || raw?.displayName || 'Unknown Location',
    category: category,
    categoryLabel: properties.categoryLabel || metadata.label,
    categoryIcon: metadata.icon,
    iconFamily: metadata.iconFamily,
    mainColor: properties.mainColor || metadata.color,
    coordinates,
    parentId: properties.parentId || properties.event_id || properties.eventId,
    description: properties.description || raw?.description,
    images: validImages,
    bannerUrl,
    galleryUrls: validImages,
    rating: properties.metadata?.social?.rating || raw?.rating,
    reviewsCount: properties.metadata?.social?.reviews_count || raw?.reviewsCount,
    raw: properties,
    __normalized: true, //Internal flag to avoid double normalization
  } as any;
};

/***
 * Adapter to normalize LatticeEvent into StandardUIPOI.
 */
export const normalizeEvent = (event: any): StandardUIPOI => {
  if (event?.__normalized) return event;

  const id = String(event.id || '');
  const color = event.color || event.mainColor || getStableColor(id);

  //Robust coordinate extraction for events (Flat or GeoJSON style)
  const coords =
    event.center?.coordinates ||
    event.coordinates ||
    event.coords ||
    (event.longitude !== undefined ? [event.longitude, event.latitude] : [0, 0]);

  return {
    id,
    displayName: event.name || event.displayName || 'Unknown Event',
    category: 'event',
    categoryLabel: 'Event',
    categoryIcon: 'calendar-star',
    iconFamily: 'material' as const,
    mainColor: color,
    coordinates: [coords[0] || 0, coords[1] || 0],
    images: event.images || (event.bannerUrl ? [event.bannerUrl] : []),
    bannerUrl: event.bannerUrl || event.images?.[0],
    galleryUrls: event.galleryUrls || event.images || [],
    imageKey: event.bannerUrl || event.images?.[0] ? `event-img-${id}` : 'placeholder-event',
    raw: event,
    __normalized: true,
  } as any;
};

/***
 * Bulk normalization for lists of POIs.
 */
export const normalizePOIList = (rawList: POIGeoJSON[]): StandardUIPOI[] => {
  return (rawList || []).map(normalizePOI).filter((poi) => isValidCoordinate(poi.coordinates));
};

/***
 * Bulk normalization for lists of Events.
 */
export const normalizeEventList = (events: any[]): StandardUIPOI[] => {
  return (events || []).map(normalizeEvent).filter((poi) => isValidCoordinate(poi.coordinates));
};
