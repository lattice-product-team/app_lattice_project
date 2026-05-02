import { Router } from 'express';
import * as geoController from '../controllers/geo.controller';
import savedRoutes from './saved.routes';
import { authenticate } from '@app/core';

const router = Router();

router.get('/health', geoController.healthCheck);
router.get('/events', geoController.getEvents);
router.get('/events/:id', geoController.getEvent);
router.get('/pois', geoController.getPois);
router.get('/pois/categories', geoController.getCategories);
router.get('/pois/:id', geoController.getPoi);
router.get('/locations', geoController.getLocations);
router.get('/navigation/network', geoController.getPathNetwork);
router.post('/navigation/route', geoController.getRoute);

// Saved locations routes - Protected
router.use('/saved', authenticate, savedRoutes);

export default router;
