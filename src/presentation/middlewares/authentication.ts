import { JWT_SECRET_KEY } from '@src/config/server';
import { AuthError } from '@src/domain/errors/auth';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';
import { ApiError } from '../types/api-error';

export const expressAuthentication = async function (
  req: Request,
  securityName: string,
  _scopes?: string[]
): Promise<unknown> {
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

      const LoggedEmail = decodedPayload.email;
      return LoggedEmail == req.params.email
        ? Promise.resolve(decodedPayload)
        : Promise.reject(
            new ApiError(
              401,
              new AuthError({
                name: 'NOT_AUTHORIZED_ERROR',
                message: 'User not authorized for doing the current operation'
              })
            )
          );
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
