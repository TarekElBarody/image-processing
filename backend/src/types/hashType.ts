import { UserRoles } from './userType';

export type HashPassword = {
  hash: string;
  err: string;
};

export type HashVerify = {
  valid: boolean;
  err: string;
};

export type UserPayload = {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRoles;
};

export type TokenData = {
  exp: number;
  data: UserPayload | undefined;
};

export type SignedToken = {
  success: boolean;
  err: {
    name?: string;
    message?: string;
    expiredAt?: string;
  };
  token: string;
  data: TokenData | undefined;
};
