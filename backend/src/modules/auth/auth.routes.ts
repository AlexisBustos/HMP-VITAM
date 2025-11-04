import { Router } from 'express';
import * as authController from './auth.controller';
import { requireAuth, auditLog } from '../common/auth.middleware';

const router = Router();

/**
 * Public routes (no authentication required)
 */
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

/**
 * Semi-public routes (refresh token in cookie)
 */
router.post('/refresh', authController.refresh);

/**
 * Protected routes (authentication required)
 */
router.post(
  '/logout',
  requireAuth,
  auditLog('LOGOUT'),
  authController.logout
);

router.post(
  '/change-password',
  requireAuth,
  auditLog('CHANGE_PASSWORD'),
  authController.changePassword
);

router.get(
  '/me',
  requireAuth,
  authController.getCurrentUser
);

router.get(
  '/sessions',
  requireAuth,
  authController.getSessions
);

router.delete(
  '/sessions/:sessionId',
  requireAuth,
  auditLog('REVOKE_SESSION'),
  authController.revokeSession
);

router.delete(
  '/sessions',
  requireAuth,
  auditLog('REVOKE_ALL_SESSIONS'),
  authController.revokeAllSessions
);

export default router;

