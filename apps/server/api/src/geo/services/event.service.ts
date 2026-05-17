import { db, events, pointsOfInterest, sql, eq } from '@app/db';
import { getCache, setCache, deleteCache, deleteByPrefix, notifyAdmin, notifyAll } from '@app/core';
import { getMarkerMeta } from './poi.service.js';

export class EventService {
  async getEventSpatial(eventId: number) {
    const cacheKey = `geo:event:${eventId}:spatial`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return { data: JSON.parse(cachedData), cached: true };
    }

    const [event] = await db
      .select({
        id: events.id,
        name: events.name,
        boundary: sql<string>`ST_AsGeoJSON(${events.boundary})`,
      })
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return null;
    }

    const poisResults = await db
      .select({
        id: pointsOfInterest.id,
        name: pointsOfInterest.name,
        type: pointsOfInterest.type,
        bannerUrl: pointsOfInterest.bannerUrl,
        galleryUrls: pointsOfInterest.galleryUrls,
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.eventId, eventId));

    const features: any[] = [];

    if (event.boundary) {
      features.push({
        type: 'Feature',
        geometry: JSON.parse(event.boundary),
        properties: {
          type: 'boundary',
          name: event.name,
        },
      });
    }

    poisResults.forEach((poi: any) => {
      const meta = getMarkerMeta(poi.type, poi.name);
      features.push({
        type: 'Feature',
        geometry: JSON.parse(poi.geometry),
        properties: {
          id: poi.id,
          type: poi.type,
          name: poi.name,
          bannerUrl: poi.bannerUrl,
          galleryUrls: poi.galleryUrls,
          icon_name: meta.icon_name,
          color_hex: meta.color_hex,
          display_name: meta.display_name,
        },
      });
    });

    const responseData = {
      type: 'FeatureCollection',
      features,
    };

    setCache(cacheKey, JSON.stringify(responseData)).catch(() => {});

    return { data: responseData, cached: false };
  }

  async saveEventSpatial(eventId: number, boundary: any, pois: any[]) {
    // 1. Update boundary
    if (boundary) {
      await db
        .update(events)
        .set({
          boundary: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(boundary)}), 4326)`,
        })
        .where(eq(events.id, eventId));
    }

    // 2. Sync POIs
    await db.delete(pointsOfInterest).where(eq(pointsOfInterest.eventId, eventId));

    if (pois && Array.isArray(pois)) {
      for (const poi of pois) {
        await db.insert(pointsOfInterest).values({
          eventId,
          name: poi.name,
          type: poi.type,
          description: poi.description,
          locationName: poi.locationName,
          address: poi.address,
          capacity: poi.capacity,
          currentOccupancy: poi.currentOccupancy,
          status: poi.status || 'open',
          metadata: poi.metadata ? JSON.stringify(poi.metadata) : null,
          location: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(poi.geometry)}), 4326)`,
        });
      }
    }

    // Invalidate Cache
    await deleteByPrefix('geo:pois:');
    await deleteCache(`geo:event:${eventId}:spatial`);

    // Notify Admins & Clients
    notifyAdmin('admin:pois:updated', { type: 'EVENT_SPATIAL_UPDATED', id: eventId.toString() });
    notifyAll('sync:event:spatial', { id: eventId.toString() });

    return { success: true };
  }
}

export const eventService = new EventService();
