import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Form'>;

export const JobFormScreen: React.FC<Props> = ({ route, navigation }) => {
    const jobId = route.params?.jobId;
    const isEdit = !!jobId;

    return (
        <View>
            <Text>{isEdit ? 'Edit Job' : 'Create Job'}</Text>
            <Button title="Save (mock)" onPress={() => navigation.goBack()} />
        </View>
    );
};
