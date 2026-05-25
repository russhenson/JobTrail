import { View, Text, Image, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { VStack, Button, ScreenContainer, Input, HStack } from '@_components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type Form = {
    username: string;
    password: string;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>({
        defaultValues: { username: '', password: '' },
    });

    const [hidePassword, setHidePassword] = useState(true);

    const onSubmit = (data: Form) => {
        console.log(data);
        navigation.replace('Home');
    };

    return (
        <ScreenContainer safeAreaBottom noPadding>
            <VStack className="flex-1">
                <View className="h-[30%] items-center justify-center overflow-hidden rounded-b-7xl bg-brand-default">
                    <Image
                        source={require('@_assets/blob-1.png')}
                        className="h-full w-full opacity-80"
                        resizeMode="cover"
                    />
                </View>
                <VStack className="mb-2 mt-6 px-4">
                    <Text className="text-2xl font-bold text-brand-text">Sign In to Continue Tracking</Text>
                    <Text className=" text-brand-subtext">
                        Pick up where you left off (hopefully not 37 applications ago).
                    </Text>
                </VStack>
                <VStack className="gap-4 p-4">
                    <Input name="username" control={control} errors={errors} placeholder="Username" required />
                    <Input
                        name="password"
                        control={control}
                        errors={errors}
                        placeholder="Password"
                        required
                        secureTextEntry={hidePassword}
                        rightIconName={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                        onIconPress={() => setHidePassword(!hidePassword)}
                    />

                    <Button className="mt-4" title="Login" onPress={handleSubmit(onSubmit)} />
                </VStack>
                <HStack className="mt-4 justify-center px-4">
                    <Text className="text-brand-subtext">Don't have an account?</Text>
                    <Pressable onPress={() => navigation.replace('SignUp')} className="active:opacity-50">
                        <Text className="text-brand-default"> Sign up</Text>
                    </Pressable>
                </HStack>
            </VStack>
        </ScreenContainer>
    );
};
