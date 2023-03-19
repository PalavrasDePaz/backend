import { JWT_SECRET_KEY } from '@src/config/server';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWTPayload } from '../types/jwt-payload';

const autheticationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded_payload = verify(token, JWT_SECRET_KEY) as JWTPayload;
    req.body.logged_volunteer = decoded_payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not Authorized' });
  }
};

export default autheticationMiddleware;
