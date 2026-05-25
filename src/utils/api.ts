import axios from 'axios';
import Config from 'react-native-config';
import { AuthStorage } from './authStorage';

export const api = axios.create({
    baseURL: Config.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// attach token to every request
api.interceptors.request.use(
    async config => {
        const token = await AuthStorage.getToken();

        if (token && config.headers?.set) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    error => Promise.reject(error),
);

// auto logout
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            await AuthStorage.clear();
        }

        return Promise.reject(error);
    },
);
