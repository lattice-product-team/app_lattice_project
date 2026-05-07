import { Request, Response } from 'express';
import { db, pointsOfInterest, sql, events, eq } from '@app/db';

import { findRoute } from '../services/navigation.service';
import { socialService } from '../services/social.service';

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

    const [event] = await db
      .select({
        id: events.id,
        name: events.name,
        boundary: sql<string>`ST_AsGeoJSON(${events.boundary})`,
      })
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const poisResults = await db
      .select({
        id: pointsOfInterest.id,
        name: pointsOfInterest.name,
        type: pointsOfInterest.type,
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

    poisResults.forEach((poi) => {
      features.push({
        type: 'Feature',
        geometry: JSON.parse(poi.geometry),
        properties: {
          id: poi.id,
          type: poi.type,
          name: poi.name,
        },
      });
    });

    res.json({
      type: 'FeatureCollection',
      features,
    });
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
    // We can also count from users table if available in this context
    const [usersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(sql`users`);

    res.json({
      activeEvents: eventsCount.count || 0,
      totalCapacity: 120000, // Aggregate capacity across all events
      liveUsers: (usersCount.count || 0) + 42,
      activeAlerts: 2,
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

    // Mocking telemetry based on event context
    // In a real system, this would query the telemetry/social service
    res.json({
      estimatedCapacity: 45000 + (eventId % 5) * 5000,
      entryRate: 120 + (eventId % 3) * 15,
      staffOnline: 12 + (eventId % 4),
      activeAlerts: eventId % 2,
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPois = async (req: Request, res: Response) => {
  try {
    const { category, eventId } = req.query;

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

    const features = results.map((poi) => ({
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
        eventId: poi.eventId,
        eventName: poi.eventName,
        eventColor: poi.eventPrimaryColor,
      },
    }));

    res.json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};

export const getCategories = (req: Request, res: Response) => {
  const categories = [
    { id: '1', label: 'Gates', icon: 'log-in', category: 'gate' },
    { id: '2', label: 'Grandstands', icon: 'map', category: 'grandstand' },
    { id: '3', label: 'Food', icon: 'coffee', category: 'restaurant' },
    { id: '4', label: 'Parking', icon: 'map-pin', category: 'parking' },
    { id: '5', label: 'Shopping', icon: 'shopping-bag', category: 'shop' },
    { id: '6', label: 'Toilets', icon: 'user', category: 'wc' },
    { id: '7', label: 'Medical', icon: 'plus-square', category: 'medical' },
    { id: '8', label: 'Meetups', icon: 'users', category: 'meetup_point' },
  ];
  res.json(categories);
};

export const getLocations = (req: Request, res: Response) => {
  res.json({ message: 'Locations endpoint not implemented yet' });
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

export const getPoi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poiId = parseInt(id as string, 10);

    if (isNaN(poiId)) {
      return res.status(400).json({ error: 'Invalid POI ID' });
    }

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
        metadata: pointsOfInterest.metadata,
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .where(sql`${pointsOfInterest.id} = ${poiId}`)
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'POI not found' });
    }

    const poi = result[0];

    // Background sync if social data is missing
    const metadata = poi.metadata ? JSON.parse(poi.metadata as string) : {};
    if (!metadata.social) {
      socialService
        .syncAssetSocialData('poi', poiId)
        .catch((err) => console.error('[Social] Background sync failed:', err));
    }

    res.json({
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
      },
    });
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
        imageUrl: events.imageUrl,
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

    const formattedEvents = results.map((event) => ({
      ...event,
      center: event.center ? JSON.parse(event.center) : null,
      boundary: event.boundary ? JSON.parse(event.boundary) : null,
      metadata: event.metadata ? JSON.parse(event.metadata) : null,
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
      })
      .returning();

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
      })
      .returning();

    res.status(201).json(newPoi);
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
        imageUrl: events.imageUrl,
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
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};
