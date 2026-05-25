import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { AuthStorage, authEvents } from '@_utils';
import Icon from '@react-native-vector-icons/material-design-icons';
import { HStack, VStack, Badge, DashboardHeader } from '@_components';
import { IconName } from '@_types/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const handleLogout = async () => {
        await AuthStorage.clear();
        authEvents.emit();
    };

    return (
        <VStack className="flex-1 bg-gray-50">
            <DashboardHeader
                totalApplications={27}
                upcomingInterview={{
                    company: 'Google',
                    role: 'UX Engineer',
                    datetime: 'Tomorrow, 10:00 AM',
                }}
                pendingFollowUps={3}
                recentApplication={{
                    jobTitle: 'Senior Product Designer',
                    company: 'Acme Corporation',
                    daysAgo: 2,
                }}
                onInterviewPress={() => console.log('Go to interview')}
                onFollowUpPress={() => console.log('Go to follow-ups')}
                onRecentPress={() => console.log('Go to recent')}
            />

            <View className="p-4">
                <View
                    className="rounded-2xl bg-white p-4"
                    style={{
                        shadowColor: '#1F1F1F',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.07,
                        elevation: 1,
                    }}>
                    <HStack className="mb-3 items-center justify-between">
                        <Text className="text-xs tracking-wide text-gray-400">Applied 12 Jan 2025</Text>
                        <Badge label="Applied" />
                    </HStack>
                    <VStack className="mb-3 gap-0.5">
                        <Text className="text-lg font-semibold leading-snug text-brand-text">
                            Senior Product Designer
                        </Text>
                        <Text className="text-sm text-brand-subtext">Acme Corporation</Text>
                    </VStack>
                    <HStack className="mb-4 flex-wrap gap-1.5">
                        {[
                            { icon: 'map-marker-outline', label: 'Manila, PH' },
                            { icon: 'office-building-outline', label: 'Hybrid' },
                            { icon: 'briefcase-variant-outline', label: 'Full-time' },
                        ].map(({ icon, label }) => (
                            <Badge key={label} icon={icon as IconName} label={label} />
                        ))}
                    </HStack>
                    <View className="border-t border-gray-100 pt-3">
                        <Text className="text-sm text-gray-400">₱80,000 - ₱120,000 / mo</Text>
                    </View>
                </View>
            </View>

            {/* Bottom nav */}
            <View className="absolute bottom-0 left-0 right-0 h-24 items-center justify-center rounded-t-4xl bg-brand-default px-6 py-4">
                <Pressable
                    onPress={() => navigation.navigate('Form')}
                    className="absolute -top-10 z-10 rounded-full border-[6px] border-gray-50 bg-brand-default p-4 active:bg-[#53a68c]">
                    <Icon name="plus" size={42} color="white" />
                </Pressable>
                <Pressable className="self-end" onPress={handleLogout}>
                    <Icon name="logout" size={30} color="white" />
                </Pressable>
            </View>
        </VStack>
    );
};
