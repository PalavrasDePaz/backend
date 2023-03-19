import express, { NextFunction, Request, Response, Router } from 'express';
import cors from 'cors';
import initModels from './services/database';
import { ValidationError } from 'express-validation';

export class App {
  public server: express.Application;

  constructor(router: Router) {
    initModels();
    this.server = express();
    this.middleware();
    this.router(router);
    this.addValidationErrorHandler();
  }

  private addValidationErrorHandler() {
    this.server.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof ValidationError) {
          return res.status(err.statusCode).json(err);
        }

        return res.status(500).json(err);
      }
    );
  }

  private middleware() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  public router(router: Router) {
    this.server.use(router);
  }
}
