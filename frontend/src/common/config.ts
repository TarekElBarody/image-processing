const env = process.env.NODE_ENV as string | 'development';
let url = '';
if (env === 'test') {
    url = 'https://localhost:8443/api/';
} else if (env === 'development') {
    url = 'https://localhost:8443/api/';
} else {
    url = 'https://eb.img-api.tk/api/';
}
export const API_URL = url;
