import { User, UserRole, Role, Session } from '@prisma/client';
import prisma from '../../config/prisma';
import { hashPassword, verifyPassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { cleanRUT } from '../../utils/rut';
import * as crypto from 'crypto';

export interface LoginResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    rut: string;
    roles: string[];
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rut: string;
  phone?: string;
  dateOfBirth?: string;
}

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string, ipAddress: string, userAgent: string): Promise<LoginResult> {
    // Find user with roles and patient record
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        paciente: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(user.passwordHash, password);
    if (!isPasswordValid) {
      // Log failed login attempt
      await this.logAuditEvent(user.id, 'LOGIN_FAILED', ipAddress, userAgent, {
        reason: 'Invalid password',
      });
      throw new Error('Invalid email or password');
    }

    // Extract roles
    const roles = user.userRoles.map((ur) => ur.role.name);

    // Get patient ID if exists
    const patientId = user.paciente?.id;

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent);

    // Generate tokens with patientId
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      roles,
      patientId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log successful login
    await this.logAuditEvent(user.id, 'LOGIN_SUCCESS', ipAddress, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        rut: user.rut || '',
        roles,
        isActive: user.isActive,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.isRevoked) {
      throw new Error('Session is invalid or revoked');
    }

    if (session.expiresAt < new Date()) {
      throw new Error('Session has expired');
    }

    if (session.userId !== payload.userId) {
      throw new Error('Token mismatch');
    }

    // Check if user is active
    if (!session.user.isActive) {
      throw new Error('Account is inactive');
    }

    // Extract roles
    const roles = session.user.userRoles.map((ur) => ur.role.name);

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: session.user.id,
      email: session.user.email,
      roles,
    });

    return { accessToken };
  }

  /**
   * Logout user and revoke session
   */
  async logout(sessionId: string, userId: string, ipAddress: string, userAgent: string): Promise<void> {
    // Revoke session
    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    // Log logout
    await this.logAuditEvent(userId, 'LOGOUT', ipAddress, userAgent);
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Clean and check RUT
    const cleanedRUT = cleanRUT(data.rut);
    const existingRUT = await prisma.user.findUnique({
      where: { rut: cleanedRUT },
    });

    if (existingRUT) {
      throw new Error('RUT already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user with PERSON role by default
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        rut: cleanedRUT,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        isActive: true,
        userRoles: {
          create: {
            role: {
              connect: { name: 'PERSON' },
            },
          },
        },
      },
    });

    return user;
  }

  /**
   * Initiate password reset process
   */
  async forgotPassword(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return 'If the email exists, a reset link will be sent';
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetTokenHash,
        passwordResetExpiry: resetTokenExpiry,
      },
    });

    // TODO: Send email with reset link
    // For now, return the token (in production, this should be sent via email)
    return resetToken;
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash the provided token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: resetTokenHash,
        passwordResetExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    // Revoke all sessions for security
    await prisma.session.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(user.passwordHash, currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all other sessions for security
    await prisma.session.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });
  }

  /**
   * Create a new session
   */
  private async createSession(userId: string, ipAddress: string, userAgent: string): Promise<Session> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return prisma.session.create({
      data: {
        userId,
        ipAddress,
        userAgent,
        expiresAt,
        isRevoked: false,
      },
    });
  }

  /**
   * Log audit event
   */
  private async logAuditEvent(
    userId: string,
    action: string,
    ipAddress: string,
    userAgent: string,
    metadata?: any
  ): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        id: sessionId,
        userId,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  /**
   * Revoke all user sessions
   */
  async revokeAllSessions(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}

export const authService = new AuthService();

