import express, { Request, Response } from 'express';

const server = express();
server.use(express.json);

server.get('/', (_: Request, response: Response): void => {
  response.send('Hello Palavras de Paz!');
});

export default server;
