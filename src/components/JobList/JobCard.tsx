import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { HStack, VStack, Badge } from '@_components';
import { IconName } from '@_types/ui';
import Icon from '@react-native-vector-icons/material-design-icons';
import { Job } from '@_types/navigation';

type JobCardProps = {
    onPress: () => void;
    job: Job & { id: string };
};

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
    const {
        company,
        role,
        status,
        dateApplied,
        location,
        jobSetup,
        jobType,
        salary,
        applicationLink,
        interviewDatetime,
        recruiterName,
        notes,
    } = job;

    const pills = [
        location && { icon: 'map-marker-outline', label: location },
        jobSetup && { icon: 'office-building-outline', label: jobSetup },
        jobType && { icon: 'briefcase-variant-outline', label: jobType },
    ].filter(Boolean) as { icon: string; label: string }[];

    return (
        <Pressable
            onPress={onPress}
            className="rounded-4xl bg-white p-4 active:opacity-70"
            style={{
                shadowColor: '#1F1F1F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.07,
                elevation: 1,
            }}>
            {/* Top row: date + status */}
            <HStack className="mb-3 items-center justify-between">
                {dateApplied ? (
                    <Text className="text-xs tracking-wide text-gray-400">Applied {dateApplied}</Text>
                ) : (
                    <View />
                )}
                <Badge label={status} />
            </HStack>

            {/* Role + Company */}
            <VStack className="mb-3 gap-0.5">
                <Text className="text-lg font-semibold leading-snug text-brand-text">{role}</Text>
                <Text className="text-sm text-brand-subtext">{company}</Text>
            </VStack>

            {/* Pills */}
            {pills.length > 0 && (
                <HStack className="mb-3 flex-wrap gap-1.5">
                    {pills.map(({ icon, label }) => (
                        <Badge key={label} icon={icon as IconName} label={label} />
                    ))}
                </HStack>
            )}

            {/* Optional details */}
            {(salary || interviewDatetime || recruiterName || applicationLink || notes) && (
                <VStack className="gap-1.5 border-t border-gray-100 pt-3">
                    {salary && (
                        <HStack className="items-center gap-1.5">
                            <Icon name="cash-multiple" size={14} color="#9ca3af" />
                            <Text className="text-sm text-gray-400">{salary}</Text>
                        </HStack>
                    )}
                    {interviewDatetime && (
                        <HStack className="items-center gap-1.5">
                            <Icon name="calendar-clock" size={14} color="#9ca3af" />
                            <Text className="text-sm text-gray-400">Interview: {interviewDatetime}</Text>
                        </HStack>
                    )}
                    {recruiterName && (
                        <HStack className="items-center gap-1.5">
                            <Icon name="account-outline" size={14} color="#9ca3af" />
                            <Text className="text-sm text-gray-400">{recruiterName}</Text>
                        </HStack>
                    )}
                    {applicationLink && (
                        <HStack className="items-center gap-1.5">
                            <Icon name="link-variant" size={14} color="#9ca3af" />
                            <Text className="text-sm text-gray-400" numberOfLines={1}>
                                {applicationLink}
                            </Text>
                        </HStack>
                    )}
                    {notes && (
                        <HStack className="items-start gap-1.5">
                            <Icon name="note-text-outline" size={14} color="#9ca3af" />
                            <Text className="flex-1 text-sm text-gray-400" numberOfLines={2}>
                                {notes}
                            </Text>
                        </HStack>
                    )}
                </VStack>
            )}
        </Pressable>
    );
};
