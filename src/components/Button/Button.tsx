import { Pressable, Text } from 'react-native';

export const Button = ({
    title,
    onPress,
    outlined,
    className,
}: {
    title: string;
    onPress: () => void;
    outlined?: boolean;
    className?: string;
}) => {
    return (
        <Pressable
            className={`rounded-2xl p-4 ${outlined ? 'border border-brand-default' : 'bg-brand-default'} active:opacity-90 ${className || ''}`}
            onPress={onPress}>
            <Text className={`${outlined ? 'text-brand-default' : 'text-white'} text-center text-lg font-medium`}>
                {title}
            </Text>
        </Pressable>
    );
};
