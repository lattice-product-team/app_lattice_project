import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import socialRouter from '../routes/social.routes.js';

const app = express();
app.use(express.json());
app.use(socialRouter);

describe('Social Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('social_service_ok');
    });
  });

  describe('POST /groups', () => {
    it('should return 200 for now (endpoint not implemented)', async () => {
      const response = await request(app).post('/groups').send({ name: 'Lattice Fans' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Groups endpoint not implemented yet');
    });
  });
});
