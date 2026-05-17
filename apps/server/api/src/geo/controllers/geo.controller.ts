import { Request, Response } from 'express';
import 'dotenv/config';
import { db, pointsOfInterest, sql, events, eq, telemetryLogs } from '@app/db';

import { findRoute } from '../services/navigation.service.js';
import { valhallaService } from '../services/valhalla.service.js';
import { socialService } from '../services/social.service.js';
import { discoveryService } from '../services/discovery.service.js';
import { notifyAdmin, notifyAll, getCache, setCache, deleteCache, deleteByPrefix } from '@app/core';
import { poiService, getMarkerMeta } from '../services/poi.service.js';
import { eventService } from '../services/event.service.js';

/**
 * Resolves coordinates to a human-readable address using Nominatim.
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'Lattice-Admin-Dashboard/1.0',
        },
      }
    );
    const data: any = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  } catch (error) {
    console.error('[Geocoding] Error resolving address:', error);
    return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  }
}

export const resolveAddress = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    const address = await reverseGeocode(parseFloat(lat as string), parseFloat(lng as string));
    res.json({ address });
  } catch (error) {
    console.error('Error resolving address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const syncSocialData = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.body;
    if (!type || !id) {
      return res.status(400).json({ error: 'Type (event/poi) and ID are required' });
    }
    const result = await socialService.syncAssetSocialData(
      type as 'event' | 'poi',
      parseInt(id as string, 10)
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error syncing social data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'geo_service_ok', timestamp: new Date() });
};

export const getEventSpatial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    const result = await eventService.getEventSpatial(eventId);

    if (!result) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (result.cached) {
      res.header('X-Cache', 'HIT');
    } else {
      res.header('X-Cache', 'MISS');
    }

    res.json(result.data);
  } catch (error) {
    console.error('Error fetching event spatial data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const saveEventSpatial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id as string, 10);
    const { boundary, pois } = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    const result = await eventService.saveEventSpatial(eventId, boundary, pois);

    res.json({ success: true, message: 'Event spatial data saved successfully' });
  } catch (error) {
    console.error('Error saving event spatial data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const [eventsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(sql`end_date > now()`);

    const [activeUsers] = await db
      .select({ count: sql<number>`count(DISTINCT user_id)::int` })
      .from(telemetryLogs)
      .where(sql`timestamp > now() - interval '5 minutes'`);

    const [capacityResult] = await db
      .select({ total: sql<number>`coalesce(sum(capacity), 0)::int` })
      .from(pointsOfInterest)
      .innerJoin(events, eq(pointsOfInterest.eventId, events.id))
      .where(sql`end_date > now()`);

    const [alertsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pointsOfInterest)
      .where(sql`(status = 'closed' OR crowd_level = 'blocked') AND event_id IS NOT NULL`);

    res.json({
      activeEvents: eventsCount.count || 0,
      totalCapacity: capacityResult.total || 0,
      liveUsers: activeUsers.count || 0,
      activeAlerts: alertsCount.count || 0,
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    const [capacityResult] = await db
      .select({ total: sql<number>`coalesce(sum(capacity), 0)::int` })
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.eventId, eventId));

    const { rows: entryRows } = await db.execute(sql`
        SELECT count(*)::int as count
        FROM telemetry_logs
        WHERE event_id = ${Number(eventId)}
        AND timestamp > NOW() - INTERVAL '2 minutes'
      `);
    const entryCount = entryRows[0];

    const [staffCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pointsOfInterest)
      .where(sql`event_id = ${eventId} AND type IN ('security', 'medical') AND status = 'open'`);

    const [alertsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pointsOfInterest)
      .where(sql`event_id = ${eventId} AND (status = 'closed' OR crowd_level = 'blocked')`);

    res.json({
      estimatedCapacity: capacityResult?.total || 0,
      entryRate: Math.round(((entryCount as any)?.count || 0) / 10),
      staffOnline: staffCount?.count || 0,
      activeAlerts: alertsCount?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPois = async (req: Request, res: Response) => {
  try {
    const { category, eventId } = req.query;

    const { data, cached } = await poiService.getPois(
      category as string | undefined,
      eventId as string | undefined
    );

    if (cached) {
      res.header('X-Cache', 'HIT');
    } else {
      res.header('X-Cache', 'MISS');
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getCategories = (req: Request, res: Response) => {
  const categories = [
    { id: '1', label: 'Access Points', icon: 'log-in', category: 'gate' },
    { id: '2', label: 'Grandstands', icon: 'map', category: 'grandstand' },
    { id: '3', label: 'Gastronomy', icon: 'coffee', category: 'restaurant' },
    { id: '4', label: 'Parking', icon: 'map-pin', category: 'parking' },
    { id: '5', label: 'Official Store', icon: 'shopping-bag', category: 'shop' },
    { id: '6', label: 'Restrooms', icon: 'user', category: 'wc' },
    { id: '7', label: 'Medical', icon: 'plus-square', category: 'medical' },
    { id: '8', label: 'Meetup Points', icon: 'users', category: 'meetup_point' },
  ];
  res.json(categories);
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;

    // We filter by last 15 minutes to keep it "live"
    const query = db
      .select({
        id: telemetryLogs.id,
        geometry: sql<string>`ST_AsGeoJSON(${telemetryLogs.location})`,
      })
      .from(telemetryLogs)
      .where(sql`timestamp > now() - interval '2 minutes'`)
      .$dynamic();

    if (eventId) {
      const eid = parseInt(eventId as string, 10);
      if (!isNaN(eid)) {
        query.where(eq(telemetryLogs.eventId, eid));
      }
    }

    const results = await query;

    const features = results.map((log: any) => ({
      type: 'Feature',
      geometry: JSON.parse(log.geometry),
      properties: {
        id: log.id,
        mag: 1, // Constant magnitude for heatmap weight
      },
    }));

    res.json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching telemetry locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRoute = async (req: Request, res: Response) => {
  try {
    const { origin, destination, avoidStairs, wheelchairAccess, eventId } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const route = await findRoute(origin, destination, { avoidStairs, wheelchairAccess, eventId });
    res.json(route);
  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getValhallaProxyRoute = async (req: Request, res: Response) => {
  try {
    const { origin, destination, mode, avoidStairs } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const route = await valhallaService.getRoute({
      origin,
      destination,
      mode: mode || 'walking',
      avoidStairs: !!avoidStairs,
    });
    
    res.json(route);
  } catch (error) {
    console.error('[GeoController] Valhalla Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch external route', 
      details: String(error) 
    });
  }
};

export const getPoi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poiId = parseInt(id as string, 10);

    if (isNaN(poiId)) {
      return res.status(400).json({ error: 'Invalid POI ID' });
    }

    const poi = await poiService.getPoi(poiId);

    if (!poi) {
      return res.status(404).json({ error: 'POI not found' });
    }

    res.json(poi);
  } catch (error) {
    console.error('Error fetching POI:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getPathNetwork = async (req: Request, res: Response) => {
  try {
    // This query selects all path segments and converts them to GeoJSON LineStrings
    // based on the source and target node locations
    const result = await db.execute(sql`
      SELECT 
        ps.source_node_id,
        ps.target_node_id,
        ps.distance,
        ps.surface,
        ps.has_stairs,
        ST_AsGeoJSON(
          ST_MakeLine(s.location, t.location)
        ) as geometry
      FROM path_segments ps
      JOIN nodes s ON ps.source_node_id = s.id
      JOIN nodes t ON ps.target_node_id = t.id
      ${req.query.eventId ? sql`WHERE s.event_id = ${parseInt(req.query.eventId as string, 10)}` : sql``}
    `);

    const features = result.rows.map((row: any) => ({
      type: 'Feature',
      geometry: JSON.parse(row.geometry),
      properties: {
        sourceNodeId: row.source_node_id,
        targetNodeId: row.target_node_id,
        distance: row.distance,
        surface: row.surface,
        hasStairs: row.has_stairs,
      },
    }));

    res.json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching path network:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const results = await db
      .select({
        id: events.id,
        name: events.name,
        type: events.type,
        locationName: events.locationName,
        address: events.address,
        bannerUrl: events.bannerUrl,
        galleryUrls: events.galleryUrls,
        startDate: events.startDate,
        endDate: events.endDate,
        isPermanent: events.isPermanent,
        primaryColor: events.primaryColor,
        metadata: events.metadata,
        center: sql<string>`ST_AsGeoJSON(${events.location})`,
        boundary: sql<string>`ST_AsGeoJSON(${events.boundary})`,
      })
      .from(events)
      .orderBy(events.startDate);

    const formattedEvents = results.map((event: any) => ({
      ...event,
      center: event.center ? JSON.parse(event.center) : null,
      boundary: event.boundary ? JSON.parse(event.boundary) : null,
      metadata: event.metadata ? JSON.parse(event.metadata) : null,
      // GPU Optimization Properties
      icon_name: 'event', // Standard event icon
      color_hex: event.primaryColor || '#5856D6',
      display_name: event.name,
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      type,
      startDate,
      endDate,
      locationName,
      address,
      boundary,
      primaryColor,
      isPermanent,
      center,
      bannerUrl,
      galleryUrls,
    } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, startDate and endDate are required' });
    }

    const [newEvent] = await db
      .insert(events)
      .values({
        name,
        description,
        type: type || 'generic',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        locationName,
        address,
        primaryColor,
        isPermanent: isPermanent ?? false,
        location: center
          ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(center)}), 4326)`
          : boundary
            ? sql`ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(boundary)}), 4326))`
            : null,
        boundary: boundary
          ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(boundary)}), 4326)`
          : null,
        bannerUrl,
        galleryUrls,
      })
      .returning();

    // Invalidate Cache (All POIs might need refresh if new event contains them)
    await deleteByPrefix('geo:pois:');

    // Notify Admins & Clients
    notifyAdmin('admin:events:new', { type: 'EVENT_CREATED', id: newEvent.id.toString() });
    notifyAll('sync:events', { action: 'created', id: newEvent.id });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const createPoi = async (req: Request, res: Response) => {
  try {
    const {
      eventId,
      name,
      description,
      type,
      geometry,
      locationName,
      address,
      capacity,
      isWheelchairAccessible,
      hasPriorityLane,
      bannerUrl,
      galleryUrls,
    } = req.body;

    if (!name || !type || !geometry) {
      return res.status(400).json({ error: 'Name, type and geometry are required' });
    }

    const parsedEventId = eventId ? parseInt(eventId as string, 10) : null;

    // Optional Spatial Validation: Ensure POI is within event boundary
    if (parsedEventId) {
      try {
        const result = await db.execute(sql`
          SELECT ST_Contains(
            boundary,
            ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326)
          ) as is_valid
          FROM events 
          WHERE id = ${parsedEventId} AND boundary IS NOT NULL
        `);

        const rows = (result as any).rows || result;
        if (rows && rows.length > 0) {
          const isValid = rows[0].is_valid;
          if (!isValid) {
            console.warn(`[Geo] POI "${name}" is outside the boundary of event ${parsedEventId}`);
          }
        }
      } catch (validationErr) {
        console.warn(`[Geo] Spatial validation query failed:`, validationErr);
      }
    }

    const [newPoi] = await db
      .insert(pointsOfInterest)
      .values({
        eventId: parsedEventId,
        name,
        description,
        type: type as any,
        locationName,
        address,
        capacity: capacity ? parseInt(capacity as string, 10) : null,
        currentOccupancy: 0,
        status: 'open',
        isWheelchairAccessible: isWheelchairAccessible ?? true,
        hasPriorityLane: hasPriorityLane ?? false,
        location: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326)`,
        bannerUrl,
        galleryUrls,
      })
      .returning();

    // Invalidate Cache
    await deleteByPrefix('geo:pois:');
    if (parsedEventId) {
      await deleteCache(`geo:event:${parsedEventId}:spatial`);
    }

    res.status(201).json(newPoi);

    // Notify Admins & Clients
    console.log(`[Geo] Notifying sync for new POI: ${newPoi.id}`);
    notifyAdmin('admin:pois:updated', { type: 'POI_CREATED', id: newPoi.id.toString() });
    notifyAll('sync:pois', { action: 'created', id: newPoi.id, eventId: parsedEventId });
    if (parsedEventId) {
      notifyAll('sync:event:spatial', { id: parsedEventId.toString() });
    }
  } catch (error) {
    console.error('Error creating POI:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    const result = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        type: events.type,
        locationName: events.locationName,
        address: events.address,
        bannerUrl: events.bannerUrl,
        galleryUrls: events.galleryUrls,
        startDate: events.startDate,
        endDate: events.endDate,
        isPermanent: events.isPermanent,
        primaryColor: events.primaryColor,
        metadata: events.metadata,
        center: sql<string>`ST_AsGeoJSON(${events.location})`,
        boundary: sql<string>`ST_AsGeoJSON(${events.boundary})`,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = result[0];

    // Background sync if social data is missing
    const metadata = event.metadata ? JSON.parse(event.metadata as string) : {};
    if (!metadata.social) {
      socialService
        .syncAssetSocialData('event', eventId)
        .catch((err) => console.error('[Social] Background sync failed:', err));
    }

    res.json({
      ...event,
      center: event.center ? JSON.parse(event.center) : null,
      boundary: event.boundary ? JSON.parse(event.boundary) : null,
      metadata: event.metadata ? JSON.parse(event.metadata) : null,
      // GPU Optimization Properties
      icon_name: 'event',
      color_hex: event.primaryColor || '#5856D6',
      display_name: event.name,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getDiscoveryFeed = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;
    const feed = await discoveryService.getDiscoveryFeed(
      lat ? parseFloat(lat as string) : undefined,
      lng ? parseFloat(lng as string) : undefined
    );
    res.json(feed);
  } catch (error) {
    console.error('Error fetching discovery feed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const updatePoi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poiId = parseInt(id as string, 10);
    const {
      eventId,
      name,
      description,
      type,
      geometry,
      locationName,
      address,
      capacity,
      isWheelchairAccessible,
      hasPriorityLane,
      status,
      bannerUrl,
      galleryUrls,
    } = req.body;

    if (isNaN(poiId)) {
      return res.status(400).json({ error: 'Invalid POI ID' });
    }

    const [existingPoi] = await db
      .select()
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.id, poiId));

    if (!existingPoi) {
      return res.status(404).json({ error: 'POI not found' });
    }

    const parsedEventId = eventId ? parseInt(eventId as string, 10) : existingPoi.eventId;

    // Optional Spatial Validation
    if (geometry && parsedEventId) {
      try {
        const result = await db.execute(sql`
          SELECT ST_Contains(
            boundary,
            ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326)
          ) as is_valid
          FROM events 
          WHERE id = ${parsedEventId} AND boundary IS NOT NULL
        `);
        const rows = (result as any).rows || result;
        if (rows && rows.length > 0 && !rows[0].is_valid) {
          console.warn(
            `[Geo] Updated POI "${name || existingPoi.name}" is outside the boundary of event ${parsedEventId}`
          );
        }
      } catch (err) {
        console.warn(`[Geo] Spatial validation query failed during update:`, err);
      }
    }

    const [updatedPoi] = await db
      .update(pointsOfInterest)
      .set({
        eventId: parsedEventId,
        name: name ?? existingPoi.name,
        description: description ?? existingPoi.description,
        type: (type ?? existingPoi.type) as any,
        locationName: locationName ?? existingPoi.locationName,
        address: address ?? existingPoi.address,
        capacity: capacity !== undefined ? parseInt(capacity as string, 10) : existingPoi.capacity,
        status: status ?? existingPoi.status,
        isWheelchairAccessible: isWheelchairAccessible ?? existingPoi.isWheelchairAccessible,
        hasPriorityLane: hasPriorityLane ?? existingPoi.hasPriorityLane,
        location: geometry
          ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326)`
          : undefined,
        bannerUrl: bannerUrl ?? existingPoi.bannerUrl,
        galleryUrls: galleryUrls ?? existingPoi.galleryUrls,
      })
      .where(eq(pointsOfInterest.id, poiId))
      .returning();

    // Invalidate Cache
    await deleteByPrefix('geo:pois:');
    if (parsedEventId) {
      await deleteCache(`geo:event:${parsedEventId}:spatial`);
    }
    if (existingPoi.eventId && existingPoi.eventId !== parsedEventId) {
      await deleteCache(`geo:event:${existingPoi.eventId}:spatial`);
    }

    // Notify Admins & Clients
    notifyAdmin('admin:pois:updated', { type: 'POI_UPDATED', id: poiId.toString() });
    notifyAll('sync:pois', { action: 'updated', id: poiId, eventId: parsedEventId });
    if (parsedEventId) {
      notifyAll('sync:event:spatial', { id: parsedEventId.toString() });
    }
    if (existingPoi.eventId && existingPoi.eventId !== parsedEventId) {
      notifyAll('sync:event:spatial', { id: existingPoi.eventId.toString() });
    }

    res.json(updatedPoi);
  } catch (error) {
    console.error('Error updating POI:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id as string, 10);
    const {
      name,
      description,
      type,
      startDate,
      endDate,
      locationName,
      address,
      boundary,
      primaryColor,
      isPermanent,
      center,
      bannerUrl,
      galleryUrls,
    } = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    const [existingEvent] = await db.select().from(events).where(eq(events.id, eventId));

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        name: name ?? existingEvent.name,
        description: description ?? existingEvent.description,
        type: type ?? existingEvent.type,
        startDate: startDate ? new Date(startDate) : existingEvent.startDate,
        endDate: endDate ? new Date(endDate) : existingEvent.endDate,
        locationName: locationName ?? existingEvent.locationName,
        address: address ?? existingEvent.address,
        primaryColor: primaryColor ?? existingEvent.primaryColor,
        isPermanent: isPermanent ?? existingEvent.isPermanent,
        location: center
          ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(center)}), 4326)`
          : boundary
            ? sql`ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(boundary)}), 4326))`
            : undefined,
        boundary: boundary
          ? sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(boundary)}), 4326)`
          : undefined,
        bannerUrl: bannerUrl ?? existingEvent.bannerUrl,
        galleryUrls: galleryUrls ?? existingEvent.galleryUrls,
      })
      .where(eq(events.id, eventId))
      .returning();

    // Invalidate Caches
    await deleteByPrefix('geo:pois:');
    await deleteCache(`geo:event:${eventId}:spatial`);

    // Notify Admins & Clients
    notifyAdmin('admin:events:updated', { type: 'EVENT_UPDATED', id: eventId.toString() });
    notifyAll('sync:events', { action: 'updated', id: eventId });
    notifyAll('sync:event:spatial', { id: eventId.toString() });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const deletePoi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poiId = parseInt(id as string, 10);

    if (isNaN(poiId)) {
      return res.status(400).json({ error: 'Invalid POI ID' });
    }

    const [poi] = await db.select().from(pointsOfInterest).where(eq(pointsOfInterest.id, poiId));
    if (!poi) return res.status(404).json({ error: 'POI not found' });

    await db.delete(pointsOfInterest).where(eq(pointsOfInterest.id, poiId));

    // Invalidate Cache
    await deleteByPrefix('geo:pois:');
    if (poi.eventId) {
      await deleteCache(`geo:event:${poi.eventId}:spatial`);
    }

    // Notify Admins & Clients
    notifyAdmin('admin:pois:updated', { type: 'POI_DELETED', id: poiId.toString() });
    notifyAll('sync:pois', { action: 'deleted', id: poiId, eventId: poi.eventId });
    if (poi.eventId) {
      notifyAll('sync:event:spatial', { id: poi.eventId.toString() });
    }

    res.json({ success: true, message: 'POI deleted successfully' });
  } catch (error) {
    console.error('Error deleting POI:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    await db.delete(events).where(eq(events.id, eventId));

    // Invalidate Caches
    await deleteByPrefix('geo:pois:');
    await deleteCache(`geo:event:${eventId}:spatial`);

    // Notify Admins & Clients
    notifyAdmin('admin:events:updated', { type: 'EVENT_DELETED', id: eventId.toString() });
    notifyAll('sync:events', { action: 'deleted', id: eventId });

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};
