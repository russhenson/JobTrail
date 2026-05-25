import { View, Text, Image, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@_types/navigation';
import { VStack, Button, ScreenContainer, Input, HStack } from '@_components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
type Form = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
};

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>({
        defaultValues: { firstName: '', lastName: '', username: '', password: '', confirmPassword: '' },
    });

    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

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
                    <Text className="text-2xl font-bold text-brand-text">Time to Track the Chaos</Text>
                    <Text className=" text-brand-subtext">
                        Sign up so you can finally stop guessing where you applied and when.
                    </Text>
                </VStack>
                <VStack className="gap-4 p-4">
                    <Input name="firstName" control={control} errors={errors} placeholder="First Name" required />
                    <Input name="lastName" control={control} errors={errors} placeholder="Last Name" required />
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
                    <Input
                        name="confirmPassword"
                        control={control}
                        errors={errors}
                        placeholder="Confirm Password"
                        required
                        secureTextEntry={hideConfirmPassword}
                        rightIconName={hideConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        onIconPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                    />
                    <Button className="mt-4" title="Submit" onPress={handleSubmit(data => console.log(data))} />
                </VStack>
                <HStack className="mt-4 justify-center px-4">
                    <Text className="text-brand-subtext">Already have an account?</Text>
                    <Pressable onPress={() => navigation.replace('Login')} className="active:opacity-80">
                        <Text className="text-brand-default"> Login</Text>
                    </Pressable>
                </HStack>
            </VStack>
        </ScreenContainer>
    );
};
