import { AuthError } from '@src/domain/errors/auth';
import { NextFunction, Request, Response } from 'express';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';

const authorizationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const volunteer: VolunteerJWTPayload = req.body.loggedVolunteer;
  volunteer.email == req.params.email
    ? next()
    : res.status(401).json(
        new AuthError({
          name: 'NOT_AUTHORIZED_ERROR',
          message: 'User not authorized for doing the current operation'
        })
      );
};

export default authorizationMiddleware;
