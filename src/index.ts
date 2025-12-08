import 'module-alias/register';
import { app } from './app';
import { NODE_ENV, PORT } from '@src/config/server';

if (NODE_ENV == 'production') {
  app.listen(PORT, () => {
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
