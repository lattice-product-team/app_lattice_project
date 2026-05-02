import { Request, Response } from 'express';
import { db, pointsOfInterest, sql, events, eq } from '@app/db';

import { findRoute } from '../services/navigation.service';

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'geo_service_ok', timestamp: new Date() });
};

export const getPois = async (req: Request, res: Response) => {
  try {
    const { category, eventId } = req.query;

    let query = db
      .select({
        id: pointsOfInterest.id,
        name: pointsOfInterest.name,
        type: pointsOfInterest.type,
        description: pointsOfInterest.description,
        crowdLevel: pointsOfInterest.crowdLevel,
        isWheelchairAccessible: pointsOfInterest.isWheelchairAccessible,
        hasPriorityLane: pointsOfInterest.hasPriorityLane,
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .$dynamic();

    if (category && typeof category === 'string') {
      query = query.where(sql`${pointsOfInterest.type}::text = ${category}`);
    }

    if (eventId) {
      const eid = parseInt(eventId as string, 10);
      if (!isNaN(eid)) {
        query = query.where(eq(pointsOfInterest.eventId, eid));
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
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .where(sql`${pointsOfInterest.id} = ${poiId}`)
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'POI not found' });
    }

    const poi = result[0];
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
        imageUrl: events.imageUrl,
        startDate: events.startDate,
        endDate: events.endDate,
        metadata: events.metadata,
        center: sql<string>`ST_AsGeoJSON(${events.location})`,
        boundary: sql<string>`ST_AsGeoJSON(${events.boundary})`,
      })
      .from(events);

    const formattedEvents = results.map(event => ({
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
        imageUrl: events.imageUrl,
        startDate: events.startDate,
        endDate: events.endDate,
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
