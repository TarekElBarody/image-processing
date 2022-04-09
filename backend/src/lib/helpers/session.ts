import session from 'express-session';
import { UserPayload } from '../../types/index';

export default session;

declare module 'express-session' {
  interface SessionData {
    user: UserPayload | undefined;
    isToken: boolean;
    isAdmin: boolean;
  }
}
