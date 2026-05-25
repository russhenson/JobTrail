import axios from 'axios';
import Config from 'react-native-config';
import { Platform } from 'react-native';

export const api = axios.create({
    baseURL: Platform.OS === 'android' ? 'http://10.0.2.2:5050' : Config.API_URL, // TODO: change later
    headers: {
        'Content-Type': 'application/json',
    },
});
