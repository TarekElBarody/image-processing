import supertest from 'supertest';
import { httpApp, httpsApp, sslCert } from '../../../server';
import prepTestImage from '../../helpers/prepTestImage';
import { SignedToken } from '../../../types/index';
import createTestUser from '../../functions/createTestUser';
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

let adminSignedToken: SignedToken;
// test Image Process without SSL enabled
describe('Test Get Image Processing History API (imageHistorySpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();
  });

  beforeEach(async (): Promise<void> => {
    await prepTestImage();
    await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: 'for_test_jasmine_image_dont_deleted',
        width: 385,
        height: 385,
        ext: 'jpg'
      });
  });

  it('Should Get Image Processing History List', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttp
      .get('/api/images/history')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({ noConsole: 1 })
      .query({ jasmine: '' });
    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body.data).toBeDefined();
  });

  it('Should SSL Get Image Processing History List', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttps
      .get('/api/images/history')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({ noConsole: 1 })
      .query({ jasmine: '' });
    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body.data).toBeDefined();
  });
});
