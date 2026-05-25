import { useEffect } from 'react';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const useNotificationPermission = () => {
    useEffect(() => {
        const request = async () => {
            const settings = await notifee.requestPermission();

            switch (settings.authorizationStatus) {
                case AuthorizationStatus.AUTHORIZED:
                    console.log('Notification permission granted');
                    break;
                case AuthorizationStatus.PROVISIONAL:
                    console.log('Notification permission provisional (iOS)');
                    break;
                case AuthorizationStatus.DENIED:
                    console.log('Notification permission denied');
                    break;
            }
        };

        request();
    }, []);
};
