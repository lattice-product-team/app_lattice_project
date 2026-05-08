import { Router } from 'express';
import * as socialController from '../controllers/social.controller';
const router = Router();
router.get('/health', socialController.healthCheck);
router.post('/groups', socialController.createGroup);
export default router;
