import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '@app/core';
const router = Router();
// Public routes
router.get('/health', authController.healthCheck);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/apple', authController.appleLogin);
router.post('/ticket-sync', authController.ticketSync);
router.get('/event-config/:eventId', authController.getEventConfig);
// Protected routes
router.post('/passkey/register-challenge', authenticate, authController.registerPasskeyChallenge);
router.post('/passkey/register-verify', authenticate, authController.registerPasskeyVerify);
router.get('/passkey/login-challenge', authController.loginPasskeyChallenge);
router.post('/passkey/login-verify', authController.loginPasskeyVerify);
router.post('/ticket/claim', authenticate, authController.claimTicket);
router.post('/ticket/unclaim', authenticate, authController.unclaimTicket);
router.get('/tickets', authenticate, authController.getTickets);
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, authController.updateMe);
export default router;
