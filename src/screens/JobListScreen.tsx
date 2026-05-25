import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { HStack, VStack, Badge, DashboardHeader, BottomNav, JobCard } from '@_components';
import { IconName } from '@_types/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
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
            

            <JobCard
                company="Acme Corporation"
                role="Senior Product Designer"
                status="Applied"
                dateApplied="12 Jan 2025"
                location="Manila, PH"
                jobSetup="Hybrid"
                jobType="Full-time"
                salary="₱80,000 - ₱120,000 / mo"
                interviewDatetime="20 Jan 2025, 10:00 AM"
                recruiterName="Jane Doe"
                notes="Referral from a friend. Good vibes."
            />

            <BottomNav />
        </VStack>
    );
};
