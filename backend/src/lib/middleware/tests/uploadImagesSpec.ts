import path from 'path';
import supertest from 'supertest';
import { httpApp, httpsApp, sslCert } from '../../../server';
import { SignedToken } from '../../../types/index';
import createTestUser from '../../functions/createTestUser';
import dotenv from 'dotenv';

dotenv.config();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

let adminSignedToken: SignedToken;

describe('Test Upload Image API (uploadImagesSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();
  });

  const testImageFile = 'for_test_jasmine_image_dont_deleted.jpg';
  const testImagePath = path.resolve(`./tmp/${testImageFile}`);

  it('Should Upload Image Successfully', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    let res: supertest.Response;
    if (process.env.SECURE == '1') {
      res = await requestHttps
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert)
        .attach('photo', testImagePath);
    } else {
      res = await requestHttp
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .attach('photo', testImagePath);
    }
    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created

    expect(res.body.status).toEqual('success');

    expect(res.body.image).toBeDefined();
  });
});
