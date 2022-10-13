import express, { Request, Response } from 'express';
import autheticationMiddleware from '@src/middlewares/authentication';

const server = express();
server.use(autheticationMiddleware);
server.use(express.json);

server.get('/', (_: Request, response: Response): void => {
  response.send('Hello Palavras de Paz!');
});

export default server;
