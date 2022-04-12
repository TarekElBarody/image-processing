import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/config';

class UserService {
    async checkToken() {
        const response = await axios.get(API_URL + 'users/check', { headers: authHeader().auth });
        return response;
    }
}

export default new UserService();
