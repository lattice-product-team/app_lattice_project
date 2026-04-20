import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from '@app/core';

// Load environment variables from root if not already set (e.g. in CI/CD)
dotenv.config({ path: path.join(process.cwd(), '../../../.env') });

export const app = express();
const PORT = process.env.GATEWAY_PORT || process.env.PORT || 3000;
const basePath = process.env.BASE_PATH || '/';
const router = express.Router();

// Networking Configuration (Dynamic Hosts)
const AUTH_HOST = process.env.AUTH_HOST || 'localhost';
const AUTH_PORT = process.env.AUTH_PORT || '3001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || `http://${AUTH_HOST}:${AUTH_PORT}`;

const GEO_HOST = process.env.GEO_HOST || 'localhost';
const GEO_PORT = process.env.GEO_PORT || '3002';
const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || `http://${GEO_HOST}:${GEO_PORT}`;

const SOCIAL_HOST = process.env.SOCIAL_HOST || 'localhost';
const SOCIAL_PORT = process.env.SOCIAL_PORT || '3003';
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL || `http://${SOCIAL_HOST}:${SOCIAL_PORT}`;

app.use(cors());
app.use(logger);

// Log incoming requests for debugging
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[Gateway] Incoming: ${req.method} ${req.url}`);
  }
  next();
});

// Health Checks
const healthHandler = (req: Request, res: Response) => {
  res.json({ 
    status: 'gateway_ok', 
    timestamp: new Date(), 
    env: process.env.NODE_ENV, 
    basePath,
    service: 'lattice_gateway'
  });
};

router.get('/status', healthHandler);
router.get('/health', healthHandler);
router.get('/api/v1/status', healthHandler);
router.get('/api/v1/health', healthHandler);

// --- API ROUTING ---
const API_PREFIX = '/api/v1';

// Helper to create proxy with robust path rewrite and logging
const createServiceProxy = (target: string, label: string, paths: string[]) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathFilter: (path: string) => {
      return paths.some((p) => path.startsWith(p) || path.startsWith(`${API_PREFIX}${p}`));
    },
    pathRewrite: (path: string) => {
      let newPath = path;
      if (path.startsWith(API_PREFIX)) {
        newPath = path.substring(API_PREFIX.length);
      }
      return newPath || '/';
    },
    on: {
      error: (err: any, req: any, res: any) => {
        if (process.env.NODE_ENV !== 'test') {
          console.error(`[Gateway -> ${label}] Error:`, err.message);
        }
        if (res && res.writeHead) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `${label} service unreachable`, details: err.message }));
        }
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        if (process.env.NODE_ENV !== 'test') {
          if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
            console.warn(
              `[Gateway -> ${label}] Error Response: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`
            );
          } else {
            console.log(
              `[Gateway -> ${label}] Success: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`
            );
          }
        }
      },
    },
  });
};

// Mount Service Proxies
router.use(createServiceProxy(AUTH_SERVICE_URL, 'Auth', ['/auth', '/users']));
router.use(
  createServiceProxy(GEO_SERVICE_URL, 'Geo', [
    '/pois',
    '/locations',
    '/navigation',
    '/map',
    '/saved',
  ])
);
router.use(createServiceProxy(SOCIAL_SERVICE_URL, 'Social', ['/groups', '/telemetry']));

// Fallback for unhandled API routes
router.use('*', (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[Gateway] 404 Fallback reached for: ${req.method} ${req.originalUrl}`);
  }
  res.status(404).json({
    error: 'Route not found at Gateway level',
    requestedUrl: req.originalUrl,
    routerPath: req.url,
    basePath,
  });
});

if (basePath && basePath !== '/') {
  app.use(basePath, router);
  app.use('*', (req: Request, res: Response) =>
    res.status(404).json({ error: 'Route not found at Global level. Missing /lattice prefix?' })
  );
} else {
  app.use('/', router);
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Gateway] running on port ${PORT}`);
  });
}

export default app;
