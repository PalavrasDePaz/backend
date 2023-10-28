import 'module-alias/register';
import { app } from './app';
import { NODE_ENV, PORT } from '@src/config/server';
import { readFileSync } from 'fs';
import { createServer } from 'https';

if (NODE_ENV == 'production') {
  const server_key = readFileSync('../server.key');
  const server_cert = readFileSync('../server.crt');

  const server = createServer({ key: server_key, cert: server_cert }, app);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server]: Server is running on port ${PORT}`);
  });
} else if (NODE_ENV == 'development') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server]: Server is running on port ${PORT}`);
  });
} else {
  // eslint-disable-next-line no-console
  console.log(`[server]: Configuration ${NODE_ENV} not available`);
}
