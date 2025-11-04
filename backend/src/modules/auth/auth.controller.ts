import { Request, Response } from 'express';
import { authService } from './auth.service';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validator';
import { AuthRequest } from '../common/auth.middleware';
import { env } from '../../config/env';
import { AppError } from '../common/error.handler';

export async function login(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new AppError(400, 'Validation failed');
    }

    const { email, password } = validationResult.data;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Authenticate user
    const result = await authService.login(email, password, ipAddress, userAgent);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Login error:', error);
    throw new AppError(401, error instanceof Error ? error.message : 'Login failed');
  }
}

export async function register(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new AppError(400, 'Validation failed');
    }

    const data = validationResult.data;

    // Register user
    const user = await authService.register(data as any);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          rut: user.rut,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Registration error:', error);
    throw new AppError(400, error instanceof Error ? error.message : 'Registration failed');
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(401, 'No refresh token provided');
    }

    // Refresh access token
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Token refresh error:', error);
    throw new AppError(401, error instanceof Error ? error.message : 'Token refresh failed');
  }
}

export async function logout(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const { verifyRefreshToken } = await import('../../utils/jwt');
        const payload = verifyRefreshToken(refreshToken);
        
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        await authService.logout(payload.sessionId, req.user.userId, ipAddress, userAgent);
      } catch (error) {
        console.error('Error revoking session:', error);
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Logout error:', error);
    throw new AppError(500, 'Logout failed');
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = forgotPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new AppError(400, 'Validation failed');
    }

    const { email } = validationResult.data;

    // Initiate password reset
    const message = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Forgot password error:', error);
    throw new AppError(500, 'Failed to process password reset request');
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = resetPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new AppError(400, 'Validation failed');
    }

    const { token, password } = validationResult.data;

    // Reset password
    await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Reset password error:', error);
    throw new AppError(400, error instanceof Error ? error.message : 'Password reset failed');
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    // Validate request body
    const validationResult = changePasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new AppError(400, 'Validation failed');
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Change password
    await authService.changePassword(req.user.userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Change password error:', error);
    throw new AppError(400, error instanceof Error ? error.message : 'Password change failed');
  }
}

export async function getCurrentUser(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const prisma = (await import('../../config/prisma')).default;
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user,
          roles: user.userRoles.map((ur) => ur.role.name),
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Get current user error:', error);
    throw new AppError(500, 'Failed to get user information');
  }
}

export async function getSessions(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const sessions = await authService.getUserSessions(req.user.userId);

    res.status(200).json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Get sessions error:', error);
    throw new AppError(500, 'Failed to get sessions');
  }
}

export async function revokeSession(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { sessionId } = req.params;
    await authService.revokeSession(sessionId, req.user.userId);

    res.status(200).json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Revoke session error:', error);
    throw new AppError(500, 'Failed to revoke session');
  }
}

export async function revokeAllSessions(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    await authService.revokeAllSessions(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'All sessions revoked successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Revoke all sessions error:', error);
    throw new AppError(500, 'Failed to revoke sessions');
  }
}

