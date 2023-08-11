import { JWT_SECRET_KEY } from '@src/config/server';
import { AuthError } from '@src/domain/errors/auth';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';
import { ApiError } from '../types/api-error';
import { checkAuthorization } from './authorization-helper';

export const expressAuthentication = async function (
  req: Request,
  securityName: string,
  scopes?: string[]
): Promise<undefined> {
  if (securityName == 'jwt') {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token)
        return Promise.reject(
          new ApiError(
            401,
            new AuthError({
              name: 'TOKEN_NOT_FOUND_ERROR',
              message: 'Authentication token not found'
            })
          )
        );

      const decodedPayload = verify(
        token,
        JWT_SECRET_KEY
      ) as VolunteerJWTPayload;

      const authorized = checkAuthorization(req, decodedPayload, scopes);

      if (!authorized) {
        return Promise.reject(
          new ApiError(
            403,
            new AuthError({
              name: 'NOT_AUTHORIZED_ERROR',
              message: 'Not Authorized'
            })
          )
        );
      }
      if (req.res) req.res.locals.user = decodedPayload;
      Promise.resolve(decodedPayload);
    } catch (error) {
      return Promise.reject(
        new ApiError(
          401,
          new AuthError({
            name: 'NOT_AUTHENTICATED_ERROR',
            message: 'Not Authenticated'
          })
        )
      );
    }
  }

  return;
};
