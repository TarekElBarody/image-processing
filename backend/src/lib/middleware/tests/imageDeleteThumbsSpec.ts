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
describe('Test Clear Thumb Images API (imageDeleteThumbsSpec)', async (): Promise<void> => {
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
    await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: 'for_test_jasmine_image_dont_deleted',
        width: 200,
        height: 200,
        ext: 'jpg'
      });
    await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: 'for_test_jasmine_image_dont_deleted',
        width: 100,
        height: 100,
        ext: 'jpg'
      });
  });

  it('Should Clear Thumb Images', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttp
      .post('/api/images/delete/thumbs')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({ noConsole: 1 })
      .send({
        jasmine: ''
      });
    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body).toEqual({
      success: true,
      message: 'Cached images deleted from the disk successfully'
    });
  });

  it('Should SSL Clear Thumb Images', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttps
      .post('/api/images/delete/thumbs')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({ noConsole: 1 })
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .send({
        jasmine: ''
      });
    // check if the status 200 given back with image content type
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the thumb file is created
    expect(res.body).toEqual({
      success: true,
      message: 'Cached images deleted from the disk successfully'
    });
  });
});
