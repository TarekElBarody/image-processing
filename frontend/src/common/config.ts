const env = process.env.NODE_ENV as string | 'development';
let url = '';
if (env === 'test') {
    url = 'https://localhost:8443/api/';
} else if (env === 'development') {
    url = 'https://localhost:8443/api/';
} else {
    url = 'https://dw1lw2eo3fpol.cloudfront.net/api/';
}
export const API_URL = url;
