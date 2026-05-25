import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authScreens } from './screenConfig';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            {authScreens.map(screen => (
                <Stack.Screen
                    key={screen.name}
                    name={screen.name as keyof RootStackParamList}
                    component={screen.component}
                    options={screen.options}
                />
            ))}
        </Stack.Navigator>
    );
}