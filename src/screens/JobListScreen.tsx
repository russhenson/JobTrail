import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { AuthStorage, authEvents } from '@_utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    const handleLogout = async () => {
        // flow: clear token → emit event → RootNavigator re-checks → Auth screen instantly
        await AuthStorage.clear();
        authEvents.emit();
    };

    return (
        <View>
            <Text>Job List Screen</Text>

            <Button title="Add Job" onPress={() => navigation.navigate('Form')} />

            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};
