import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
    patientId?: string; // For PERSON role users
  };
}

/**
 * Middleware to require authentication
 */
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid token',
      });
      return;
    }

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account is inactive or does not exist',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles,
      patientId: payload.patientId, // May be undefined
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

/**
 * Middleware to require specific roles
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        userRoles: req.user.roles,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to optionally attach user if authenticated
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = verifyAccessToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, isActive: true },
      });

      if (user && user.isActive) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          roles: payload.roles,
          patientId: payload.patientId,
        };
      }
    } catch (error) {
      // Token invalid or expired, but that's okay for optional auth
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Middleware to log audit events
 */
export const auditLog = (action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        await prisma.auditLog.create({
          data: {
            userId: req.user.userId,
            action,
            ipAddress,
            userAgent,
            metadata: JSON.stringify({
              method: req.method,
              path: req.path,
              query: req.query,
            }),
          },
        });
      }
      next();
    } catch (error) {
      console.error('Audit log middleware error:', error);
      // Don't block the request if audit logging fails
      next();
    }
  };
};



/**
 * Middleware to require ownership of a resource
 * Allows access if user has one of the allowed roles OR owns the resource (patientId matches)
 */
export const requireOwnership = (
  getResourcePatientId: (req: AuthRequest) => string | undefined | Promise<string | undefined>,
  allowedRoles: string[] = ['SUPER_ADMIN', 'CLINICAL_ADMIN']
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check if user has one of the allowed roles
      const hasAllowedRole = req.user.roles.some((role) => allowedRoles.includes(role));
      
      if (hasAllowedRole) {
        // User has admin role, allow access
        next();
        return;
      }

      // User doesn't have admin role, check ownership
      if (!req.user.patientId) {
        res.status(403).json({
          success: false,
          message: 'Access denied: No patient record associated with your account',
        });
        return;
      }

      // Get the patient ID of the resource being accessed
      const resourcePatientId = await getResourcePatientId(req);

      if (!resourcePatientId) {
        res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
        return;
      }

      // Check if user owns the resource
      if (req.user.patientId !== resourcePatientId) {
        res.status(403).json({
          success: false,
          message: 'Access denied: You can only access your own records',
        });
        return;
      }

      // User owns the resource, allow access
      next();
    } catch (error) {
      console.error('Ownership middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during authorization',
      });
    }
  };
};

/**
 * Middleware to require that user is a PERSON with a patient record
 */
export const requirePersonWithPatient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const isPerson = req.user.roles.includes('PERSON');
  
  if (!isPerson) {
    res.status(403).json({
      success: false,
      message: 'This endpoint is only available for personal accounts',
    });
    return;
  }

  if (!req.user.patientId) {
    res.status(403).json({
      success: false,
      message: 'No patient record associated with your account. Please contact support.',
    });
    return;
  }

  next();
};

