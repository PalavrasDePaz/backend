import request from 'supertest';
import server from '@src/server';

describe('User Session', () => {
  it('Should return error 400 no header provided', async () => {
    const respose = await request(server).get('/');
    expect(respose.statusCode).toBe(400);
    expect(respose.text).toBe('Nenhum header encontrado!');
  });
});
