import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { DashboardHeader, BottomNav, JobCard } from '@_components';
import { FlatList, ActivityIndicator } from 'react-native';
import { useJobs } from '@_hooks/useJobs';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined);
    const [activeDate, setActiveDate] = useState('All');

    const filters = {
        status: activeStatus,
        dateFilter: activeDate !== 'All' ? activeDate : undefined,
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useJobs(filters);

    const queryClient = useQueryClient();
    const [isPulling, setIsPulling] = useState(false);

    // pull dashboard data from first page
    const firstPage = data?.pages[0];

    const jobs = data?.pages.flatMap(page => page.jobs.map(job => ({ ...job, id: job._id }))) ?? [];

    useFocusEffect(
        useCallback(() => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    const handleRefresh = async () => {
        setIsPulling(true);
        await refetch();
        setIsPulling(false);
    };

    const handleStatusPress = (label: string) => {
        // toggle off if already active
        setActiveStatus(prev => (prev === label ? undefined : label));
    };

    const handleDatePress = (label: string) => {
        setActiveDate(label);
    };

    return (
        <View style={{ flex: 1 }} className="bg-white">
            <View style={{ flexShrink: 0 }}>
                <DashboardHeader
                    total={firstPage?.total ?? 0}
                    statusCounts={firstPage?.statusCounts}
                    upcomingInterview={firstPage?.upcomingInterview}
                    pendingFollowUps={firstPage?.pendingFollowUps}
                    recentApplication={firstPage?.recentApplication}
                    activeStatus={activeStatus}
                    activeDate={activeDate}
                    onStatusPress={handleStatusPress}
                    onDatePress={handleDatePress}
                    onInterviewPress={() => console.log('Go to interview')}
                    onFollowUpPress={() => setActiveStatus('Follow Up')}
                    onRecentPress={() => console.log('Go to recent')}
                />
            </View>

            {/* SCROLL AREA */}
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 120,
                }}
                data={jobs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View className="mb-3">
                        <JobCard job={item} onPress={() => navigation.navigate('Form', { job: item, id: item.id })} />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                onRefresh={handleRefresh}
                refreshing={isPulling}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="items-center py-12">
                            <Text className="text-brand-subtext">No applications yet.</Text>
                            <Text className="text-sm text-brand-gray">Tap + to add your first one.</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size="small" color="#56ab91" style={{ marginVertical: 16 }} />
                    ) : null
                }
            />
            <BottomNav />
        </View>
    );
};
