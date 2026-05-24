import { JobFormScreen, JobListScreen, LoginScreen, WelcomeScreen, SignUpScreen } from '@_screens';
import { ScreenConfig } from '@_types/navigation';

export const screens: ScreenConfig[] = [
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
    {
        name: 'Home',
        component: JobListScreen,
        options: {
            title: 'JobTrail',
            headerTitleAlign: 'center',
        },
    },
    {
        name: 'Form',
        component: JobFormScreen,
        options: ({ route }: any) => ({
            title: route.params?.jobId ? 'Edit Job' : 'Add Job',
            headerTitleAlign: 'center',
        }),
    },
];
