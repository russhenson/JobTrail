import axios from 'axios';
// import Config from 'react-native-config';
import { AuthStorage } from './authStorage';

export const api = axios.create({
    baseURL: 'jobtrail-production-f242.up.railway.app',
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
