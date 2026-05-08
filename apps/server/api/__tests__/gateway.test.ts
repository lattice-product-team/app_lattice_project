import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Gateway Service', () => {
  it('should return 200 OK for health check', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'gateway_ok');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  describe('Security Hardening', () => {
    it('should include Helmet security headers', async () => {
      const response = await request(app).get('/status');
      expect(response.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('content-security-policy');
    });

    it('should permit requests from allowed origins', async () => {
      const response = await request(app).get('/status').set('Origin', 'http://localhost:3004');
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3004');
    });

    it('should block requests from unauthorized origins', async () => {
      // We force NODE_ENV to production to test the restriction
      // Or we just accept that in 'test' env it's also restricted if not in allowedOrigins
      const response = await request(app).get('/status').set('Origin', 'http://evil.com');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Not allowed by CORS');
    });
  });
});
