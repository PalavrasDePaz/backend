import { NextFunction, Request, Response } from 'express';

const autheticationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
};

export default autheticationMiddleware;
