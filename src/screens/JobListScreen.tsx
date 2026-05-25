import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { DashboardHeader, BottomNav, JobCard } from '@_components';
import { FlatList, ActivityIndicator } from 'react-native';
import { useJobs } from '@_hooks/useJobs';
import { View, Text } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useJobs();
    const jobs =
        data?.pages.flatMap(page =>
            page.jobs.map(job => ({
                ...job,
                id: job._id,
            })),
        ) ?? [];
    return (
        <View style={{ flex: 1 }} className="bg-white">
            <View style={{ flexShrink: 0 }}>
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
                onRefresh={refetch}
                refreshing={isRefetching}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="items-center py-12">
                            <Text className="text-brand-subtext">No applications yet.</Text>
                            <Text className="text-sm text-brand-gray">Tap + to add your first one.</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color="#56ab91" /> : null}
            />
            <BottomNav />
        </View>
    );
};
