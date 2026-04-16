import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import prisma from '../config/prisma';
import { UserRole } from '@prisma/client';

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(new AppError(401, 'You are not logged in! Please log in to get access.'));
      }

      const decoded = jwt.verify(token, env.jwt.secret) as { id: string; role: UserRole };

      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!currentUser) {
        return next(new AppError(401, 'The user belonging to this token does no longer exist.'));
      }

      if (roles.length && !roles.includes(currentUser.role)) {
        return next(new AppError(403, 'You do not have permission to perform this action'));
      }

      req.user = currentUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
