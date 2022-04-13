import supertest from 'supertest';
import path from 'path';
import sharp from 'sharp';
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
let imageFileName = '';
let url = '';
// test Image Process without SSL enabled
describe('Test Image Processing API (imageFetchSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();

    const testImageFile = 'for_test_jasmine_image_dont_deleted.jpg';
    const testImagePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'tmp',
      testImageFile
    );

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

    url = res.body.image as string;
    console.log(url);
    imageFileName = url.split('/').pop() as string;
    console.log(imageFileName);
  });
  // start jasmine spay for console log

  it('Should generate thumb file for 1st time', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb
    const res = await requestHttps
      .get('/api/images/' + imageFileName)
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        width: 385,
        height: 385
      });
    // check if the status 200 given back with image content type

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual('image/jpeg');

    // check if the thumb file is created
    const info = await sharp(res.body).metadata();

    expect(info.width).toEqual(385);
  });

  it('Should Process & Serve Cached thumb file', async (): Promise<void> => {
    const res = await requestHttps
      .get('/api/images/' + imageFileName)
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        width: 385,
        height: 385
      });

    // check if the cached thumb served to api & capture the console log
    expect(res.status).toBe(302);
    expect(res.headers['content-type']).toEqual('image/jpeg');
    expect(res.headers['last-modified']).toBeLessThan(res.headers['date']);
  });

  it('Should return Error wrong Format', async (): Promise<void> => {
    // test api with wrong parameter format to throw an error
    const res = await requestHttps
      .get('/api/images/' + imageFileName)
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        width: 385,
        height: 385,
        format: 'jjjjj'
      });

    // check if the api server response
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide an error message
    expect(res.body).toEqual({
      message: `Error Processing Image for Requested Data`
    });
  });

  it('Should return Error No file name provided', async (): Promise<void> => {
    // test api without provide an image name parameter
    const res = await requestHttps
      .get('/api/images/')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        width: 385,
        height: 385
      });

    // check if the api returned json data
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide an error message
    expect(res.body).toEqual({
      message: 'API Page Not Found !.'
    });
  });

  it('Should return Requested File name Not exist', async (): Promise<void> => {
    // test api without provide an image name parameter
    const res = await requestHttps
      .get('/api/images/blah_blah_blah.jpg')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        width: 385,
        height: 385
      });

    // check if the api returned json data
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide an error message
    expect(res.body).toEqual({
      message: `Error processing image TypeError: Cannot read properties of undefined (reading 'id')`
    });
  });

  it('Should return JSON output for image thumb', async (): Promise<void> => {
    // test api set out parameter to json
    const res = await requestHttps
      .get('/api/images/' + imageFileName)
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        out: 'json'
      });

    // check if the api respond and returned json data
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    // check if the json data provide the image properties
    expect(res.body.url).toBe(url);
    expect(res.body.thumb).toBeDefined();
    expect(res.body.width).toBe(600);
    expect(res.body.height).toBe(338);
  });

  it('Should return JSON to all thumb for original image', async (): Promise<void> => {
    // test api set out parameter to all
    const res = await requestHttps
      .get('/api/images/' + imageFileName)
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert)
      .query({
        out: 'all'
      });

    // check if the api respond and returned json data
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide the image properties
    expect(res.body.url).toEqual(url);
    expect(res.body.thumbs).toBeDefined();
    expect(res.body.width).toBe(600);
    expect(res.body.height).toBe(338);
  });
});
