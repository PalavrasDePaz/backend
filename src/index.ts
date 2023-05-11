/* eslint-disable no-console */
('use strict');

import express, { Express, Request, Response } from 'express';
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 21043;

const app: Express = express();
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello Palavras de Paz!');
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
