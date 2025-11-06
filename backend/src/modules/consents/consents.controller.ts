import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { AuthRequest } from '../../middleware/auth.middleware';

/**
 * GET /api/consents/active
 * Get the active consent template
 */
export const getActiveConsent = async (req: Request, res: Response) => {
  try {
    const latest = await prisma.consentTemplate.findFirst({
      where: { isActive: true },
      orderBy: { version: 'desc' },
    });

    if (!latest) {
      return res.status(404).json({ error: 'NO_ACTIVE_CONSENT' });
    }

    // Prevent caching
    res.set('Cache-Control', 'no-store');
    
    return res.json({
      data: {
        id: latest.id,
        version: latest.version,
        title: latest.title,
        bodyMarkdown: latest.bodyMarkdown,
        hash: latest.hash,
      },
    });
  } catch (error) {
    console.error('Error getting active consent:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/consents/accept
 * Accept a consent template
 */
export const acceptConsent = async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      templateId: z.string().uuid(),
    });

    const { templateId } = schema.parse(req.body);

    // Check if template exists
    const template = await prisma.consentTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(404).json({ error: 'CONSENT_NOT_FOUND' });
    }

    // Check if already accepted
    const existing = await prisma.consentAcceptance.findFirst({
      where: {
        userId: req.user!.userId,
        templateId,
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'ALREADY_ACCEPTED' });
    }

    // Extract IP and User-Agent
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Create acceptance record
    const acceptance = await prisma.consentAcceptance.create({
      data: {
        userId: req.user!.userId,
        templateId,
        ipAddress: String(ip),
        userAgent,
        hashAtAcceptance: template.hash,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CONSENT_ACCEPTED',
        ipAddress: String(ip),
        userAgent,
        metadata: JSON.stringify({
          templateVersion: template.version,
          templateId: template.id,
          acceptanceId: acceptance.id,
        }),
      },
    });

    return res.status(201).json({
      data: acceptance,
      message: 'Consent accepted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error accepting consent:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/consents/acceptances/mine
 * Get current user's consent acceptances
 */
export const getMyAcceptances = async (req: AuthRequest, res: Response) => {
  try {
    const acceptances = await prisma.consentAcceptance.findMany({
      where: { userId: req.user!.userId },
      include: {
        template: {
          select: {
            id: true,
            version: true,
            title: true,
            hash: true,
          },
        },
      },
      orderBy: { acceptedAt: 'desc' },
    });

    return res.json({
      data: acceptances,
    });
  } catch (error) {
    console.error('Error getting acceptances:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

