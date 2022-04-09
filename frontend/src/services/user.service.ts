import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/config';

class UserService {
    checkToken() {
        return axios.get(API_URL + 'users/check', { headers: authHeader().auth });
    }
}

export default new UserService();
