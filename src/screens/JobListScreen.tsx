import { View, Text, Button, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { AuthStorage, authEvents } from '@_utils';
import Icon from '@react-native-vector-icons/material-design-icons';
import { VStack } from '@_components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        // flow: clear token → emit event → RootNavigator re-checks → Auth screen instantly
        await AuthStorage.clear();
        authEvents.emit();
    };

    return (
        <VStack className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
            <View className="p-4">
                <View
                    className="rounded-2xl bg-white p-4"
                    style={{
                        shadowColor: '#1F1F1F',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.07,
                        elevation: 1,
                    }}>
                    <Text>mma mo</Text>
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
