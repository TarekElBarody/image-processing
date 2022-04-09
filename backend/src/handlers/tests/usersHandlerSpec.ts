import supertest from 'supertest';
import dotenv from 'dotenv';
import { httpApp, httpsApp, sslCert } from '../../server';
import {
  User,
  UserAll,
  UserRoles,
  ResUser,
  UserUpdate,
  TokenData,
  SignedToken,
  UpdatePass
} from '../../types/index';
import { dateNow } from '../../lib/functions/general';
import UserStore from '../../models/userStore';
import { createToken } from '../../lib/functions/hash';

dotenv.config();
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

const created = dateNow();
const store = new UserStore();
let resUser: UserAll;
let tokenData: TokenData;
let adminSignedToken: SignedToken;
let userSignedToken: SignedToken;

describe('Test Users Handlers EndPoint (usersHandlerSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    await store.truncate();
    const admin: User = {
      first_name: 'AdminFName',
      last_name: 'AdminLName',
      birthday: new Date('1990-04-01'),
      email: 'admin@admin.com',
      password: '987654321',
      mobile: '01298654374',
      role: UserRoles.Admin,
      created: created
    };
    const res = await store.create(admin);

    tokenData = {
      exp: created.getTime() + 60 * 60,
      data: {
        id: res.id as string,
        first_name: res.first_name,
        last_name: res.last_name,
        role: res.role
      }
    };
    adminSignedToken = await createToken(tokenData);
  });

  it('Should Generated Admin Token Success', async (): Promise<void> => {
    expect(adminSignedToken.success).toBeTruthy();
  });

  it('Should Endpoint Create New Users', async (): Promise<void> => {
    const user = {
      first_name: 'FirstName',
      last_name: 'LastName',
      birthday: new Date('1990-04-01'),
      email: 'handler@example.com',
      password: '54654645654',
      mobile: '01056975213',
      role: UserRoles.User
    };

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post('/api/users/add')
        .send(user)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.post('/api/users/add').send(user);
    }
    const userRes = res.body as ResUser;
    resUser = {
      id: userRes.id,
      first_name: userRes.first_name,
      last_name: userRes.last_name,
      birthday: userRes.birthday,
      email: userRes.email,
      mobile: userRes.mobile,
      role: userRes.role,
      created: userRes.created,
      images_count: 0,
      thumbs_count: 0,
      total_visit: 0,
      process_duration: 0
    };

    expect(res.status).toBe(201);
    expect(userRes.first_name).toEqual(user.first_name);
  });

  it('Should Endpoint Get Auth Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post('/api/users/auth')
        .send({ email: resUser.email, password: '54654645654' })
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .post('/api/users/auth')
        .send({ email: resUser.email, password: '54654645654' });
    }
    userSignedToken = res.body as SignedToken;

    expect(res.status).toBe(200);
    expect(userSignedToken.success).toBeTruthy();
  });

  it('Should Endpoint Get User Data', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/users/' + resUser.id)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/users/' + resUser.id)
        .set('Authorization', `Bearer ${userSignedToken.token}`);
    }
    const user = res.body as UserAll;

    expect(res.status).toBe(200);
    expect(user).toEqual(resUser);
  });

  it('Should Endpoint Admin Get All Users', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/users')
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .get('/api/users')
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }
    const users = res.body as ResUser[];

    expect(res.status).toBe(200);
    expect(users).toContain(resUser);
  });

  it('Should Endpoint Update Users Data', async (): Promise<void> => {
    const updateUser: UserUpdate = {
      id: resUser.id,
      email: 'handler2@example.com'
    };
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put('/api/users/' + resUser.id)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .send(updateUser)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put('/api/users/' + resUser.id)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .send(updateUser);
    }
    const user = res.body as ResUser;

    expect(res.status).toBe(200);

    expect(user.email).toEqual('handler2@example.com');
  });

  it('Should Endpoint Reset User Password', async (): Promise<void> => {
    const updatePass: UpdatePass = {
      currentPassword: '54654645654',
      newPassword: '002020202022',
      confirmNew: '002020202022'
    };
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .put(`/api/users/${resUser.id}/reset`)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .send(updatePass)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .put(`/api/users/${resUser.id}/reset`)
        .set('Authorization', `Bearer ${userSignedToken.token}`)
        .send(updatePass);
    }
    const user = res.body as ResUser;

    expect(res.status).toBe(200);

    expect(user.id).toEqual(resUser.id);
  });

  it('Should Endpoint Delete Users Data', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .delete('/api/users/' + resUser.id)
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp
        .delete('/api/users/' + resUser.id)
        .set('Authorization', `Bearer ${adminSignedToken.token}`);
    }
    const user = res.body as ResUser;

    expect(res.status).toBe(200);

    expect(user.id).toEqual(resUser.id);
  });

  it('Should Endpoint Error User Require Token', async (): Promise<void> => {
    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .get('/api/users/' + resUser.id)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert);
    } else {
      res = await requestHttp.get('/api/users/' + resUser.id);
    }

    expect(res.status).toBe(401);
  });
});
