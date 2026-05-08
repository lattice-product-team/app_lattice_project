import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { logger, errorHandler, loadConfig } from '@app/core';
// Import Service Routers directly for the Monolith
import authRouter from '../auth/routes/auth.routes';
import geoRouter from '../geo/routes/geo.routes';
import socialRouter from '../social/routes/social.routes';
// Load validated config (SSOT)
const env = loadConfig();
export const app = express();
/**
 * Professional Proxy Configuration
 * Required for rate-limiting and secure IP identification when behind NGINX
 */
app.set('trust proxy', 1);
const router = express.Router();
// --- SECURITY MIDDLEWARE ---
// 1. Helmet for security headers
app.use(helmet());
// 2. Restricted CORS
const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// 3. Rate Limiting for Auth
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
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
app.use((req, _res, next) => {
    if (env.NODE_ENV !== 'test') {
        console.log(`[API Monolith] Incoming: ${req.method} ${req.url}`);
    }
    next();
});
// Health Checks
const healthHandler = (req, res) => {
    res.json({
        status: 'api_ok',
        timestamp: new Date(),
        env: env.NODE_ENV,
        service: 'lattice_api',
    });
};
router.get('/status', healthHandler);
router.get('/health', healthHandler);
router.get('/v1/status', healthHandler);
router.get('/v1/health', healthHandler);
// --- API ROUTING ---
// Direct Router Mounting (No Proxy overhead)
router.use(authRateLimiter);
router.use('/auth', authRouter);
router.use('/users', authRouter);
router.use('/geo', geoRouter);
router.use('/pois', geoRouter);
router.use('/locations', geoRouter);
router.use('/navigation', geoRouter);
router.use('/map', geoRouter);
router.use('/saved', geoRouter);
router.use('/events', geoRouter);
router.use('/stats', geoRouter);
router.use('/resolve-address', geoRouter);
router.use('/social', geoRouter);
router.use('/groups', socialRouter);
router.use('/telemetry', socialRouter);
// Fallback for unhandled API routes
router.use('*', (req, res) => {
    if (env.NODE_ENV !== 'test') {
        console.log(`[API Monolith] 404 Fallback reached for: ${req.method} ${req.originalUrl}`);
    }
    res.status(404).json({
        error: 'Route not found at API Monolith level',
        requestedUrl: req.originalUrl,
    });
});
const baseMountPath = env.API_BASE_PATH || '/';
app.use(baseMountPath, router);
app.use(errorHandler);
export default app;
