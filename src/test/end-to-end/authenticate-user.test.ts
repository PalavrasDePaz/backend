import request from 'supertest';
import server from '@src/server';

describe('User Session', () => {
  it('Should return error 401 no authentication token presented', async () => {
    const respose = await request(server).get('/');
    expect(respose.statusCode).toBe(401);
  });
});
