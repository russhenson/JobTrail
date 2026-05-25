import { Text, View } from 'react-native';

export const AlertMessage = ({ message, type }: { message: string; type: 'success' | 'error' | 'danger' }) => {
    let bgColor = 'bg-red-100';
    let textColor = 'text-red-700';

    if (type === 'success') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
    } else if (type === 'error') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
    } else if (type === 'danger') {
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-700';
    }

    return (
        <View className={`rounded-lg ${bgColor} px-4 py-3`}>
            <Text className={textColor}>{message}</Text>
        </View>
    );
};
