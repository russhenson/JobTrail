import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Welcome: undefined;
    Login: { registrationSuccess?: boolean } | undefined;
    Home: undefined;
    Form:
        | {
              id: string;
              job: Job;
          }
        | undefined;
    SignUp: undefined;
};

export type ScreenConfig<T extends string = string> = {
    name: T;
    component: React.ComponentType<any>;
    options?: NativeStackNavigationOptions | ((props: any) => NativeStackNavigationOptions);
};

export type Job = {
    company: string;
    role: string;
    status: string;
    dateApplied: string;
    location?: string;
    jobSetup?: string;
    jobType?: string;
    salary?: string;
    applicationLink?: string;
    interviewLink?: string;
    interviewDatetime?: string;
    recruiterName?: string;
    recruiterContact?: string;
    notes?: string;
};
