import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth, auditLog } from '../middleware/auth.middleware';

const router = Router();

/**
 * Public routes (no authentication required)
 */
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

/**
 * Semi-public routes (refresh token in cookie)
 */
router.post('/refresh', authController.refresh.bind(authController));

/**
 * Protected routes (authentication required)
 */
router.post(
  '/logout',
  requireAuth,
  auditLog('LOGOUT'),
  authController.logout.bind(authController)
);

router.post(
  '/change-password',
  requireAuth,
  auditLog('CHANGE_PASSWORD'),
  authController.changePassword.bind(authController)
);

router.get(
  '/me',
  requireAuth,
  authController.getCurrentUser.bind(authController)
);

router.get(
  '/sessions',
  requireAuth,
  authController.getSessions.bind(authController)
);

router.delete(
  '/sessions/:sessionId',
  requireAuth,
  auditLog('REVOKE_SESSION'),
  authController.revokeSession.bind(authController)
);

router.delete(
  '/sessions',
  requireAuth,
  auditLog('REVOKE_ALL_SESSIONS'),
  authController.revokeAllSessions.bind(authController)
);

export default router;

