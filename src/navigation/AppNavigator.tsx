import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from './screenConfig';
import { RootStackParamList } from '../types/navigation';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Stack.Navigator initialRouteName="Home">
                {screens.map(screen => (
                    <Stack.Screen
                        key={screen.name}
                        name={screen.name as keyof RootStackParamList}
                        component={screen.component}
                        options={screen.options}
                    />
                ))}
            </Stack.Navigator>
        </QueryClientProvider>
    );
}
