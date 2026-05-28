import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import initModels from './services/database';
import routes from './routes';
import { validationMiddleware } from './presentation/middlewares/validation';

export const app = express();

initModels();

app.use(express.json());

app.use(
  cors({
    origin: ['https://palavrasdepaz.org', 'https://www.palavrasdepaz.org'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.options('*', cors());

app.use('/static', express.static(path.join(__dirname, '../public')));

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('./swagger.json')));
});

app.use(routes);

app.use(validationMiddleware);
