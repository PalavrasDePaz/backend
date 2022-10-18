import express from 'express';
import cors from 'cors';
import router from './routes';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.middleware();
    this.router();
  }

  private middleware(): void {
    this.server.use(express.json());
    this.server.use(cors());
  }

  public router() {
    this.server.use(router);
  }
}

export default new App().server;
