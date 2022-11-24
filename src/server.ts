import express, { Router } from 'express';
import cors from 'cors';
import autheticationMiddleware from './presentation/middlewares/authentication';
import router from './presentation/routers';

export class App {
  public server: express.Application;

  constructor(router: Router) {
    this.server = express();
    this.middleware();
    this.router(router);
  }

  private middleware(): void {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(autheticationMiddleware);
  }

  public router(router: Router) {
    this.server.use(router);
  }
}

export default new App(router).server;
