import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const port = String(process.env.HTTP_PORT);
const sslPort = String(process.env.HTTPS_PORT);

const forceHttps = (req: Request, res: Response, next: NextFunction): void => {
  const reqSecure = Boolean(req.secure);
  const envSecure = process.env.SECURE ? Number(process.env.SECURE) : 0;
  const host = String(req.headers.host);
  const url = String(req.url);

  if (envSecure === 1 && !reqSecure) {
    const redirect = 'https://' + host.replace(port, sslPort) + url;

    if (url.startsWith('/api')) {
      res.json({
        error:
          'API Server accepts SSL requests only, you should change http to https'
      });
    } else {
      res.redirect(redirect);
    }

    return;
  }
  next();
};

export default forceHttps;
