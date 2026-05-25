import React from 'react';
import { View, Text } from 'react-native';
import { HStack, VStack } from '@_components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderRightCard } from './HeaderRightCard';
import { StatusChips } from './StatusChips';

type DashboardHeaderProps = {
    totalApplications: number;
    upcomingInterview?: React.ComponentProps<typeof HeaderRightCard>['upcomingInterview'];
    pendingFollowUps?: number;
    recentApplication?: React.ComponentProps<typeof HeaderRightCard>['recentApplication'];
    onInterviewPress?: () => void;
    onFollowUpPress?: () => void;
    onRecentPress?: () => void;
};

const glassCard = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.25)',
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    totalApplications,
    upcomingInterview,
    pendingFollowUps,
    recentApplication,
    onInterviewPress,
    onFollowUpPress,
    onRecentPress,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <VStack
            className="rounded-b-4xl bg-brand-default px-6 py-4"
            style={{ paddingTop: insets.top + 8 }}>

            {/* Total + right card */}
            <HStack className="mb-4 gap-2.5" style={{ alignItems: 'stretch' }}>
                <View
                    className="justify-center rounded-2xl border px-4 py-3.5"
                    style={{ minWidth: 100, ...glassCard }}>
                    <Text className="text-4xl font-medium leading-none text-white">
                        {totalApplications}
                    </Text>
                    <Text className="mt-1 text-[11px] leading-snug text-white/80">
                        Total{'\n'}Applications
                    </Text>
                </View>

                <HeaderRightCard
                    upcomingInterview={upcomingInterview}
                    pendingFollowUps={pendingFollowUps}
                    recentApplication={recentApplication}
                    onInterviewPress={onInterviewPress}
                    onFollowUpPress={onFollowUpPress}
                    onRecentPress={onRecentPress}
                />
            </HStack>

            {/* Chips + filters */}
            <StatusChips />
        </VStack>
    );
};