import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { HStack } from '@_components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { AuthStorage, authEvents } from '@_utils';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const BottomNav: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavProp>();

    const handleAddPress = () => navigation.navigate('Form');

    const handleLogout = async () => {
        await AuthStorage.clear();
        authEvents.emit();
    };

    return (
        <View
            className="absolute bottom-0 left-0 right-0 rounded-t-4xl bg-brand-default px-6 pt-4"
            style={{ paddingBottom: insets.bottom + 16 }}>
            {/* FAB */}
            <Pressable
                onPress={handleAddPress}
                className="absolute -top-10 self-center rounded-full border-[6px] border-white/50 bg-brand-default p-4 active:bg-[#53a68c]"
                style={{ zIndex: 10, left: '50%', marginLeft: -38 / 2 }}>
                <Icon name="plus" size={38} color="white" />
            </Pressable>

            <HStack className="items-center justify-between">
                {/* Home */}
                <Pressable className="flex-1 items-center gap-1">
                    <Icon name="home-outline" size={24} color="white" />
                    <Text className="text-[10px] font-medium text-white">Home</Text>
                </Pressable>

                {/* Stats — coming soon */}
                <Pressable className="flex-1 items-center gap-1 opacity-40" disabled>
                    <Icon name="chart-box-outline" size={24} color="white" />
                    <Text className="text-[10px] font-medium text-white">Stats</Text>
                </Pressable>

                {/* Spacer for FAB */}
                <View className="flex-1" />

                {/* Reminders — coming soon */}
                <Pressable className="flex-1 items-center gap-1 opacity-40" disabled>
                    <Icon name="bell-outline" size={24} color="white" />
                    <Text className="text-[10px] font-medium text-white">Reminders</Text>
                </Pressable>

                {/* Logout */}
                <Pressable className="flex-1 items-center gap-1" onPress={handleLogout}>
                    <Icon name="logout" size={24} color="white" />
                    <Text className="text-[10px] font-medium text-white">Logout</Text>
                </Pressable>
            </HStack>
        </View>
    );
};
