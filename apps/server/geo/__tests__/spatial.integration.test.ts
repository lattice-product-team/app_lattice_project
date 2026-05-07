import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as dbLib from '@app/db';

// Mock the DB library
vi.mock('@app/db', async () => {
  const actual = (await vi.importActual('@app/db')) as any;
  return {
    ...actual,
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('Geo Service Spatial Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /events/:id/spatial', () => {
    it('should return a FeatureCollection with boundary and POIs', async () => {
      const mockEvent = {
        id: 1,
        name: 'Test Event',
        boundary: JSON.stringify({
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        }),
      };

      const mockPois = [
        {
          id: 10,
          name: 'Bar 1',
          type: 'bar',
          geometry: JSON.stringify({ type: 'Point', coordinates: [0.5, 0.5] }),
        },
      ];

      (dbLib.db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockResolvedValueOnce([mockEvent]),
        }),
      });

      (dbLib.db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockResolvedValueOnce(mockPois),
        }),
      });

      const response = await request(app).get('/events/1/spatial');
      expect(response.status).toBe(200);
      expect(response.body.type).toBe('FeatureCollection');
      expect(response.body.features).toHaveLength(2);
      expect(response.body.features[0].properties.type).toBe('boundary');
      expect(response.body.features[1].properties.type).toBe('bar');
    });

    it('should return 404 if event not found', async () => {
      (dbLib.db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockResolvedValueOnce([]),
        }),
      });

      const response = await request(app).get('/events/999/spatial');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /events/:id/spatial', () => {
    it('should save spatial data and return success', async () => {
      (dbLib.db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({}),
        }),
      });

      (dbLib.db.delete as any).mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      });

      (dbLib.db.insert as any).mockReturnValue({
        values: vi.fn().mockResolvedValue({}),
      });

      const payload = {
        boundary: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
        pois: [
          { name: 'New Bar', type: 'bar', geometry: { type: 'Point', coordinates: [0.6, 0.6] } },
        ],
      };

      const response = await request(app).post('/events/1/spatial').send(payload);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
