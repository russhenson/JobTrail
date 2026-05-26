import AsyncStorage from '@react-native-async-storage/async-storage';

// Saves and reads the auth token + user info from the device's local storage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthStorage = {
    async saveSession(data: { token: string; userId: string; username: string }) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    },

    async getToken() {
        return await AsyncStorage.getItem(TOKEN_KEY);
    },

    async getUser() {
        const user = await AsyncStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    async clear() {
        await AsyncStorage.removeMany([TOKEN_KEY, USER_KEY]);
    },
};
