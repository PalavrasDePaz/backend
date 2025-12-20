import { PORT, TLS } from '@src/config/server';
import fs from 'fs';
import https from 'https';
import 'module-alias/register';
import { app } from './app';

const port = Number(PORT) || 3000;

if (TLS) {
  const httpsOptions = {
    key: fs.readFileSync(TLS.key, 'utf8'),
    cert: fs.readFileSync(TLS.cert, 'utf8')
  };

  https.createServer(httpsOptions, app).listen(port, '0.0.0.0', () => {
    console.log(`[server]: HTTPS server is running on port ${port}`);
  });
} else {
  app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: HTTP server is running on port ${port}`);
  });
}
