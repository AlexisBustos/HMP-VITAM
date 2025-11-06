import prisma from '../../config/prisma';
import { generateAccessToken } from '../../utils/jwt';
import * as crypto from 'crypto';

/**
 * Service for handling user activation via email
 * 
 * This service provides the structure for email-based user activation.
 * Email sending functionality is not implemented yet and should be added
 * using a service like SendGrid, AWS SES, or Nodemailer.
 */
export class ActivationService {
  /**
   * Generate an activation token for a user
   * Token is valid for 24 hours
   * 
   * @param userId - The user ID to generate token for
   * @param email - The user email
   * @returns Activation token (JWT)
   */
  createActivationToken(userId: string, email: string): string {
    // Generate a JWT token valid for 24 hours
    // Note: Using ACTIVATION role to identify activation tokens
    const token = generateAccessToken({
      userId,
      email,
      roles: ['ACTIVATION'], // Special role to identify activation tokens
    });

    return token;
  }

  /**
   * Generate activation URL with token
   * 
   * @param userId - The user ID
   * @param email - The user email
   * @param baseUrl - Base URL of the frontend (e.g., https://hmp-vitam-aws.vercel.app)
   * @returns Full activation URL
   */
  generateActivationUrl(userId: string, email: string, baseUrl: string): string {
    const token = this.createActivationToken(userId, email);
    return `${baseUrl}/activar?token=${token}`;
  }

  /**
   * Send activation email to user
   * 
   * TODO: Implement email sending using:
   * - SendGrid
   * - AWS SES
   * - Nodemailer
   * - Other email service
   * 
   * @param email - User email address
   * @param activationUrl - Full activation URL
   * @returns Promise<void>
   */
  async sendActivationEmail(email: string, activationUrl: string): Promise<void> {
    // TODO: Implement email sending
    console.log('📧 [ACTIVATION EMAIL] Would send to:', email);
    console.log('🔗 [ACTIVATION URL]:', activationUrl);
    console.log('⚠️  Email sending not implemented yet. Please configure an email service.');

    // Example implementation with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: 'noreply@vitamhc.cl',
      subject: 'Activa tu cuenta en HMP Vitam',
      html: `
        <h1>Bienvenido a HMP Vitam</h1>
        <p>Para activar tu cuenta y establecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${activationUrl}">Activar cuenta</a>
        <p>Este enlace es válido por 24 horas.</p>
      `,
    };
    
    await sgMail.send(msg);
    */
  }

  /**
   * Verify activation token and mark user as verified
   * 
   * @param token - Activation token
   * @returns User ID if valid
   * @throws Error if token is invalid or expired
   */
  async verifyActivationToken(token: string): Promise<string> {
    try {
      // Verify token (this will throw if invalid or expired)
      const { verifyAccessToken } = require('../../utils/jwt');
      const payload = verifyAccessToken(token);

      // Verify this is an activation token (has ACTIVATION role)
      if (!payload.roles || !payload.roles.includes('ACTIVATION')) {
        throw new Error('Invalid token type');
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email already verified');
      }

      return payload.userId;
    } catch (error) {
      throw new Error('Invalid or expired activation token');
    }
  }

  /**
   * Mark user email as verified
   * 
   * @param userId - User ID
   */
  async markEmailAsVerified(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  /**
   * Create a new user and send activation email
   * This is the hook that should be called when creating PERSON users
   * 
   * @param userData - User data (email, firstName, lastName, etc.)
   * @param baseUrl - Frontend base URL
   * @returns Created user
   */
  async createUserAndSendActivation(
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      rut?: string;
      phone?: string;
      dateOfBirth?: Date;
    },
    baseUrl: string
  ): Promise<any> {
    // Generate a temporary random password
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const { hashPassword } = require('../../utils/password');
    const passwordHash = await hashPassword(tempPassword);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        rut: userData.rut,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        isActive: true,
        isEmailVerified: false, // Will be set to true after activation
      },
    });

    // Assign PERSON role
    const personRole = await prisma.role.findUnique({
      where: { name: 'PERSON' },
    });

    if (personRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: personRole.id,
        },
      });
    }

    // Generate activation URL
    const activationUrl = this.generateActivationUrl(user.id, user.email, baseUrl);

    // Send activation email (TODO: implement)
    await this.sendActivationEmail(user.email, activationUrl);

    return user;
  }
}

export default new ActivationService();

