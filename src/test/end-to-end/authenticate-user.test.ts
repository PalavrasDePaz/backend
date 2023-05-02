import { App } from '@src/app';
// import autheticationMiddleware from '@src/presentation/middlewares/authentication';
import router from '@src/presentation/routers';
import request from 'supertest';

describe('User Session', () => {
  const server = new App(
    router
    // autheticationMiddleware
  ).server;

  it('Should return error 400 no header provided', async () => {
    const respose = await request(server).get('/');
    expect(respose.statusCode).toBe(400);
    expect(respose.text).toBe('Nenhum header encontrado!');
  });
});
