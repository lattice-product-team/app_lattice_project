import { db, pointsOfInterest, sql, events, eq } from '@app/db';
import { getCache, setCache } from '@app/core';

export const getMarkerMeta = (type: string, name: string) => {
  const t = type?.toLowerCase() || '';
  const meta = {
    icon_name: 'info',
    color_hex: '#5856D6', // Default brand purple
    display_name: name || 'Point of Interest',
  };

  // 1. Icon Mapping (Matches apps/mobile/assets/icons/*.svg)
  if (t.includes('restaurant') || t.includes('food') || t.includes('drink') || t.includes('coffee')) {
    meta.icon_name = 'restaurant';
    meta.color_hex = '#FF9500'; // Gastronomy Orange
  } else if (t.includes('parking')) {
    meta.icon_name = 'parking';
    meta.color_hex = '#007AFF'; // Infrastructure Blue
  } else if (t.includes('wc') || t.includes('toilet') || t.includes('restroom')) {
    meta.icon_name = 'wc';
    meta.color_hex = '#007AFF';
  } else if (t.includes('medical') || t.includes('hospital') || t.includes('emergency')) {
    meta.icon_name = 'medical';
    meta.color_hex = '#FF3B30'; // Safety Red
  } else if (t.includes('gate') || t.includes('entrance') || t.includes('access')) {
    meta.icon_name = 'gate';
    meta.color_hex = '#5856D6';
  } else if (t.includes('info')) {
    meta.icon_name = 'info';
    meta.color_hex = '#5AC8FA'; // Cyan Info
  } else if (t.includes('shop') || t.includes('store')) {
    meta.icon_name = 'info'; // Fallback
    meta.color_hex = '#AF52DE'; // Tech Purple
  }

  return meta;
};

import { socialService } from './social.service.js';

export class PoiService {
  async getPoi(poiId: number) {
    const result = await db
      .select({
        id: pointsOfInterest.id,
        name: pointsOfInterest.name,
        type: pointsOfInterest.type,
        description: pointsOfInterest.description,
        crowdLevel: pointsOfInterest.crowdLevel,
        isWheelchairAccessible: pointsOfInterest.isWheelchairAccessible,
        hasPriorityLane: pointsOfInterest.hasPriorityLane,
        locationName: pointsOfInterest.locationName,
        address: pointsOfInterest.address,
        capacity: pointsOfInterest.capacity,
        currentOccupancy: pointsOfInterest.currentOccupancy,
        status: pointsOfInterest.status,
        bannerUrl: pointsOfInterest.bannerUrl,
        galleryUrls: pointsOfInterest.galleryUrls,
        metadata: pointsOfInterest.metadata,
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.id, poiId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const poi = result[0];
    const meta = getMarkerMeta(poi.type, poi.name);

    // Background sync if social data is missing
    const metadata = poi.metadata ? JSON.parse(poi.metadata as string) : {};
    if (!metadata.social) {
      socialService
        .syncAssetSocialData('poi', poiId)
        .catch((err) => console.error('[Social] Background sync failed:', err));
    }

    return {
      type: 'Feature',
      geometry: JSON.parse(poi.geometry as string),
      properties: {
        id: poi.id,
        name: poi.name,
        category: poi.type,
        description: poi.description,
        crowdLevel: poi.crowdLevel,
        isWheelchairAccessible: poi.isWheelchairAccessible,
        hasPriorityLane: poi.hasPriorityLane,
        locationName: poi.locationName,
        address: poi.address,
        capacity: poi.capacity,
        currentOccupancy: poi.currentOccupancy,
        status: poi.status,
        bannerUrl: poi.bannerUrl,
        galleryUrls: poi.galleryUrls,
        metadata: poi.metadata ? JSON.parse(poi.metadata as string) : null,
        icon_name: meta.icon_name,
        color_hex: meta.color_hex,
        display_name: meta.display_name,
      },
    };
  }

  async getPois(category?: string, eventId?: string) {
    // Cache Key Strategy
    const cacheKey = `geo:pois:cat=${category || 'all'}:evt=${eventId || 'global'}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return { data: JSON.parse(cachedData), cached: true };
    }

    const query = db
      .select({
        id: pointsOfInterest.id,
        name: pointsOfInterest.name,
        type: pointsOfInterest.type,
        description: pointsOfInterest.description,
        crowdLevel: pointsOfInterest.crowdLevel,
        isWheelchairAccessible: pointsOfInterest.isWheelchairAccessible,
        hasPriorityLane: pointsOfInterest.hasPriorityLane,
        locationName: pointsOfInterest.locationName,
        address: pointsOfInterest.address,
        capacity: pointsOfInterest.capacity,
        currentOccupancy: pointsOfInterest.currentOccupancy,
        status: pointsOfInterest.status,
        bannerUrl: pointsOfInterest.bannerUrl,
        galleryUrls: pointsOfInterest.galleryUrls,
        metadata: pointsOfInterest.metadata,
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
        eventId: pointsOfInterest.eventId,
        eventName: events.name,
        eventPrimaryColor: events.primaryColor,
      })
      .from(pointsOfInterest)
      .leftJoin(events, eq(pointsOfInterest.eventId, events.id))
      .$dynamic();

    if (category && typeof category === 'string') {
      query.where(sql`${pointsOfInterest.type}::text = ${category}`);
    }

    if (eventId) {
      const eid = parseInt(eventId as string, 10);
      if (!isNaN(eid)) {
        query.where(eq(pointsOfInterest.eventId, eid));
      }
    }

    const results = await query;

    const features = results.map((poi: any) => {
      const meta = getMarkerMeta(poi.type, poi.name);
      return {
        type: 'Feature',
        geometry: JSON.parse(poi.geometry as string),
        properties: {
          id: poi.id,
          name: poi.name,
          category: poi.type,
          description: poi.description,
          crowdLevel: poi.crowdLevel,
          isWheelchairAccessible: poi.isWheelchairAccessible,
          hasPriorityLane: poi.hasPriorityLane,
          locationName: poi.locationName,
          address: poi.address,
          capacity: poi.capacity,
          currentOccupancy: poi.currentOccupancy,
          status: poi.status,
          metadata: poi.metadata ? JSON.parse(poi.metadata as string) : null,
          bannerUrl: poi.bannerUrl,
          galleryUrls: poi.galleryUrls,
          eventId: poi.eventId,
          eventName: poi.eventName,
          eventColor: poi.eventPrimaryColor,
          // GPU Optimization Properties
          icon_name: meta.icon_name,
          color_hex: meta.color_hex,
          display_name: meta.display_name,
        },
      };
    });

    const responseData = {
      type: 'FeatureCollection',
      features,
    };

    setCache(cacheKey, JSON.stringify(responseData)).catch(() => {});

    return { data: responseData, cached: false };
  }
}

export const poiService = new PoiService();
