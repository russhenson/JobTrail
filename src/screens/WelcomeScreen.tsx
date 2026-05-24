import { View, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { VStack, Button, ScreenContainer } from '@_components';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({}) => {
    return (
        <ScreenContainer safeAreaBottom noPadding className="bg-[#effffc]">
            <VStack className="flex-1">
                <View className="h-1/2 items-center justify-center rounded-b-3xl bg-[#B8E9E5]">
                    <Image source={require('@_assets/jobtrail-icon.png')} className="h-64 w-64" resizeMode="contain" />
                </View>
                <VStack className="p-4">
                    <Text>Welcome to JobTrail!</Text>
                    <Text>So… how many job applications did you forget about this week?</Text>
                    <Button title="Login" onPress={() => {}} />
                    <Button title="Sign Up" onPress={() => {}} />
                </VStack>
            </VStack>
        </ScreenContainer>
    );
};
