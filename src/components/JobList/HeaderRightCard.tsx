import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import { HStack } from '@_components';
import { getRandomMotivation } from '@_constants';

const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.25)',
};

const iconBg = { backgroundColor: 'rgba(255,255,255,0.2)' };

// ─── Shared wrapper ───────────────────────────────────────────────────────────
const RightCard: React.FC<{ children: React.ReactNode; onPress?: () => void }> = ({
    children,
    onPress,
}) => (
    <Pressable
        onPress={onPress}
        className="flex-1 gap-2 rounded-2xl border px-3.5 py-3"
        style={cardStyle}>
        {children}
    </Pressable>
);

// ─── ReminderCard ─────────────────────────────────────────────────────────────
type Interview = { company: string; role: string; datetime: string };

export const ReminderCard: React.FC<{ interview: Interview; onPress?: () => void }> = ({
    interview,
    onPress,
}) => (
    <RightCard onPress={onPress}>
        <HStack className="items-center gap-1.5">
            <View className="h-7 w-7 items-center justify-center rounded-lg" style={iconBg}>
                <Icon name="calendar-outline" size={14} color="white" />
            </View>
            <Text className="text-[11px] text-white/75">Upcoming interview</Text>
        </HStack>
        <Text className="text-sm font-medium leading-snug text-white" numberOfLines={1}>
            {interview.company} — {interview.role}
        </Text>
        <HStack className="items-center gap-1">
            <Icon name="clock-outline" size={11} color="#FFFFFF99" />
            <Text className="text-[11px] text-white/80">{interview.datetime}</Text>
        </HStack>
    </RightCard>
);

// ─── NudgeCard ────────────────────────────────────────────────────────────────
export const NudgeCard: React.FC<{ count: number; onPress?: () => void }> = ({
    count,
    onPress,
}) => (
    <RightCard onPress={onPress}>
        <HStack className="items-center gap-1.5">
            <View className="h-7 w-7 items-center justify-center rounded-lg" style={iconBg}>
                <Icon name="bell-ring-outline" size={14} color="white" />
            </View>
            <Text className="text-[11px] text-white/75">Action needed</Text>
        </HStack>
        <Text className="text-sm font-medium leading-snug text-white">
            {count} application{count !== 1 ? 's' : ''} need a follow-up
        </Text>
        <HStack className="items-center gap-1">
            <Text className="text-[11px] text-white/70">Tap to review</Text>
            <Icon name="arrow-right" size={11} color="#FFFFFF70" />
        </HStack>
    </RightCard>
);

// ─── LastActivityCard ─────────────────────────────────────────────────────────
type RecentApplication = { jobTitle: string; company: string; daysAgo: number };

export const LastActivityCard: React.FC<{ job: RecentApplication; onPress?: () => void }> = ({
    job,
    onPress,
}) => {
    const when =
        job.daysAgo === 0 ? 'Today'
        : job.daysAgo === 1 ? 'Yesterday'
        : `${job.daysAgo} days ago`;

    return (
        <RightCard onPress={onPress}>
            <HStack className="items-center gap-1.5">
                <View className="h-7 w-7 items-center justify-center rounded-lg" style={iconBg}>
                    <Icon name="history" size={14} color="white" />
                </View>
                <Text className="text-[11px] text-white/75">Last added</Text>
            </HStack>
            <Text className="text-sm font-medium leading-snug text-white" numberOfLines={1}>
                {job.jobTitle}
            </Text>
            <HStack className="items-center gap-1">
                <Icon name="office-building-outline" size={11} color="#FFFFFF99" />
                <Text className="text-[11px] text-white/80" numberOfLines={1}>
                    {job.company} · {when}
                </Text>
            </HStack>
        </RightCard>
    );
};

// ─── MotivationCard ───────────────────────────────────────────────────────────
export const MotivationCard: React.FC = () => (
    <RightCard>
        <HStack className="items-center gap-1.5">
            <View className="h-7 w-7 items-center justify-center rounded-lg" style={iconBg}>
                <Icon name="lightning-bolt-outline" size={14} color="white" />
            </View>
            <Text className="text-[11px] text-white/75">Daily boost</Text>
        </HStack>
        <Text className="text-sm font-medium leading-snug text-white italic">
            {getRandomMotivation()}
        </Text>
    </RightCard>
);

// ─── Conditional renderer ─────────────────────────────────────────────────────
type HeaderRightCardProps = {
    upcomingInterview?: Interview;
    pendingFollowUps?: number;
    recentApplication?: RecentApplication;
    onInterviewPress?: () => void;
    onFollowUpPress?: () => void;
    onRecentPress?: () => void;
};

export const HeaderRightCard: React.FC<HeaderRightCardProps> = ({
    upcomingInterview,
    pendingFollowUps = 0,
    recentApplication,
    onInterviewPress,
    onFollowUpPress,
    onRecentPress,
}) => {
    if (upcomingInterview)
        return <ReminderCard interview={upcomingInterview} onPress={onInterviewPress} />;
    if (pendingFollowUps > 0)
        return <NudgeCard count={pendingFollowUps} onPress={onFollowUpPress} />;
    if (recentApplication)
        return <LastActivityCard job={recentApplication} onPress={onRecentPress} />;
    return <MotivationCard />;
};