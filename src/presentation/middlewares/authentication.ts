import { JWT_SECRET_KEY } from '@src/config/server';
import { AuthError } from '@src/domain/errors/auth';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';

const autheticationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token)
      throw new AuthError({
        name: 'TOKEN_NOT_FOUND_ERROR',
        message: 'Authentication token not found'
      });

    const decodedPayload = verify(token, JWT_SECRET_KEY) as VolunteerJWTPayload;
    req.body.loggedVolunteer = decodedPayload;
    next();
  } catch (error) {
    res.status(401).json(
      new AuthError({
        name: 'NOT_AUTHENTICATED_ERROR',
        message: 'Not Authenticated'
      })
    );
  }
};

export default autheticationMiddleware;
