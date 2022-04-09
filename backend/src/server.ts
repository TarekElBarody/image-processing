import http from 'http';
import https from 'https';
import { app, port, sslPort, sslCert } from './lib/app';
import { defaultAdmin } from './lib/functions/defaultAdmin';

// check if is their no data on users it will insert default admin
defaultAdmin();

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
