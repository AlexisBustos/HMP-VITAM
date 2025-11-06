import { Request, Response } from 'express';
import { SurveysService } from './surveys.service';
import { 
  CreateSurveyResponseDto, 
  CreateSurveyTemplateDto, 
  UpdateSurveyTemplateDto,
  GetSurveyTemplatesQueryDto 
} from './surveys.dto';
import { AuthRequest } from '../../middleware/auth.middleware';

const surveysService = new SurveysService();

export class SurveysController {
  /**
   * GET /api/surveys/templates
   * Get all survey templates (optionally filter by active status)
   */
  async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      // Validate query params
      const queryResult = GetSurveyTemplatesQueryDto.safeParse(req.query);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: queryResult.error.errors,
        });
        return;
      }

      const { active } = queryResult.data;
      const activeOnly = active === 'true' ? true : active === 'false' ? false : undefined;

      const templates = await surveysService.getTemplates(activeOnly);

      res.status(200).json({
        success: true,
        data: templates,
      });
    } catch (error) {
      console.error('Error getting survey templates:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get survey templates',
      });
    }
  }

  /**
   * GET /api/surveys/templates/:id
   * Get a single survey template by ID
   */
  async getTemplateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = await surveysService.getTemplateById(id);

      res.status(200).json({
        success: true,
        data: template,
      });
    } catch (error) {
      console.error('Error getting survey template:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get survey template',
      });
    }
  }

  /**
   * POST /api/surveys/templates
   * Create a new survey template (ADMIN only)
   */
  async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = CreateSurveyTemplateDto.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error.errors,
        });
        return;
      }

      const template = await surveysService.createTemplate(validationResult.data);

      res.status(201).json({
        success: true,
        data: template,
        message: 'Survey template created successfully',
      });
    } catch (error) {
      console.error('Error creating survey template:', error);
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create survey template',
      });
    }
  }

  /**
   * PUT /api/surveys/templates/:id
   * Update a survey template (ADMIN only)
   */
  async updateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate request body
      const validationResult = UpdateSurveyTemplateDto.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error.errors,
        });
        return;
      }

      const template = await surveysService.updateTemplate(id, validationResult.data);

      res.status(200).json({
        success: true,
        data: template,
        message: 'Survey template updated successfully',
      });
    } catch (error) {
      console.error('Error updating survey template:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update survey template',
      });
    }
  }

  /**
   * DELETE /api/surveys/templates/:id
   * Delete a survey template (ADMIN only)
   */
  async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await surveysService.deleteTemplate(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('Error deleting survey template:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete survey template',
      });
    }
  }

  /**
   * POST /api/surveys/responses
   * Create a survey response (PERSON only)
   */
  async createResponse(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.patientId) {
        res.status(403).json({
          success: false,
          message: 'No patient record associated with your account',
        });
        return;
      }

      // Validate request body
      const validationResult = CreateSurveyResponseDto.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error.errors,
        });
        return;
      }

      const response = await surveysService.createResponse(
        req.user.userId,
        req.user.patientId,
        validationResult.data
      );

      res.status(201).json({
        success: true,
        data: response,
        message: 'Survey response submitted successfully',
      });
    } catch (error) {
      console.error('Error creating survey response:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit survey response',
      });
    }
  }

  /**
   * GET /api/surveys/responses/mine
   * Get all responses for the authenticated user (PERSON)
   */
  async getMyResponses(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const responses = await surveysService.getMyResponses(req.user.userId);

      res.status(200).json({
        success: true,
        data: responses,
      });
    } catch (error) {
      console.error('Error getting user responses:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get survey responses',
      });
    }
  }

  /**
   * GET /api/surveys/responses/patient/:patientId
   * Get all responses for a specific patient (ADMIN or owner)
   */
  async getPatientResponses(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;

      const responses = await surveysService.getPatientResponses(patientId);

      res.status(200).json({
        success: true,
        data: responses,
      });
    } catch (error) {
      console.error('Error getting patient responses:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get patient responses',
      });
    }
  }

  /**
   * GET /api/surveys/responses/:id
   * Get a single response by ID (with ownership check)
   */
  async getResponseById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const response = await surveysService.getResponseById(id);

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error('Error getting survey response:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get survey response',
      });
    }
  }
}

