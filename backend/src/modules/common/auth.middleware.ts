import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ 
        error: "Forbidden: Insufficient permissions",
        required: roles,
        current: role || "none"
      });
    }
    
    next();
  };
}

