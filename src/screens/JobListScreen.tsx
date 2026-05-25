import { View, Text, Button, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { AuthStorage, authEvents } from '@_utils';
import Icon from '@react-native-vector-icons/material-design-icons';
import { HStack, VStack, Badge } from '@_components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconName } from '@_types/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        // flow: clear token → emit event → RootNavigator re-checks → Auth screen instantly
        await AuthStorage.clear();
        authEvents.emit();
    };

    return (
        <VStack className="flex-1 bg-gray-50">
            <VStack className="rounded-b-4xl bg-brand-default px-6 py-4" style={{ paddingTop: insets.top }}>
                <VStack>
                    {/* Total + Reminder row */}
                    <HStack className="mb-3 gap-2.5" style={{ alignItems: 'stretch' }}>
                        {/* Hero total */}
                        <View
                            className="justify-center rounded-2xl border border-white/40 bg-white/25 px-4 py-3.5"
                            style={{ minWidth: 100 }}>
                            <Text className="text-4xl font-medium leading-none text-white">27</Text>
                            <Text className="mt-1 text-[11px] leading-snug text-white/80">Total{'\n'}Applications</Text>
                        </View>

                        {/* Reminder */}
                        <View className="flex-1 gap-2 rounded-2xl border border-white/30 bg-white/20 px-3.5 py-3">
                            <HStack className="items-center gap-1.5">
                                <View className="h-7 w-7 items-center justify-center rounded-lg bg-white/25">
                                    <Icon name="calendar-outline" size={14} color="white" />
                                </View>
                                <Text className="text-[11px] text-white/75">Upcoming interview</Text>
                            </HStack>
                            <Text className="text-sm font-medium leading-snug text-white">Google — UX Engineer</Text>
                            <HStack className="items-center gap-1">
                                <Icon name="clock-outline" size={12} color="#FFFFFF99" />
                                <Text className="text-[11px] text-white/70">Tomorrow, 10:00 AM</Text>
                            </HStack>
                        </View>
                    </HStack>
                    {/* Status row 1 */}
                    <View className="mb-2 flex-row gap-2">
                        {[
                            { label: 'Saved', count: 4 },
                            { label: 'Applied', count: 12 },
                            { label: 'Follow Up', count: 3 },
                            { label: 'Interview', count: 2 },
                        ].map(({ label, count }) => (
                            <View
                                key={label}
                                className="flex-1 items-center rounded-xl border border-white/30 bg-white/25 py-2">
                                <Text className="text-xl font-medium text-white">{count}</Text>
                                <Text className="mt-0.5 text-[10px] text-white/80">{label}</Text>
                            </View>
                        ))}
                    </View>
                    {/* Status row 2 */}
                    <View className="mb-4 flex-row gap-2">
                        {[
                            { label: 'Offer', count: 1, danger: false },
                            { label: 'Hired', count: 0, danger: false },
                            { label: 'Rejected', count: 5, danger: true },
                        ].map(({ label, count, danger }) => (
                            <View
                                key={label}
                                className="flex-1 items-center rounded-xl border border-white/30 bg-white/25 py-2.5">
                                <Text className={`text-xl font-medium ${danger ? 'text-red-500' : 'text-white'}`}>
                                    {count}
                                </Text>
                                <Text className={`mt-0.5 text-[10px] ${danger ? 'text-red-500/80' : 'text-white/80'}`}>
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                        {[
                            { label: 'All', active: true },
                            { label: 'Last 3 days' },
                            { label: 'This week' },
                            { label: 'This month' },
                        ].map(({ label, active }) => (
                            <Pressable
                                key={label}
                                className={`flex-row items-center gap-1 rounded-full border px-3.5 py-1.5 ${
                                    active ? 'border-white bg-white' : 'border-white/25 bg-white/10'
                                }`}>
                                <Text className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-white/70'}`}>
                                    {label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </VStack>
            </VStack>
            <View id="flatlist" className=" p-4">
                <View
                    id="card"
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
                            <Badge icon={icon as IconName} label={label} />
                        ))}
                    </HStack>

                    <View className="border-t border-gray-100 pt-3">
                        <Text className="text-sm text-gray-400">₱80,000 - ₱120,000 / mo</Text>
                    </View>
                </View>
            </View>

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
