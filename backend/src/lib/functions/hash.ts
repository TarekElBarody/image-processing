import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  HashPassword,
  HashVerify,
  TokenData,
  SignedToken
} from '../../types/index';
import { sslCert } from '../../lib/app';

dotenv.config();

export async function hashPassword(password: string): Promise<HashPassword> {
  try {
    const pepper = process.env.PEPPER ? String(process.env.PEPPER) : '';
    const round = process.env.ROUND ? Number(process.env.ROUND) : 10;
    let waitForHash = '';
    await bcryptjs.hash(password + pepper, round).then((hash) => {
      waitForHash = hash;
    });
    return { hash: waitForHash, err: '' };
  } catch (error) {
    return { hash: '', err: error as string };
  }
}

export async function hashVerify(
  password: string,
  hash: string
): Promise<HashVerify> {
  try {
    const pepper = process.env.PEPPER || '';
    const checkPass = await bcryptjs.compare(password + pepper, hash);
    return { valid: checkPass, err: '' };
  } catch (error) {
    return { valid: false, err: error as string };
  }
}

export async function createToken(data: TokenData): Promise<SignedToken> {
  try {
    const token = jwt.sign(data, sslCert.key);
    if (jwt.verify(token, sslCert.key)) {
      return {
        success: true,
        err: {},
        data: data,
        token: token
      };
    } else {
      throw Error('Cannot Create Token');
    }
  } catch (error) {
    return {
      success: false,
      err: error as object,
      data: undefined,
      token: ''
    };
  }
}

export async function verifyToken(token: string): Promise<SignedToken> {
  try {
    const decode = jwt.verify(token, sslCert.key) as JwtPayload as TokenData;
    if (decode) {
      return {
        success: true,
        err: {},
        data: decode,
        token: token
      };
    } else {
      throw Error('Cannot Verify Token');
    }
  } catch (error) {
    return {
      success: false,
      err: error as object,
      data: undefined,
      token: ''
    };
  }
}
