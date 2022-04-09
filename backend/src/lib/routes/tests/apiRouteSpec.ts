import supertest from 'supertest';
import { httpApp, httpsApp, sslCert } from '../../../server';

const requestHttp = supertest(httpApp);
const requestHttps = supertest(httpsApp);

describe('Test API Endpoints Access (apiRouteSpec)', () => {
  it('Should Endpoint is Responding 200 With Json', async (): Promise<void> => {
    const res = await requestHttp.get('/api').query({ noConsole: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message:
        'This is the API main page .. please read the API documentation for more help'
    });
  });

  it('Should API Return error 404 Not found for not controlled endpoint', async (): Promise<void> => {
    const res = await requestHttp
      .get('/api/WrongStatement')
      .query({ noConsole: 1 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: 'API Page Not Found !.'
    });
  });

  it('Should SSL Enabled for Endpoint', async (): Promise<void> => {
    const res = await requestHttps
      .get('/api')
      .query({ noConsole: 1 })
      .trustLocalhost()
      .key(sslCert.key)
      .cert(sslCert.cert);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message:
        'This is the API main page .. please read the API documentation for more help'
    });
  });
});
