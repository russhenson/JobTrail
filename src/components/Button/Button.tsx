import { Pressable, Text, ActivityIndicator } from 'react-native';

export const Button = ({
    title,
    onPress,
    outlined,
    className,
    loading,
    disabled,
}: {
    title: string;
    onPress: () => void;
    outlined?: boolean;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
}) => {
    return (
        <Pressable
            className={`rounded-2xl p-4 ${outlined ? 'border border-brand-default' : 'bg-brand-default'} active:opacity-90 ${className || ''}`}
            onPress={onPress}
            disabled={disabled}>
            {loading ? (
                <ActivityIndicator color={outlined ? 'brand-default' : 'white'} />
            ) : (
                <Text className={`${outlined ? 'text-brand-default' : 'text-white'} text-center font-medium`}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
};
