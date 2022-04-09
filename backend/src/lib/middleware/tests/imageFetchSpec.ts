import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import { httpApp, httpsApp, sslCert } from '../../../server';
import prepTestImage from '../../helpers/prepTestImage';
import { SignedToken } from '../../../types/index';
import createTestUser from '../../functions/createTestUser';
// prepare server for testing
const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

let adminSignedToken: SignedToken;
// test Image Process without SSL enabled
describe('Test Image Processing API (imageFetchSpec)', async (): Promise<void> => {
  beforeAll(async (): Promise<void> => {
    adminSignedToken = await createTestUser();
  });
  // start jasmine spay for console log
  const testThumbName = 'for_test_jasmine_image_dont_deleted';
  const testThumbFile = path.resolve(
    `./images/thumb/${testThumbName}_385_385_cover.jpg`
  );

  beforeEach(async (): Promise<void> => {
    await prepTestImage();
  });

  it('Should generate thumb file for 1st time', async (): Promise<void> => {
    // test API with the same parameters to generate the test thumb
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        width: 385,
        height: 385,
        ext: 'jpg'
      });
    // check if the status 200 given back with image content type

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual('image/jpeg');

    // check if the thumb file is created
    expect(fs.existsSync(testThumbFile)).toBe(true);
  });

  it('Should Process & Serve Cached thumb file', async (): Promise<void> => {
    await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        width: 385,
        height: 385,
        ext: 'jpg'
      });
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        width: 385,
        height: 385,
        ext: 'jpg'
      });

    // check if the cached thumb served to api & capture the console log
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual('image/jpeg');
    expect(res.headers['last-modified']).toBeLessThan(res.headers['date']);
  });

  it('Should return Error wrong Format', async (): Promise<void> => {
    // test api with wrong parameter format to throw an error
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        width: 385,
        height: 385,
        ext: 'jpg',
        format: 'jjjjj'
      });

    // check if the api server response
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide an error message
    expect(res.body).toEqual({
      message: `Error Processing Image Resize Error: Expected one of: heic, heif, avif, jpeg, jpg, png, raw, tiff, tif, webp, gif, jp2, jpx, j2k, j2c for format but received jjjjj of type string`
    });
  });

  it('Should return Error No file name provided', async (): Promise<void> => {
    // test api without provide an image name parameter
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        width: 385,
        height: 385,
        ext: 'jpg'
      });

    // check if the api returned json data
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide an error message
    expect(res.body).toEqual({
      message: 'Error processing image No file name provided'
    });
  });

  it('Should return Requested File name Not exist', async (): Promise<void> => {
    // test api without provide an image name parameter
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: 'blah_blah_blah_blah_blah_blah',
        width: 385,
        height: 385,
        ext: 'jpg'
      });

    // check if the api returned json data
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide an error message
    expect(res.body).toEqual({
      message: 'Requested File name Not exist !.'
    });
  });

  it('Should return JSON output for image thumb', async (): Promise<void> => {
    // test api set out parameter to json
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        width: 385,
        height: 385,
        ext: 'jpg',
        out: 'json'
      });

    // check if the api respond and returned json data
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide the image properties
    expect(res.body).toEqual({
      original: `/images/full/${testThumbName}.jpg`,
      thumbFile: `/images/thumb/${testThumbName}_385_385_cover.jpg`,
      width: 385,
      height: 385,
      format: 'jpeg'
    });
  });

  it('Should return JSON to all thumb for original image', async (): Promise<void> => {
    // test api set out parameter to all
    const res = await requestHttp
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        ext: 'jpg',
        out: 'all'
      });

    // check if the api respond and returned json data
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );

    // check if the json data provide the image properties
    expect(res.body.original).toEqual(`/images/full/${testThumbName}.jpg`);
  });

  it('Should SSL Enabled for Image Processed', async (): Promise<void> => {
    // test api with SSL server
    const res = await requestHttps
      .get('/api/images')
      .set('Authorization', `Bearer ${adminSignedToken.token}`)
      .query({
        name: testThumbName,
        width: 385,
        height: 385,
        ext: 'jpg'
      })
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert);

    // check if the status 200 or 302 given back with image content type
    expect([200]).toContain(res.status);
    expect(res.headers['content-type']).toEqual('image/jpeg');

    // check if the thumb file is created
    expect(fs.existsSync(testThumbFile)).toBe(true);
  });
});
