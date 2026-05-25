import { JobFormScreen, JobListScreen, LoginScreen, WelcomeScreen, SignUpScreen } from '@_screens';
import { ScreenConfig } from '@_types/navigation';

export const screens: ScreenConfig[] = [
    {
        name: 'Home',
        component: JobListScreen,
        options: { headerShown: false },
    },
    {
        name: 'Form',
        component: JobFormScreen,
        options: { headerShown: false },
    },
];

export const authScreens: ScreenConfig[] = [
    {
        name: 'Welcome',
        component: WelcomeScreen,
        options: { headerShown: false },
    },
    {
        name: 'Login',
        component: LoginScreen,
        options: { headerShown: false },
    },
    {
        name: 'SignUp',
        component: SignUpScreen,
        options: { headerShown: false },
    },
];
