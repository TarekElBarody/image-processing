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

class AuthService {
    login(email: string, password: string) {
        return axios
            .post(API_URL + 'users/auth', {
                email,
                password
            })
            .then((response) => {
                if (response.data.token && response.data.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.data));
                    localStorage.setItem('token', response.data.token);
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    register(user: UserInsert) {
        return axios.post(API_URL + 'users/add', {
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
}

export default new AuthService();
