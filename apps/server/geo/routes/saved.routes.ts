import { Router } from 'express';
import * as savedController from '../controllers/saved.controller.js';

const router = Router();

router.get('/', savedController.getSavedLocations);
router.post('/', savedController.createSavedLocation);
router.delete('/:id', savedController.deleteSavedLocation);

export default router;
