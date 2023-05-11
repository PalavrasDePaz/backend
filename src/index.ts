import 'module-alias/register';
import { app } from './app';

const PORT = 3001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
