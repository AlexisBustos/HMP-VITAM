import { z } from 'zod';

// ============================================
// Survey Response DTOs
// ============================================

export const AnswerSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const CreateSurveyResponseDto = z.object({
  surveyId: z.string().uuid('Invalid survey ID format'),
  answers: z.array(AnswerSchema).min(1, 'At least one answer is required'),
});

export type CreateSurveyResponseInput = z.infer<typeof CreateSurveyResponseDto>;

// ============================================
// Survey Template DTOs
// ============================================

export const CreateSurveyTemplateDto = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  items: z.array(z.any()).min(1, 'At least one item is required'),
  isActive: z.boolean().optional().default(true),
});

export const UpdateSurveyTemplateDto = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  items: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateSurveyTemplateInput = z.infer<typeof CreateSurveyTemplateDto>;
export type UpdateSurveyTemplateInput = z.infer<typeof UpdateSurveyTemplateDto>;

// ============================================
// Query DTOs
// ============================================

export const GetSurveyTemplatesQueryDto = z.object({
  active: z.enum(['true', 'false']).optional(),
  code: z.string().optional(),
});

export type GetSurveyTemplatesQuery = z.infer<typeof GetSurveyTemplatesQueryDto>;

