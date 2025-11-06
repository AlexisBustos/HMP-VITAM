import { Router } from 'express';
import { SurveysController } from './surveys.controller';
import { requireAuth, requireRole, requireOwnership, requirePersonWithPatient } from '../../middleware/auth.middleware';

const router = Router();
const controller = new SurveysController();

// ============================================
// Survey Templates Routes
// ============================================

/**
 * GET /api/surveys/templates
 * Get all survey templates
 * Access: SUPER_ADMIN, CLINICAL_ADMIN (all), PERSON (active only)
 */
router.get(
  '/templates',
  requireAuth,
  controller.getTemplates.bind(controller)
);

/**
 * GET /api/surveys/templates/:id
 * Get a single survey template by ID
 * Access: SUPER_ADMIN, CLINICAL_ADMIN, PERSON
 */
router.get(
  '/templates/:id',
  requireAuth,
  controller.getTemplateById.bind(controller)
);

/**
 * POST /api/surveys/templates
 * Create a new survey template
 * Access: SUPER_ADMIN only
 */
router.post(
  '/templates',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  controller.createTemplate.bind(controller)
);

/**
 * PUT /api/surveys/templates/:id
 * Update a survey template
 * Access: SUPER_ADMIN only
 */
router.put(
  '/templates/:id',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  controller.updateTemplate.bind(controller)
);

/**
 * DELETE /api/surveys/templates/:id
 * Delete a survey template
 * Access: SUPER_ADMIN only
 */
router.delete(
  '/templates/:id',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  controller.deleteTemplate.bind(controller)
);

// ============================================
// Survey Responses Routes
// ============================================

/**
 * POST /api/surveys/responses
 * Create a survey response
 * Access: PERSON with patient record only
 */
router.post(
  '/responses',
  requireAuth,
  requirePersonWithPatient,
  controller.createResponse.bind(controller)
);

/**
 * GET /api/surveys/responses/mine
 * Get all responses for the authenticated user
 * Access: PERSON only
 */
router.get(
  '/responses/mine',
  requireAuth,
  requireRole('PERSON'),
  controller.getMyResponses.bind(controller)
);

/**
 * GET /api/surveys/responses/patient/:patientId
 * Get all responses for a specific patient
 * Access: SUPER_ADMIN, CLINICAL_ADMIN, or owner (PERSON with matching patientId)
 */
router.get(
  '/responses/patient/:patientId',
  requireAuth,
  requireOwnership(
    async (req) => req.params.patientId,
    ['SUPER_ADMIN', 'CLINICAL_ADMIN']
  ),
  controller.getPatientResponses.bind(controller)
);

/**
 * GET /api/surveys/responses/:id
 * Get a single response by ID
 * Access: SUPER_ADMIN, CLINICAL_ADMIN, or owner
 */
router.get(
  '/responses/:id',
  requireAuth,
  requireOwnership(
    async (req) => {
      // We need to fetch the response to get its patientId
      // This is a bit inefficient but ensures security
      const { SurveysService } = await import('./surveys.service');
      const service = new SurveysService();
      const response = await service.getResponseById(req.params.id);
      return response.patientId;
    },
    ['SUPER_ADMIN', 'CLINICAL_ADMIN']
  ),
  controller.getResponseById.bind(controller)
);

export default router;

