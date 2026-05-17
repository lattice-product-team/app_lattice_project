import { Router } from 'express';
import * as geoController from '../controllers/geo.controller.js';
import savedRoutes from './saved.routes.js';
import { authenticate } from '@app/core';

const router = Router();

router.get('/health', geoController.healthCheck);
router.get('/discovery', geoController.getDiscoveryFeed);
router.get('/stats', geoController.getGlobalStats);
router.get('/events/:id/spatial', geoController.getEventSpatial);
router.post('/events/:id/spatial', geoController.saveEventSpatial);
router.get('/events', geoController.getEvents);
router.post('/events', geoController.createEvent);
router.get('/events/:id', geoController.getEvent);
router.patch('/events/:id', geoController.updateEvent);
router.delete('/events/:id', geoController.deleteEvent);
router.get('/events/:id/stats', geoController.getEventStats);
router.get('/pois', geoController.getPois);
router.post('/pois', geoController.createPoi);
router.get('/pois/categories', geoController.getCategories);
router.get('/pois/:id', geoController.getPoi);
router.patch('/pois/:id', geoController.updatePoi);
router.delete('/pois/:id', geoController.deletePoi);
router.get('/locations', geoController.getLocations);
router.get('/geo/locations', geoController.getLocations);
router.get('/navigation/network', geoController.getPathNetwork);
router.post('/navigation/route', geoController.getRoute);
router.post('/navigation/valhalla-route', geoController.getValhallaProxyRoute);
router.get('/resolve-address', geoController.resolveAddress);
router.post('/social/sync', geoController.syncSocialData);

// Saved locations routes - Protected
router.use('/saved', authenticate, savedRoutes);

export default router;
