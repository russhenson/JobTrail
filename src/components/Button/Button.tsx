import { Pressable, Text } from 'react-native';

export const Button = ({ title, onPress, outlined }: { title: string; onPress: () => void; outlined?: boolean }) => {
    return (
        <Pressable
            className={`rounded-2xl p-4 ${outlined ? 'border-brand-default border' : 'bg-brand-default'} active:opacity-90`}
            onPress={onPress}>
            <Text className={`${outlined ? 'text-brand-default' : 'text-white'} text-center text-lg font-medium`}>{title}</Text>
        </Pressable>
    );
};
