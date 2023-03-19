import 'module-alias/register';
import router from './presentation/routers';
import { App } from './app';

const PORT = 3333;
const server = new App(router).server;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
