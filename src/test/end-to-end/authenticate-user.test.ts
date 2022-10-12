import request from 'supertest';
import server from '@src/server';

describe('User Session', () => {
  it('Should return error 401 with invalid authetication token', async () => {
    const respose = await request(server).post('/session');
    expect(respose.statusCode).toBe(401);
  });
});
