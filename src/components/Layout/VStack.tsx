import { View } from 'react-native';

export const VStack = ({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}) => {
    return (
        <View className={`flex-col ${className}`} {...props}>
            {children}
        </View>
    );
};
