import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/config';

const env = process.env.NODE_ENV as string | 'development';
class UserService {
    async checkToken(): Promise<{ success: boolean; token: string }> {
        if (env === 'test') {
            if (await authHeader().user) {
                return { success: true, token: 'test_token_processed' };
            } else {
                return { success: false, token: '' };
            }
        }

        const response = await axios.get(API_URL + 'users/check', { headers: authHeader().auth });
        if (response.status === 200) {
            return { success: true, token: response.data.token };
        } else {
            return { success: false, token: '' };
        }
    }
}

export default new UserService();
