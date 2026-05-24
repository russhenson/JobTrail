import { View } from 'react-native';

export const HStack = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <View className={`flex-row ${className}`}>{children}</View>;
};
