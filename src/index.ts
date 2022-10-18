import 'module-alias/register';
import server from './server';

const PORT = 3333;

server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
