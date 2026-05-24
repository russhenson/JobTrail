import { Pressable, Text } from 'react-native';

export const Button = ({ title, onPress, outlined }: { title: string; onPress: () => void; outlined?: boolean }) => {
    return (
        <Pressable className={outlined ? 'border border-blue-500' : ''} onPress={onPress}>
            <Text>{title}</Text>
        </Pressable>
    );
};
