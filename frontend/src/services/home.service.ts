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

const env = process.env.NODE_ENV as string | 'development';

class HomeService {
    async getImagesCount(): Promise<ImagesCount> {
        if (env === 'test') {
            return {
                fullCount: 2,
                thumbCount: 12
            };
        }
        try {
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
        } catch (error) {
            return {
                fullCount: 0,
                thumbCount: 0
            };
        }
        
    }

    async getImagesHistory(): Promise<ImageHistory[]> {
        if (env === 'test') {
            return [
                {
                    num: 1,
                    time: 'Mon Apr 11 2022 21:11:11',
                    duration: '6ms',
                    process: 'Output all thumbs for image name imageName.jpeg'
                },
                {
                    num: 2,
                    time: 'Mon Apr 11 2022 21:11:11',
                    duration: '1778ms',
                    process: 'Success processing image & Fetched as JSON for image imageName.jpeg  to format jpeg with width 600 & height 338'
                }
            ];
        }
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
        if (env === 'test') {
            return [
                {
                    id: 'Image_ID_1',
                    user_id: 'User_ID_1',
                    url: 'https://localhost:8443/api/images/ImageName.jpeg',
                    width: 1920,
                    height: 1080,
                    created: new Date(),
                    access: 2
                },
                {
                    id: 'Image_ID_2',
                    user_id: 'User_ID_1',
                    url: 'https://localhost:8443/api/images/ImageName.jpeg',
                    width: 3840,
                    height: 2160,
                    created: new Date(),
                    access: 2
                }
            ];
        }
        try {
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
        } catch (error) {
            return [];
        }
        
    }
}

export default new HomeService();
