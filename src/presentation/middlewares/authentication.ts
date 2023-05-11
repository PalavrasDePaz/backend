import { JWT_SECRET_KEY } from '@src/config/server';
import { AuthError } from '@src/domain/errors/auth';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';

export const expressAuthentication = async function (
  req: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName == 'jwt') {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token)
        return Promise.reject(
          new AuthError({
            name: 'TOKEN_NOT_FOUND_ERROR',
            message: 'Authentication token not found'
          })
        );

      const decodedPayload = verify(
        token,
        JWT_SECRET_KEY
      ) as VolunteerJWTPayload;

      req.body.loggedVolunteer = decodedPayload;
      const LoggedEmail = decodedPayload.email;
      return LoggedEmail == req.params.email
        ? Promise.resolve(decodedPayload)
        : Promise.reject(
            new AuthError({
              name: 'NOT_AUTHORIZED_ERROR',
              message: 'User not authorized for doing the current operation'
            })
          );
    } catch (error) {
      return Promise.reject(
        new AuthError({
          name: 'NOT_AUTHENTICATED_ERROR',
          message: 'Not Authenticated'
        })
      );
    }
  }
};
