import { View } from 'react-native';

export const HStack = ({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}) => {
    return (
        <View className={`flex-row ${className}`} {...props}>
            {children}
        </View>
    );
};
