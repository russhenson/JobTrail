import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { AuthStorage } from '@_utils';

export default function RootNavigator() {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    const checkAuth = async () => {
        const storedToken = await AuthStorage.getToken();
        setToken(storedToken);
    };

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setLoading(false);
        };

        init();
    }, []);

    // re-check auth when app comes back to foreground
    useEffect(() => {
        const interval = setInterval(() => {
            checkAuth();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return <NavigationContainer>{token ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
