import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { logger, errorHandler, loadConfig } from '@app/core';

// Import Service Routers locally for the Monolith
import authRouter from './auth/routes/auth.routes.js';
import geoRouter from './geo/routes/geo.routes.js';
import socialRouter from './social/routes/social.routes.js';
import telemetryRouter from './geo/routes/telemetry.routes.js';

// Load validated config (SSOT)
const env = loadConfig();

export const app = express();

/**
 * Professional Proxy Configuration
 * Required for rate-limiting and secure IP identification when behind NGINX
 */
app.set('trust proxy', 1);

// --- SECURITY MIDDLEWARE ---

// 1. Helmet for security headers
app.use(helmet());

// 2. Restricted CORS
const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }) as unknown as express.RequestHandler
);

// 3. Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Rate Limiting for Auth
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'development' ? 1000 : 100, // Be more lenient in dev for polling
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts, please try again later',
    code: 'TOO_MANY_REQUESTS',
  },
  skip: () => env.NODE_ENV === 'test',
});

app.use(logger);

// Log incoming requests for debugging
app.use((req: Request, _res: Response, next: express.NextFunction) => {
  if (env.NODE_ENV !== 'test') {
    console.log(`[API Monolith] Incoming: ${req.method} ${req.originalUrl} -> ${req.path}`);
  }
  next();
});

// Root Health Checks (Outside any prefix)
const healthHandler = (req: Request, res: Response) => {
  res.json({
    status: 'api_ok',
    timestamp: new Date(),
    env: env.NODE_ENV,
    service: 'lattice_api',
    path: req.originalUrl,
  });
};

// --- API ROUTING ---
// Health checks and Root
app.get('/status', healthHandler);
app.get('/health', healthHandler);
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Lattice API Monolith',
    version: '1.0.0',
    documentation: 'See README for endpoint details',
    health: '/health',
    status: 'running',
    timestamp: new Date(),
  });
});

// Apply rate limiter to auth routes
app.use(
  ['/auth/login', '/auth/register', '/auth/google', '/auth/apple', '/auth/passkey*'],
  authRateLimiter
);

// Mount Service Routers
app.use('/auth', authRouter);
app.use(geoRouter);
app.use(socialRouter);
app.use('/telemetry', telemetryRouter);

// Fallback for unhandled API routes
app.use('*', (req: Request, res: Response) => {
  const diagnostic = {
    error: 'Route not found at API Monolith level',
    requestedUrl: req.originalUrl,
    method: req.method,
    path: req.path,
    protocol: req.protocol,
    headers: req.headers,
  };

  if (env.NODE_ENV !== 'test') {
    console.log(`[API Monolith] 404 Fallback reached for: ${req.method} ${req.originalUrl}`);
  }

  res.status(404).json(diagnostic);
});

app.use(errorHandler);

export default app;
