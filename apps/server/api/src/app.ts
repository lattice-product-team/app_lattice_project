import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { logger, errorHandler, loadConfig } from '@app/core';

// Import Service Routers locally for the Monolith
import authRouter from './auth/routes/auth.routes.js';
import geoRouter from './geo/routes/geo.routes.js';
import socialRouter from './social/routes/social.routes.js';

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
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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
    path: req.originalUrl
  });
};

app.get('/status', healthHandler);
app.get('/health', healthHandler);

// --- API ROUTING (v1) ---
const v1Router = express.Router();

// 4. Rate Limiting Scoping
// Only apply strict auth limits to actual auth routes to avoid blocking polling (e.g. /events)
v1Router.use(['/login', '/register', '/google', '/apple', '/passkey*'], authRateLimiter);

/**
 * MOUNTING SERVICES
 * Note: authRouter needs an explicit '/auth' prefix because its routes 
 * are defined relative to root (e.g., /login, /register).
 * Geo and Social routers are mounted at root to support /events, /pois, etc.
 */
// Health checks also available under v1
v1Router.get('/status', healthHandler);
v1Router.get('/health', healthHandler);

v1Router.use('/auth', authRouter);
v1Router.use(geoRouter);
v1Router.use(socialRouter);

// --- API ROUTING ---
// Mount the main router at the root level to simplify external proxying.
// The browser will use https://domain.com/lattice/api/auth/login
// and Nginx will proxy to http://api:3000/auth/login
app.use('/', v1Router);

// Fallback for unhandled API routes
app.use('*', (req: Request, res: Response) => {
  if (env.NODE_ENV !== 'test') {
    console.log(`[API Monolith] 404 Fallback reached for: ${req.method} ${req.originalUrl}`);
  }
  res.status(404).json({
    error: 'Route not found at API Monolith level',
    requestedUrl: req.originalUrl,
  });
});

app.use(errorHandler);

export default app;
