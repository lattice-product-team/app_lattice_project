import { Router } from 'express';
import { db, telemetryLogs, sql } from '@app/db';

const router = Router();

/**
 * @route POST /telemetry/ping
 * @desc Receive a user location ping for crowd analytics
 * @access Private (Would normally check JWT, but keeping simple for MVP)
 */
router.post('/ping', async (req, res) => {
  const { userId, eventId, latitude, longitude } = req.body;

  try {
    if (!userId || !eventId || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert as PostGIS point
    // We check if the user exists to avoid foreign key violations during testing
    let validUserId = userId;
    if (userId) {
      const userExists = await db.execute(
        sql`SELECT id FROM users WHERE id = ${Number(userId)} LIMIT 1`
      );
      if (userExists.rows.length === 0) {
        console.warn(`[Telemetry] User ${userId} not found, saving ping without userId`);
        validUserId = null;
      }
    }

    await db.insert(telemetryLogs).values({
      userId: validUserId ? Number(validUserId) : null,
      eventId: Number(eventId),
      location: sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
    });

    res.status(201).json({ status: 'ok' });
  } catch (err) {
    console.error('Error saving telemetry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /telemetry/heatmap/:eventId
 * @desc Get all telemetry for an event formatted for MapLibre Heatmap
 */
router.get('/heatmap/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const logs = await db.execute(sql`
      SELECT ST_AsGeoJSON(location)::json as geometry, id
      FROM telemetry_logs
      WHERE event_id = ${Number(eventId)}
      AND timestamp > NOW() - INTERVAL '2 minutes'
    `);

    const geojson = {
      type: 'FeatureCollection',
      features: logs.rows.map((row: any) => ({
        type: 'Feature',
        properties: { id: row.id },
        geometry: row.geometry,
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error('Error fetching heatmap:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
