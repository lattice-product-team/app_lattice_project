import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import geoRouter from '../routes/geo.routes.js';
import * as dbLib from '@app/db';

const app = express();
app.use(express.json());
app.use(geoRouter);

// Mock the entire DB library with a chainable mock
vi.mock('@app/db', async () => {
  const actual = (await vi.importActual('@app/db')) as any;
  const mockQuery = {
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    $dynamic: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation((onSuccess) => Promise.resolve([]).then(onSuccess)),
  };

  return {
    ...actual,
    db: {
      select: vi.fn().mockReturnValue(mockQuery),
      execute: vi.fn().mockResolvedValue({ rows: [] }),
    },
  };
});

describe('Geo Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('geo_service_ok');
    });
  });

  describe('GET /pois/categories', () => {
    it('should return a list of categories', async () => {
      const response = await request(app).get('/pois/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('category');
    });
  });

  describe('GET /pois', () => {
    it('should return a FeatureCollection of POIs', async () => {
      // Mock the dynamic query
      const mockResults = [
        {
          id: 1,
          name: 'Main Gate',
          type: 'gate',
          description: 'Primary entrance',
          crowdLevel: 'low',
          isWheelchairAccessible: true,
          hasPriorityLane: false,
          geometry: JSON.stringify({ type: 'Point', coordinates: [2.1, 41.3] }),
        },
      ];

      const mockDynamic = vi.fn().mockResolvedValue(mockResults);
      const mockFrom = vi.fn().mockReturnValue({
        $dynamic: vi.fn().mockReturnValue({ where: mockDynamic, ...mockDynamic }),
      });

      // Setup chainable mock for this specific test
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        $dynamic: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((resolve) => resolve(mockResults)),
      };
      (dbLib.db.select as any).mockReturnValue(mockChain);

      const response = await request(app).get('/pois');
      expect(response.status).toBe(200);
      expect(response.body.type).toBe('FeatureCollection');
      expect(response.body.features.length).toBe(1);
      expect(response.body.features[0].properties.name).toBe('Main Gate');
    });
  });
});
