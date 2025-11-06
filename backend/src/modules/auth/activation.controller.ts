import { Request, Response } from 'express';
import { z } from 'zod';
import activationService from './activation.service';
import { hashPassword } from '../../utils/password';
import prisma from '../../config/prisma';

/**
 * GET /api/auth/activate?token=...
 * Verify activation token and return user info
 */
export const verifyActivationToken = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      token: z.string().min(1),
    });

    const { token } = schema.parse(req.query);

    // Verify token and get user ID
    const userId = await activationService.verifyActivationToken(token);

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    return res.json({
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'Token is valid',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    return res.status(400).json({
      error: error.message || 'Invalid activation token',
    });
  }
};

/**
 * POST /api/auth/activate
 * Activate user account and set password
 * 
 * Body: { token: string, password: string }
 */
export const activateAccount = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      token: z.string().min(1),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    });

    const { token, password } = schema.parse(req.body);

    // Verify token and get user ID
    const userId = await activationService.verifyActivationToken(token);

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user: set password and mark email as verified
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        isEmailVerified: true,
      },
    });

    // Log activation
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ACCOUNT_ACTIVATED',
        ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || '',
      },
    });

    return res.json({
      message: 'Account activated successfully. You can now log in.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    return res.status(400).json({
      error: error.message || 'Failed to activate account',
    });
  }
};

