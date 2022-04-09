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
describe('Test Deleting Original Image From API (imageDeleteSelectedSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();
  });

  beforeEach(async (): Promise<void> => {
    await prepTestImage();
  });

  it('Should Delete a Full Image API', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttp
      .post('/api/images/delete/selected')
      .query({ noConsole: 1 })
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .send({
        selected: ['for_test_jasmine_image_dont_deleted.jpg'],
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
      message: 'All selected images has been deleted successfully'
    });
  });

  it('Should SSL Delete a Full Image API', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb

    const res = await requestHttps
      .post('/api/images/delete/selected')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({ noConsole: 1 })
      .send({
        selected: ['for_test_jasmine_image_dont_deleted.jpg'],
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
      message: 'All selected images has been deleted successfully'
    });
  });
});
