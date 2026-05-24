import { View } from 'react-native';

export const VStack = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <View className={`flex-col ${className}`}>{children}</View>;
};
