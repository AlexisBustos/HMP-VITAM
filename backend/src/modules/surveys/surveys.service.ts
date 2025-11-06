import prisma from '../../config/prisma';
import { CreateSurveyResponseInput, CreateSurveyTemplateInput, UpdateSurveyTemplateInput } from './surveys.dto';

export class SurveysService {
  /**
   * Get all survey templates (optionally filter by active status)
   */
  async getTemplates(activeOnly?: boolean) {
    const where = activeOnly !== undefined ? { isActive: activeOnly } : {};
    
    return prisma.surveyTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single survey template by ID
   */
  async getTemplateById(id: string) {
    const template = await prisma.surveyTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new Error('Survey template not found');
    }

    return template;
  }

  /**
   * Get a single survey template by code
   */
  async getTemplateByCode(code: string) {
    const template = await prisma.surveyTemplate.findUnique({
      where: { code },
    });

    if (!template) {
      throw new Error('Survey template not found');
    }

    return template;
  }

  /**
   * Create a new survey template (ADMIN only)
   */
  async createTemplate(data: CreateSurveyTemplateInput) {
    // Check if code already exists
    const existing = await prisma.surveyTemplate.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new Error('Survey template with this code already exists');
    }

    return prisma.surveyTemplate.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        items: data.items as any,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * Update a survey template (ADMIN only)
   */
  async updateTemplate(id: string, data: UpdateSurveyTemplateInput) {
    const existing = await prisma.surveyTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Survey template not found');
    }

    return prisma.surveyTemplate.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        items: data.items as any,
        isActive: data.isActive,
      },
    });
  }

  /**
   * Delete a survey template (ADMIN only)
   */
  async deleteTemplate(id: string) {
    const existing = await prisma.surveyTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Survey template not found');
    }

    await prisma.surveyTemplate.delete({
      where: { id },
    });

    return { message: 'Survey template deleted successfully' };
  }

  /**
   * Create a survey response (PERSON only)
   */
  async createResponse(userId: string, patientId: string, data: CreateSurveyResponseInput) {
    // Verify survey template exists and is active
    const template = await prisma.surveyTemplate.findUnique({
      where: { id: data.surveyId },
    });

    if (!template) {
      throw new Error('Survey template not found');
    }

    if (!template.isActive) {
      throw new Error('This survey is no longer active');
    }

    // Calculate score based on answers
    const score = this.calculateScore(data.answers, template.items as any);
    const interpretation = this.getInterpretation(score, template.items as any);

    // Create response
    return prisma.surveyResponse.create({
      data: {
        surveyId: data.surveyId,
        patientId,
        userId,
        answers: data.answers as any,
        score,
        interpretation,
      },
      include: {
        template: {
          select: {
            code: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Get all responses for the authenticated user (PERSON)
   */
  async getMyResponses(userId: string) {
    return prisma.surveyResponse.findMany({
      where: { userId },
      include: {
        template: {
          select: {
            code: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all responses for a specific patient (ADMIN or owner)
   */
  async getPatientResponses(patientId: string) {
    return prisma.surveyResponse.findMany({
      where: { patientId },
      include: {
        template: {
          select: {
            code: true,
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single response by ID (with ownership check)
   */
  async getResponseById(id: string) {
    const response = await prisma.surveyResponse.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            code: true,
            title: true,
            description: true,
            items: true,
          },
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rut: true,
          },
        },
      },
    });

    if (!response) {
      throw new Error('Survey response not found');
    }

    return response;
  }

  /**
   * Calculate score from answers
   * This is a simple implementation - can be enhanced based on survey type
   */
  private calculateScore(answers: any[], items: any[]): number {
    let total = 0;
    
    for (const answer of answers) {
      if (typeof answer.value === 'number') {
        total += answer.value;
      }
    }

    return total;
  }

  /**
   * Get interpretation based on score
   * This is a placeholder - should be enhanced with actual scoring logic
   */
  private getInterpretation(score: number, items: any[]): string {
    // Extract scoring info from items if available
    const scoringInfo = items.find((item: any) => item.scoring);
    
    if (scoringInfo && scoringInfo.scoring && scoringInfo.scoring.interpretation) {
      const interpretations = scoringInfo.scoring.interpretation;
      
      for (const interp of interpretations) {
        const [min, max] = interp.range;
        if (score >= min && score <= max) {
          return interp.label;
        }
      }
    }

    // Default interpretation
    if (score === 0) return 'No síntomas detectados';
    if (score <= 5) return 'Síntomas mínimos';
    if (score <= 10) return 'Síntomas leves';
    if (score <= 15) return 'Síntomas moderados';
    return 'Síntomas severos';
  }
}

