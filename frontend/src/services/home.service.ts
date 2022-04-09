import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../common/config';
import AuthService from './auth.service';

export type ImagesCount = {
    fullCount: number;
    thumbCount: number;
};

export type ImageHistory = {
    num: number;
    time: string;
    duration: string;
    process: string;
};

export type ImageList = {
    id: string;
    user_id: string;
    url: string;
    width: number;
    height: number;
    created: Date;
    access: number;
};

class HomeService {
    async getImagesCount(): Promise<ImagesCount> {
        const response = await axios.get(API_URL + 'images/count', { headers: authHeader().auth });
        if (response.status === 401) {
            AuthService.logout();
            return {
                fullCount: 0,
                thumbCount: 0
            };
        }
        if (response.data.fullCount && response.data.thumbCount) {
            return {
                fullCount: response.data.fullCount,
                thumbCount: response.data.thumbCount
            };
        } else {
            return {
                fullCount: 0,
                thumbCount: 0
            };
        }
    }

    async getImagesHistory(): Promise<ImageHistory[]> {
        const response = await axios.get(API_URL + 'images/history', { headers: authHeader().auth });
        if (response.status === 401) {
            AuthService.logout();
            return [];
        }
        if (response.status === 200) {
            return response.data.data;
        } else {
            return [];
        }
    }

    async getImagesList(): Promise<ImageList[]> {
        const response = await axios.get(API_URL + 'images/list', { headers: authHeader().auth });
        if (response.status === 401) {
            AuthService.logout();
            return [];
        }
        if (response.status === 200) {
            return response.data.images;
        } else {
            return [];
        }
    }
}

export default new HomeService();
