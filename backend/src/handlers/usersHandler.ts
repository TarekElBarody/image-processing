import express, { Request, Response } from 'express';
import logger from '../lib/functions/logger';
import UserStore from '../models/userStore';
import { dateNow, getRsUser } from '../lib/functions/general';
import { hashVerify, createToken } from '../lib/functions/hash';
import dotenv from 'dotenv';
import verifyTokens from '../lib/middleware/verifyTokens';
import {
  User,
  UserUpdate,
  UpdatePass,
  ResUser,
  TokenData
} from '../types/index';

const store = new UserStore();
dotenv.config();
const userLog = new logger('userLog');
const userAccess = new logger('userAccess');

const index = async (req: Request, res: Response): Promise<void> => {
  // check if user have admin access
  if (req.session.user && req.session.isToken === true) {
    try {
      // set userAccess logger
      userAccess.start(); // start the log time function event

      const users = await store.index();
      res.json(users);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to log in to you dashboard first to can call this'
    });
  }

  return;
};

const create = async (req: Request, res: Response): Promise<void> => {
  let role = 3;
  if (req.session.user && req.session.isToken === true) {
    role = req.body.role as number | 3;
  }

  try {
    // set userAccess logger
    userAccess.start(); // start the log time function event
    let validate = true;
    const user: User = {
      first_name: String(req.body.first_name),
      last_name: String(req.body.last_name),
      birthday: new Date('1990-04-01'),
      email: String(req.body.email),
      password: String(req.body.password),
      mobile: String(req.body.mobile),
      role: role | 3,
      created: dateNow()
    };

    if (!user.first_name || user.first_name.length < 2) validate = false;

    if (!user.last_name || user.last_name.length < 2) validate = false;

    if (
      !user.email ||
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        user.email
      ) != true
    )
      validate = false;

    if (!user.password || user.password.length < 6) validate = false;

    if (!user.mobile || /^\d{11,15}$/.test(user.mobile) != true)
      validate = false;

    if (validate) {
      const users = await store.create(user);
      const resUser: ResUser = await getRsUser(users);
      res.status(201).json(resUser);
    } else {
      res.status(401).json({
        success: false,
        message: 'Data is missing or have some error'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cannot process you request contact your administrator ' + error
    });
  }
  return;
};

const show = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  const id = req.params.id as string;
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.id === id)
  ) {
    try {
      // set userAccess logger
      userAccess.start(); // start the log time function event

      const users = await store.show(id);
      res.json(users);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message:
        'you have to provide a token with right permission to can access this function'
    });
  }

  return;
};

const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true || req.session.user.id === id)
  ) {
    try {
      // set userAccess logger
      userAccess.start(); // start the log time function event
      let validate = true;
      const user: UserUpdate = {
        id: id,
        first_name: req.body.first_name
          ? String(req.body.first_name)
          : undefined,
        last_name: req.body.last_name ? String(req.body.last_name) : undefined,
        birthday: req.body.birthday ? new Date(req.body.birthday) : undefined,
        email: req.body.email ? String(req.body.email) : undefined,
        mobile: req.body.mobile ? String(req.body.mobile) : undefined
      };

      if (user.first_name && user.first_name.length < 2) validate = false;

      if (user.last_name && user.last_name.length < 2) validate = false;

      if (
        user.email &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          user.email
        ) != true
      )
        validate = false;

      if (user.mobile && /^\d{11,15}$/.test(user.mobile) != true)
        validate = false;

      if (validate) {
        const users = await store.update(user);
        const resUser: ResUser = await getRsUser(users);
        res.json(resUser);
      } else {
        res.status(401).json({
          success: false,
          message: 'Data is missing or have some error'
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  if (req.session.user && req.session.isToken === true) {
    try {
      // set userAccess logger
      userAccess.start(); // start the log time function event
      const userID = String(req.params.id);

      const users = await store.delete(userID);
      const resUser: ResUser = await getRsUser(users);
      res.json(resUser);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const generateAuthToken = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const email = req.body.email as string;
    const password = req.body.password as string;
    const user = await store.showByEmail(email);

    // create new crypt class
    const hash = user.password;
    const verify = await hashVerify(password, hash);
    // check if password is correct

    if (verify.valid) {
      const tokenData: TokenData = {
        exp: Date.now() / 1000 + 60 * 60,
        data: {
          id: user.id as string,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      };
      const signedToken = await createToken(tokenData);
      // log the login to userAccess
      res.json(signedToken);
      userLog.log(`User Generated Token in successfully  with email: ${email}`);
    } else {
      // if not match destroy the session and direct back with error
      res.json({
        success: false,
        err: 'cannot Create Token Email Or Password Not Valid',
        data: undefined,
        token: ''
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cannot process you request contact your administrator ' + error
    });
  }

  return;
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  // check if user logged in
  if (
    req.session.user &&
    req.session.isToken === true &&
    (req.session.isAdmin === true ||
      req.session.user.id === String(req.params.id))
  ) {
    try {
      // set userAccess logger
      userAccess.start(); // start the log time function event
      let validate = true;
      const updatePass: UpdatePass = {
        id: String(req.params.id),
        currentPassword: String(req.body.currentPassword),
        newPassword: String(req.body.newPassword),
        confirmNew: String(req.body.confirmNew)
      };

      if (!updatePass.id) validate = false;

      const hash = await store.password(updatePass.id as string);
      // create new crypt class

      const verify = await hashVerify(updatePass.currentPassword, hash);

      if (!updatePass.currentPassword || !verify.valid) validate = false;

      if (
        !updatePass.newPassword ||
        updatePass.newPassword != updatePass.confirmNew ||
        updatePass.newPassword.length < 6
      )
        validate = false;

      if (validate) {
        const userUpdate: UserUpdate = {
          id: updatePass.id as string,
          password: updatePass.newPassword
        };
        const users = await store.update(userUpdate);
        const resUser: ResUser = await getRsUser(users);
        res.json(resUser);
      } else {
        res.status(401).json({
          success: false,
          message: 'Data is missing or have some error'
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const checkAuthToken = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  if (req.session.user && req.session.isToken === true) {
    try {
      // set userAccess logger
      const tokenData = {
        success: true,
        data: {
          id: req.session.user.id as string,
          first_name: req.session.user.first_name,
          last_name: req.session.user.last_name,
          role: req.session.user.role
        }
      };
      res.json(tokenData);
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Cannot process you request contact your administrator ' + error
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      success: false,
      message: 'you have to provide token first to can call this function'
    });
  }

  return;
};

const usersHandler = (apiRoute: express.Router) => {
  apiRoute.get('/users', verifyTokens, index);
  apiRoute.post('/users/auth', generateAuthToken);
  apiRoute.get('/users/check', verifyTokens, checkAuthToken);
  apiRoute.post('/users/add', create);
  apiRoute.get('/users/:id', verifyTokens, show);
  apiRoute.put('/users/:id', verifyTokens, update);
  apiRoute.delete('/users/:id', verifyTokens, deleteUser);
  apiRoute.put('/users/:id/reset', verifyTokens, resetPassword);
};

export default usersHandler;
