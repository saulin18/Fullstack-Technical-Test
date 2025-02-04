import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/types';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      username: string;
      role: UserRole;
    };
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return; 
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return; 
    }
    
    if (decoded && typeof decoded === 'object') {
      req.user = decoded as typeof req.user;
    }
    
    next();
  });
};

export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Requires roles: ${allowedRoles.join(', ')}` });
      return; 
    }
    next();
  };
};