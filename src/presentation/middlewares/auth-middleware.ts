import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET_KEY } from '@src/config/server';
import { verify } from 'jsonwebtoken';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';
import { ApiError } from '../types/api-error';
import { AuthError } from '@src/domain/errors/auth';
import { checkAuthorization } from './authorization-helper';

export interface AuthenticatedRequest extends Request {
  user?: VolunteerJWTPayload;
}

export const authenticateMiddleware = (scopes?: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return next(
          new ApiError(
            401,
            new AuthError({
              name: 'TOKEN_NOT_FOUND_ERROR',
              message: 'Authentication token not found'
            })
          )
        );
      }

      const decodedPayload = verify(
        token,
        JWT_SECRET_KEY
      ) as VolunteerJWTPayload;

      const authorized = checkAuthorization(req, decodedPayload, scopes);
      if (!authorized) {
        return next(
          new ApiError(
            403,
            new AuthError({
              name: 'NOT_AUTHORIZED_ERROR',
              message: 'Not Authorized'
            })
          )
        );
      }

      req.user = decodedPayload;
      if (res.locals) {
        res.locals.user = decodedPayload;
      }
      next();
    } catch (error) {
      return next(
        new ApiError(
          401,
          new AuthError({
            name: 'NOT_AUTHENTICATED_ERROR',
            message: 'Not Authenticated'
          })
        )
      );
    }
  };
};
