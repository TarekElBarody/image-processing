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
describe('Test Getting Full Image List (imageListSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();
  });

  beforeEach(async (): Promise<void> => {
    await prepTestImage();
  });

  it('Should Generated Admin Token Success', async (): Promise<void> => {
    expect(adminSignedToken.success).toBeTruthy();
  });

  it('Should Return JSON List for all full images', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttp
      .get('/api/images/list')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({ noConsole: 1 })
      .query({ jasmine: '' });
    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body.images).toContain({
      filename: 'for_test_jasmine_image_dont_deleted',
      format: 'jpg'
    });
  });

  it('Should SSL Return JSON List for all full images', async (): Promise<void> => {
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
