import express, { Request, Response } from 'express';
import cors from 'cors';
import initModels from './services/database';
import { RegisterRoutes } from '../build/routes';
import { validationMiddleware } from './presentation/middlewares/validation';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';

export const app = express();
initModels();

app.use(express.json());
app.use(cors());

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json'))
  );
});

RegisterRoutes(app);

app.use(validationMiddleware);
