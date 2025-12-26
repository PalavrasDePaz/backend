import { PORT } from '@src/config/server';
import 'module-alias/register';
import { app } from './app';

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running on port ${PORT}`);
});
