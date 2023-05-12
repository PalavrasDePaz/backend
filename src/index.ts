import 'module-alias/register';
import { app } from './app';
import { PORT } from '@src/config/server';
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
