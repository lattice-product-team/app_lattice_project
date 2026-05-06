import { Router } from 'express';
import * as geoController from '../controllers/geo.controller';
import savedRoutes from './saved.routes';
import { authenticate } from '@app/core';

const router = Router();

router.get('/health', geoController.healthCheck);
router.get('/stats', geoController.getGlobalStats);
router.get('/events/:id/spatial', geoController.getEventSpatial);
router.post('/events/:id/spatial', geoController.saveEventSpatial);
router.get('/events', geoController.getEvents);
router.get('/events/:id', geoController.getEvent);
router.get('/events/:id/stats', geoController.getEventStats);
router.get('/pois', geoController.getPois);
router.get('/pois/categories', geoController.getCategories);
router.get('/pois/:id', geoController.getPoi);
router.get('/locations', geoController.getLocations);
router.get('/navigation/network', geoController.getPathNetwork);
router.post('/navigation/route', geoController.getRoute);
router.get('/resolve-address', geoController.resolveAddress);
router.post('/social/sync', geoController.syncSocialData);

// Saved locations routes - Protected
router.use('/saved', authenticate, savedRoutes);

export default router;
