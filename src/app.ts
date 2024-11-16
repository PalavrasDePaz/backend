import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import initModels from './services/database';
import { RegisterRoutes } from './routes';
import { validationMiddleware } from './presentation/middlewares/validation';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';
import * as path from 'path';

export const app = express();
initModels();

app.use(express.json());
app.use(cors());

app.use('/static', express.static(path.join(__dirname, '../public')));

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('./swagger.json')));
});

RegisterRoutes(app);

app.use(validationMiddleware);
