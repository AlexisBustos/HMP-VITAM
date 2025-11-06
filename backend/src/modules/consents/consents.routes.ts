import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getActiveConsent,
  acceptConsent,
  getMyAcceptances,
  debugConsentStatus,
} from './consents.controller';

const router = Router();

/**
 * GET /api/consents/active
 * Get the active consent template
 * Public endpoint (no auth required)
 */
router.get('/active', getActiveConsent);

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

/**
 * GET /api/consents/debug
 * Debug endpoint to check consent status
 * TEMPORARY - Remove after debugging
 */
router.get('/debug', requireAuth, debugConsentStatus);

export default router;

