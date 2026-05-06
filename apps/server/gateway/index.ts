import express, { Request, Response } from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger, errorHandler, loadConfig } from '@app/core';

// Load validated config (SSOT)
const env = loadConfig();
const PORT = env.GATEWAY_PORT;

export const app = express();
const router = express.Router();

// Networking Configuration (Using validated config)
const AUTH_SERVICE_URL = `http://${env.AUTH_HOST}:${env.AUTH_PORT}`;
const GEO_SERVICE_URL = `http://${env.GEO_HOST}:${env.GEO_PORT}`;
const SOCIAL_SERVICE_URL = `http://${env.SOCIAL_HOST}:${env.SOCIAL_PORT}`;

app.use(cors());
app.use(logger);

// Log incoming requests for debugging
app.use((req, _res, next) => {
  if (env.NODE_ENV !== 'test') {
    console.log(`[Gateway] Incoming: ${req.method} ${req.url}`);
  }
  next();
});

// Health Checks
const healthHandler = (req: Request, res: Response) => {
  res.json({ 
    status: 'gateway_ok', 
    timestamp: new Date(), 
    env: env.NODE_ENV, 
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
  const filter = (path: string) => {
    const isMatched = paths.some((p) => path.startsWith(p) || path.startsWith(`${API_PREFIX}${p}`));
    return isMatched;
  };

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathFilter: filter,
    pathRewrite: (path: string) => {
      let newPath = path;
      if (path.startsWith(API_PREFIX)) {
        newPath = path.substring(API_PREFIX.length);
      }
      return newPath || '/';
    },
    on: {
      error: (err: any, req: any, res: any) => {
        const errorMsg = err.message || 'Unknown proxy error';
        if (env.NODE_ENV !== 'test') {
          console.error(`[Gateway -> ${label}] Proxy Error:`, {
            message: errorMsg,
            code: err.code,
            url: req.originalUrl,
            target
          });
        }
        if (res && res.writeHead) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: {
                message: `${label} service unreachable`,
                code: 'SERVICE_UNREACHABLE',
                details: errorMsg,
              },
            })
          );
        }
      },
      proxyReq: (proxyReq: any, req: any) => {
        if (env.NODE_ENV !== 'test') {
          console.log(`[Gateway -> ${label}] Proxying: ${req.method} ${req.originalUrl} -> ${target}${proxyReq.path}`);
        }
      },
      proxyRes: (proxyRes: any, req: any) => {
        if (env.NODE_ENV !== 'test') {
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
    '/events',
    '/venues',
    '/stats',
    '/resolve-address',
    '/social',
  ])
);
router.use(createServiceProxy(SOCIAL_SERVICE_URL, 'Social', ['/groups', '/telemetry']));

// Fallback for unhandled API routes
router.use('*', (req: Request, res: Response) => {
  if (env.NODE_ENV !== 'test') {
    console.log(`[Gateway] 404 Fallback reached for: ${req.method} ${req.originalUrl}`);
  }
  res.status(404).json({
    error: 'Route not found at Gateway level',
    requestedUrl: req.originalUrl,
  });
});

app.use('/', router);
app.use(errorHandler);

if (env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gateway] running on port ${PORT}`);
  });
}

export default app;
