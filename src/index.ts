import 'module-alias/register';
import { app } from './app';
import { NODE_ENV, PORT } from '@src/config/server';

const port = Number(PORT) || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`[server]: Server is running on port ${port}`);
});
