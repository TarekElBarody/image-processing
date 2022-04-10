import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';
import { app, port, sslPort, sslCert } from './lib/app';
import { defaultAdmin } from './lib/functions/defaultAdmin';

// check if is their no data on users it will insert default admin
defaultAdmin();

try {
  const thumbDir = path.resolve('./images/thumb');
  const fullDire = path.resolve('./images/full');
  const tmpDire = path.resolve('./images/tmp');

  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir);
  }

  if (!fs.existsSync(fullDire)) {
    fs.mkdirSync(fullDire);
  }

  if (!fs.existsSync(tmpDire)) {
    fs.mkdirSync(tmpDire);
  }
} catch (error) {
  console.log(error);
}

// Start HTTP Server
const httpApp = http.createServer(app).listen(port, () => {
  console.log(`HTTP server on port ${port} at http://localhost:${port}/`);
});

// Start HTTPs Server
const httpsApp = https.createServer(sslCert, app).listen(sslPort, () => {
  console.log(
    `HTTPS server on port ${sslPort} at https://localhost:${sslPort}/`
  );
});

export { httpsApp, httpApp, port, sslPort, sslCert };
