import express from 'express';
import cors from 'cors';
import { logger, errorHandler } from '@app/core';
import geoRoutes from './routes/geo.routes';
import telemetryRoutes from './routes/telemetry.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/pois', geoRoutes);
app.use('/locations', geoRoutes);
app.use('/navigation', geoRoutes);
app.use('/telemetry', telemetryRoutes);
app.use(geoRoutes);

app.use(errorHandler);

export default app;
