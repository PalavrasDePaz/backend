import express, { RequestHandler, Router } from 'express';
import cors from 'cors';

export class App {
  public server: express.Application;

  constructor(router: Router, authMidle: RequestHandler) {
    this.server = express();
    this.middleware(authMidle);
    this.router(router);
  }

  private middleware(authMidle: RequestHandler): void {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(authMidle);
  }

  public router(router: Router) {
    this.server.use(router);
  }
}
