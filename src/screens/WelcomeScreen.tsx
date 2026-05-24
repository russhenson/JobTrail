import { View, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { VStack, Button, ScreenContainer } from '@_components';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <ScreenContainer safeAreaBottom noPadding>
            <VStack className="flex-1">
                <View className="flex-1 items-center justify-center overflow-hidden rounded-b-7xl bg-brand-default">
                    <Image
                        source={require('@_assets/jobtrail-icon.png')}
                        className="h-full w-full opacity-80"
                        resizeMode="cover"
                    />
                </View>
                <VStack className="px-4 py-12">
                    <Text className="mb-2 text-4xl font-bold text-brand-text">Never Lose a Job Application Again</Text>
                    <Text className="text-2xl text-brand-subtext">
                        Because "I think I applied there..." isn't a tracking system.
                    </Text>
                    <VStack className="mt-12 gap-4">
                        <Button title="Login" onPress={() => {}} />
                        <Button title="Sign Up" outlined onPress={() => navigation.navigate('SignUp')} />
                    </VStack>
                </VStack>
            </VStack>
        </ScreenContainer>
    );
};
