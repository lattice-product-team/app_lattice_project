import { Request, Response } from 'express';
import { db, savedLocations, sql } from '@app/db';
import { eq, and } from 'drizzle-orm';

const getUserIdFromAuth = (req: Request): number => {
  const authHeader = req.get('authorization');
  if (!authHeader) return 1; // Fallback for safety in development
  const userIdStr = authHeader.replace('Bearer mock_jwt_token_for_', '');
  return parseInt(userIdStr, 10);
};

export const getSavedLocations = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromAuth(req);

    const results = await db
      .select({
        id: savedLocations.id,
        label: savedLocations.label,
        createdAt: savedLocations.createdAt,
        geometry: sql<string>`ST_AsGeoJSON(${savedLocations.location})`,
      })
      .from(savedLocations)
      .where(eq(savedLocations.userId, userId));

    const features = results.map((loc: any) => ({
      type: 'Feature',
      geometry: JSON.parse(loc.geometry),
      properties: {
        id: loc.id,
        label: loc.label,
        createdAt: loc.createdAt,
      },
    }));

    res.json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createSavedLocation = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromAuth(req);
    const { label, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const result = await db
      .insert(savedLocations)
      .values({
        userId,
        label: label || 'Saved Location',
        location: sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating saved location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteSavedLocation = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromAuth(req);
    const { id } = req.params;
    const savedId = parseInt(id as string, 10);

    if (isNaN(savedId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await db
      .delete(savedLocations)
      .where(and(eq(savedLocations.id, savedId), eq(savedLocations.userId, userId)));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting saved location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
