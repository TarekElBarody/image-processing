import express from 'express';
import compression from 'compression';
import session from './helpers/session';
import fs from 'fs';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import apiRoute from './routes/apiRoute';
import { logMorgan } from './functions/loggerControl';
import { checkLogSize } from './functions/general';
import dotenv from 'dotenv';
//import { delayHandler } from './middleware/verifyTokens';

dotenv.config();
// Configure express server & default port
const app = express();
const port = process.env.PORT || 3000;
const sslPort = process.env.SSL_PORT || 4000;
const env = process.env.ENV || 'dev';

// Set up the allowed CORS Origins & CORS Options
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// compress resources
app.use(compression());

// Make the server using Module helmet for protecting headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false
  })
);

app.use(function (_req, res, next) {
  res.header('X-Frame-Options', '*');
  res.header('Cross-Origin-Resource-Policy', '*');
  res.header('Cross-Origin-Embedder-Policy', '*');
  res.header('Cross-Origin-Opener-Policy', '*');
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

checkLogSize();

app.use(
  morgan(
    function (tokens, req, res) {
      const kk = {
        remote_addr: tokens['remote-addr'](req, res) || null,
        visit_date: tokens.date(req, res) || null,
        method: tokens.method(req, res) || null,
        url: tokens.url(req, res) || null,
        status: Number(tokens.status(req, res)) || 0,
        referrer: tokens.referrer(req, res) || null,
        user_agent: tokens['user-agent'](req, res) || null,
        content_length: Number(tokens.res(req, res, 'content-length')) || 0,
        response_time: Number(tokens['response-time'](req, res)) || 0
      };
      logMorgan(kk);

      return [
        tokens['remote-addr'](req, res),
        tokens.date(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.referrer(req, res),
        tokens['user-agent'](req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms'
      ].join(' ');
    },
    {
      stream: fs.createWriteStream('./logs/access.log', { flags: 'a' })
    }
  )
);

// configure session
const sess = {
  secret: process.env.SESSION_SLAT || 'session secret here',
  cookie: {
    secure: env === 'production' ? true : false, // serve secure cookies
    maxAge: 5 * 60 * 100000
  },
  resave: false,
  saveUninitialized: true
};

// parsing incoming data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

// enable session
app.use(session(sess));

//app.use(delayHandler);
// mount mainRoute to server root
app.use('/api', apiRoute);

app.use((_req: express.Request, res: express.Response): void => {
  res.status(200).json({
    error: true,
    message: 'API Page Not Found !.'
  });
});
// Configure SSL Certificates
const sslCert = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.cert')
};

export { app, port, sslPort, sslCert };
