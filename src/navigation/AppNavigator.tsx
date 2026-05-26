import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from './screenConfig';
import { RootStackParamList } from '../types/navigation';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screens shown when the user is logged in (Home, Form)
// Also sets up React Query here so all screens can use it
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
