import axios from 'axios';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import { AuthStorage } from './authStorage';

// Android emulator uses 10.0.2.2 to reach localhost
const BASE_URL =
    Platform.OS === 'android'
        ? 'http://10.0.2.2:5050'
        : Config.API_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// attach token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await AuthStorage.getToken();

        if (token && config.headers?.set) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// auto logout
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AuthStorage.clear();
        }

        return Promise.reject(error);
    }
);