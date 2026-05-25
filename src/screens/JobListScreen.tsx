import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { VStack, DashboardHeader, BottomNav, JobCard } from '@_components';
import { FlatList, ActivityIndicator } from 'react-native';
import { useJobs } from '@_hooks/useJobs';
import { View, Text } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useJobs();
    const jobs = data?.pages.flatMap(page => page.jobs) ?? [];

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

            <FlatList
                data={jobs}
                keyExtractor={item => item._id}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => (
                    <JobCard
                        company={item.company}
                        role={item.role}
                        status={item.status}
                        dateApplied={item.dateApplied}
                        location={item.location}
                        jobSetup={item.jobSetup}
                        jobType={item.jobType}
                        salary={item.salary}
                        interviewDatetime={item.interviewDatetime}
                        recruiterName={item.recruiterName}
                        notes={item.notes}
                    />
                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                onRefresh={refetch}
                refreshing={isRefetching}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size="small" color="#56ab91" style={{ marginVertical: 16 }} />
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="items-center py-12">
                            <Text className="text-brand-subtext">No applications yet.</Text>
                            <Text className="text-brand-gray text-sm">Tap + to add your first one.</Text>
                        </View>
                    ) : null
                }
            />

            <BottomNav />
        </VStack>
    );
};
