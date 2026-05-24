import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const JobListScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View>
            <Text>Job List Screen</Text>
            <Button title="Add Job" onPress={() => navigation.navigate('Form')} />
        </View>
    );
}
