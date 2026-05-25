import { View, Text } from 'react-native';
import { HStack, VStack } from '@_components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderRightCard } from './HeaderRightCard';
import { StatusChips } from './StatusChips';
import { StatusCounts, UpcomingInterview, RecentApplication } from '@_hooks/useJobs';

type DashboardHeaderProps = {
    total: number;
    statusCounts?: StatusCounts;
    upcomingInterview?: UpcomingInterview | null;
    pendingFollowUps?: number;
    recentApplication?: RecentApplication | null;
    activeStatus?: string;
    activeDate?: string;
    onStatusPress?: (label: string) => void;
    onDatePress?: (label: string) => void;
    onInterviewPress?: () => void;
    onFollowUpPress?: () => void;
    onRecentPress?: () => void;
};

const glassCard = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.25)',
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    total,
    statusCounts,
    upcomingInterview,
    pendingFollowUps = 0,
    recentApplication,
    activeStatus,
    activeDate,
    onStatusPress,
    onDatePress,
    onInterviewPress,
    onFollowUpPress,
    onRecentPress,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <VStack className="rounded-b-4xl bg-brand-default px-6 py-4" style={{ paddingTop: insets.top + 8 }}>
            {/* Total + right card */}
            <HStack className="mb-4 gap-2.5" style={{ alignItems: 'stretch' }}>
                <View className="justify-center rounded-2xl border px-4 py-3.5" style={{ minWidth: 100, ...glassCard }}>
                    <Text className="text-4xl font-medium leading-none text-white">{total}</Text>
                    <Text className="mt-1 text-[11px] leading-snug text-white/80">Total{'\n'}Applications</Text>
                </View>

                <HeaderRightCard
                    upcomingInterview={upcomingInterview ?? undefined}
                    pendingFollowUps={pendingFollowUps}
                    recentApplication={recentApplication ?? undefined}
                    onInterviewPress={onInterviewPress}
                    onFollowUpPress={onFollowUpPress}
                    onRecentPress={onRecentPress}
                />
            </HStack>

            <StatusChips
                activeDate={activeDate}
                activeStatus={activeStatus}
                statusCounts={statusCounts}
                onStatusPress={onStatusPress}
                onDatePress={onDatePress}
            />
        </VStack>
    );
};
