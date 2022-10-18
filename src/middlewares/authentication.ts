import { authService } from '@src/services/firebase';
import { NextFunction, Request, Response } from 'express';

const autheticationMiddleware = async function (
  request: Request,
  respose: Response,
  next: NextFunction
) {
  try {
    const token = request.body.token;
    await authService.verifyIdToken(token);
    next();
  } catch (error) {
    respose.status(401).send('User not autheticated');
  }
};

export default autheticationMiddleware;
