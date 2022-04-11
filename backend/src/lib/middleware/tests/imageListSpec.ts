import supertest from 'supertest';
import path from 'path';
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

// test Image Process without SSL enabled
describe('Test Getting Full Image List (imageListSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();

    const testImageFile = 'for_test_jasmine_image_dont_deleted.jpg';
    const testImagePath = path.resolve(`./tmp/${testImageFile}`);

    if (process.env.SECURE == '1') {
      await requestHttps
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .trustLocalhost()
        .key(sslCert.key)
        .cert(sslCert.cert)
        .attach('photo', testImagePath);
    } else {
      await requestHttp
        .post('/api/images/upload')
        .set('Authorization', `Bearer ${adminSignedToken.token}`)
        .attach('photo', testImagePath);
    }
  });

  it('Should Generated Admin Token Success', async (): Promise<void> => {
    expect(adminSignedToken.success).toBeTruthy();
  });

  it('Should Return JSON List for all full images', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttp
      .get('/api/images/list')
      .set('Authorization', `Bearer ${adminSignedToken.token}`);

    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body.success).toBeTrue();
    expect(res.body.image_count).toBeGreaterThan(0);
    expect(res.body.images).toBeDefined();
  });

  it('Should SSL Return JSON List for all full images', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttps
      .get('/api/images/list')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert);

    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body.success).toBeTrue();
    expect(res.body.image_count).toBeGreaterThan(0);
    expect(res.body.images).toBeDefined();
  });
});
