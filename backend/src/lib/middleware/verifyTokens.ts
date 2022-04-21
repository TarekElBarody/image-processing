import express from 'express';
import { UserPayload, TokenData } from '../../types/index';
import { verifyToken } from '../functions/hash';
import { delay } from '../functions/general';

const verifyTokens = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const authHeder = String(req.headers.authorization);
    const token = authHeder.split(' ')[1];
    const decoded = await verifyToken(token);
    if (decoded.success) {
      const tokenData = decoded.data as TokenData;
      req.session.user = tokenData.data as UserPayload;
      req.session.isToken = true;
      req.session.isAdmin = req.session.user.role == 1 ? true : false;
      next();
    } else {
      req.session.user = undefined;
      req.session.isToken = false;
      req.session.isAdmin = false;

      res.status(401);
      res.json(decoded);
    }
  } catch (error) {
    req.session.user = undefined;
    req.session.isToken = false;
    req.session.isAdmin = false;

    res.status(401);
    res.json({
      success: false,
      err: error,
      data: undefined,
      token: ''
    });
  }

  return;
};

export default verifyTokens;

export const delayHandler = async (
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  await delay(1000);
  next();

  return;
};
