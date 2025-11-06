import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getActiveConsent,
  acceptConsent,
  getMyAcceptances,
} from './consents.controller';

const router = Router();

/**
 * GET /api/consents/active
 * Get the active consent template
 * Public endpoint (but requires auth to prevent abuse)
 */
router.get('/active', requireAuth, getActiveConsent);

/**
 * POST /api/consents/accept
 * Accept a consent template
 * Requires authentication
 */
router.post('/accept', requireAuth, acceptConsent);

/**
 * GET /api/consents/acceptances/mine
 * Get current user's consent acceptances
 * Requires authentication
 */
router.get('/acceptances/mine', requireAuth, getMyAcceptances);

export default router;

