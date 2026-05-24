import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Home: undefined;
    Form: { jobId?: string } | undefined;
};

export type ScreenConfig<T extends string = string> = {
    name: T;
    component: React.ComponentType<any>;
    options?: NativeStackNavigationOptions | ((props: any) => NativeStackNavigationOptions);
};
