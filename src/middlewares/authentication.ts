import { NextFunction, Request, Response } from 'express';
import admin from '@src/services/firebase';

const autheticationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const firebaseToken = req.headers.authorization?.split(' ')[1];

  if (!firebaseToken) {
    res.status(400).send('Nenhum header encontrado!');
  } else if (!firebaseToken[1]) {
    res.status(400).send('Nenhum token encontrado');
  } else {
    try {
      await admin.auth().verifyIdToken(firebaseToken);
      next();
    } catch {
      res.status(401).send('Usuário não autenticado!');
    }
  }
};

export default autheticationMiddleware;
