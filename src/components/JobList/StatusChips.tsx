import { View, Text, Pressable } from 'react-native';
import { STATUS_CHIPS, DATE_FILTERS } from '@_constants';
import { StatusCounts } from '@_hooks/useJobs';

type StatusChipsProps = {
    activeDate?: string;
    activeStatus?: string;
    statusCounts?: StatusCounts;
    onStatusPress?: (label: string) => void;
    onDatePress?: (label: string) => void;
};

export const StatusChips: React.FC<StatusChipsProps> = ({
    activeDate = 'All',
    activeStatus,
    statusCounts,
    onStatusPress,
    onDatePress,
}) => (
    <View>
        {/* Status chips */}
        <View className="flex-row flex-wrap gap-2">
            {STATUS_CHIPS.map(({ label, bg, border, text }) => {
                const count = statusCounts?.[label as keyof StatusCounts] ?? 0;
                console.log('STATUS COUNTS:', statusCounts, '| label:', label, '| count:', count);

                const isActive = activeStatus === label;
                return (
                    <Pressable
                        key={label}
                        onPress={() => onStatusPress?.(label)}
                        className="flex-row items-center gap-1.5 rounded-full border py-1.5 pl-1.5 pr-3"
                        style={{
                            backgroundColor: bg,
                            borderColor: isActive ? text : border,
                            borderWidth: isActive ? 1.5 : 1,
                        }}>
                        <View
                            className="h-5 w-5 items-center justify-center rounded-full"
                            style={{ backgroundColor: border }}>
                            <Text className="text-[10px] font-bold" style={{ color: text }}>
                                {count}
                            </Text>
                        </View>
                        <Text className="text-xs font-medium" style={{ color: text }}>
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>

        {/* Divider */}
        <View className="my-3 flex-row items-center gap-2">
            <View className="flex-1" style={{ height: 0.5, backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <Text className="text-[10px] uppercase tracking-widest text-white/40">Filter by application date</Text>
            <View className="flex-1" style={{ height: 0.5, backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </View>

        {/* Date filters */}
        <View className="flex-row gap-2">
            {DATE_FILTERS.map(({ label }) => {
                const active = activeDate === label;
                return (
                    <Pressable
                        key={label}
                        onPress={() => onDatePress?.(label)}
                        className="flex-1 items-center rounded-full border py-1.5"
                        style={{
                            backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.1)',
                            borderColor: active ? '#ffffff' : 'rgba(255,255,255,0.25)',
                        }}>
                        <Text
                            className="text-xs font-medium"
                            style={{ color: active ? '#56ab91' : 'rgba(255,255,255,0.8)' }}>
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    </View>
);
