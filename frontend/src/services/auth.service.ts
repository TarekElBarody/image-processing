import axios from 'axios';
import { API_URL } from '../common/config';
export type UserInsert = {
    first_name: string;
    last_name: string;
    birthday: Date;
    email: string;
    password: string;
    mobile: string;
};

const env = process.env.NODE_ENV as string | 'development';
class AuthService {
    async login(email: string, password: string) {
        if (env === 'test') {
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: 'd9006367-7cf0-4300-ad8f-e0b0d35e8a3a',
                    first_name: 'Admin',
                    last_name: 'Admin',
                    role: 1
                })
            );
            localStorage.setItem('token', 'test_token_processed');
            localStorage.setItem('isLoggedIn', 'true');
            return {
                success: true,
                err: {},
                data: {
                    exp: 1649812609.493,
                    data: {
                        id: 'd9006367-7cf0-4300-ad8f-e0b0d35e8a3a',
                        first_name: 'Admin',
                        last_name: 'Admin',
                        role: 1
                    }
                },
                token: 'test_token_processed'
            };
        }
        return axios
            .post(API_URL + 'users/auth', {
                email,
                password
            })
            .then((response) => {
                if (response.data.token && response.data.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.data));
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('isLoggedIn', 'true');
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
    }

    async register(user: UserInsert) {
        return await axios.post(API_URL + 'users/add', {
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday,
            email: user.email,
            password: user.password,
            mobile: user.mobile
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);

        return null;
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token) return token;

        return '';
    }

    getIsLoggedIn() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) return isLoggedIn;

        return '';
    }
}

export default new AuthService();
